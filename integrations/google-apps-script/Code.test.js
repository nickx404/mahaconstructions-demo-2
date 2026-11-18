import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

function receiver({ emailFails = false } = {}) {
  const rows = [];
  const emails = [];
  const display = { hidden: null, timeZone: 'Etc/UTC', dateFormat: null };
  const sheet = {
    hideColumns: (column) => { display.hidden = column; },
    getLastRow: () => rows.length,
    appendRow: (values) => rows.push([...values]),
    getRange: (row, col, height = 1, width = 1) => ({
      setNumberFormat: (format) => { display.dateFormat = { row, col, height, format }; },
      getValue: () => rows[row - 1]?.[col - 1],
      getValues: () => Array.from({ length: height }, (_, index) => rows[row + index - 1].slice(col - 1, col - 1 + width)),
      setValue: (value) => { rows[row - 1][col - 1] = value; },
      setValues: (values) => values.forEach((valuesRow, index) => {
        rows[row + index - 1] ||= [];
        valuesRow.forEach((value, offset) => { rows[row + index - 1][col + offset - 1] = value; });
      }),
    }),
  };
  const config = { ALLOWED_ORIGINS: 'http://localhost:5173', SPREADSHEET_ID: 'private-sheet', NOTIFICATION_EMAIL: 'test@example.com' };
  const context = vm.createContext({
    PropertiesService: { getScriptProperties: () => ({ getProperty: (key) => config[key] }) },
    LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
    SpreadsheetApp: { openById: () => ({ getSpreadsheetTimeZone: () => display.timeZone, setSpreadsheetTimeZone: (zone) => { display.timeZone = zone; }, getSheetByName: () => rows.length ? sheet : null, insertSheet: () => sheet, getUrl: () => 'https://example.com/private-sheet' }), flush() {} },
    MailApp: { getRemainingDailyQuota: () => 10, sendEmail: (email) => { if (emailFails) throw new Error('Mail unavailable'); emails.push(email); } },
    HtmlService: { XFrameOptionsMode: { ALLOWALL: 'allow' }, createHtmlOutput: (html) => ({ html, setXFrameOptionsMode() { return this; } }) },
  });
  vm.runInContext(readFileSync(new URL('./Code.gs', import.meta.url), 'utf8'), context);
  return { rows, emails, display, post: (data) => context.doPost({ parameter: { payload: JSON.stringify(data) } }).html };
}

const lead = { id: '11111111-1111-4111-8111-111111111111', nonce: '22222222-2222-4222-8222-222222222222', origin: 'http://localhost:5173', name: 'Test Visitor', phone: '+919000000000', source: 'contact', email: 'visitor@example.com', location: 'Anna Nagar', enquiryTypes: ['Joint Venture'], message: '=A1', page: '/contact' };

test('receiver saves all page details, escapes formulas, emails once and upserts retries', () => {
  const api = receiver();
  assert.match(api.post(lead), /"saved":true/);
  assert.equal(api.rows[1][10], 'visitor@example.com');
  assert.deepEqual(api.rows[1].slice(11), ['contact', 'Joint Venture', "'=A1"]);
  assert.equal(api.rows[1][6], 'Anna Nagar');
  assert.match(api.emails[0].body, /Location: Anna Nagar/);
  assert.match(api.emails[0].body, /Message: =A1/);
  api.post({ ...lead, message: 'Updated details' });
  assert.equal(api.rows.length, 2);
  assert.equal(api.rows[1][13], 'Updated details');
  assert.equal(api.emails.length, 1);
});

test('lead IDs remain internal and Created at shows date and time in IST without changing on retry', () => {
  const api = receiver();
  api.post(lead);
  const createdAt = api.rows[1][1];
  api.post(lead);
  assert.equal(api.display.hidden, 1);
  assert.equal(api.rows[1][0], lead.id);
  assert.equal(api.rows[0][1], 'Created at (IST)');
  assert.equal(api.display.timeZone, 'Asia/Kolkata');
  assert.deepEqual(api.display.dateFormat, { row: 2, col: 2, height: 1, format: 'dd mmm yyyy, hh:mm:ss AM/PM' });
  assert.equal(api.rows[1][1], createdAt);
});

test('email failure preserves the saved Sheet entry and records notification failure', () => {
  const api = receiver({ emailFails: true });
  assert.match(api.post(lead), /"saved":true/);
  assert.match(api.rows[1][9], /Not sent/);
});

test('receiver rejects invalid contacts, unexpected sources and unapproved origins', () => {
  const api = receiver();
  for (const changes of [{ phone: '123' }, { source: 'unknown' }, { enquiryTypes: ['invented'] }, { message: 'x'.repeat(2001) }]) assert.match(api.post({ ...lead, ...changes }), /"saved":false/);
  assert.equal(api.post({ ...lead, origin: 'https://unapproved.example' }), 'Request rejected');
  assert.equal(api.rows.length, 0);
  assert.equal(api.emails.length, 0);
});

test('existing chatbot payloads remain accepted without new fields or visitor email', () => {
  const api = receiver();
  const { source, message, enquiryTypes, email, ...chatbot } = lead;
  assert.match(api.post({ ...chatbot, question: 'Tell me about Kuber', projectName: 'Maha Kuber', intent: 'callback' }), /"saved":true/);
  assert.equal(api.rows[1][11], 'chatbot');
  assert.equal(api.rows[1][7], 'Maha Kuber');
});
