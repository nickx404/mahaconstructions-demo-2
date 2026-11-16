import assert from 'node:assert/strict';
import test from 'node:test';
import { readSavedContact, rememberContact, submitChatbotContact, validateContact } from './chatbotSubmission.js';

const endpoint = 'https://script.google.com/macros/s/test-deployment/exec';
const contact = { id: 'test-lead', name: 'Test Visitor', phone: '9999999999', email: '' };

function receiver(t) {
  const listeners = new Set();
  const nodes = [];
  const storage = new Map();
  for (const [name, value] of Object.entries({
    window: { location: { origin: 'http://localhost:5173' }, addEventListener: (_, callback) => listeners.add(callback), removeEventListener: (_, callback) => listeners.delete(callback) },
    document: {
      createElement: (tag) => {
        const node = { tag, children: [], append(child) { this.children.push(child); }, remove() { this.removed = true; }, submit() {} };
        nodes.push(node);
        return node;
      },
      body: { append() {} },
    },
    sessionStorage: { getItem: (key) => storage.get(key), setItem: (key, value) => storage.set(key, value) },
  })) {
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, name);
    Object.defineProperty(globalThis, name, { value, configurable: true });
    t.after(() => descriptor ? Object.defineProperty(globalThis, name, descriptor) : delete globalThis[name]);
  }
  return {
    nodes, listeners,
    receipt(overrides = {}, origin = 'https://script.google.com') {
      const payload = JSON.parse(nodes.find(({ tag }) => tag === 'input').value);
      for (const listener of listeners) listener({ origin, data: { type: 'maha-lead-receipt', nonce: payload.nonce, id: payload.id, saved: true, ...overrides } });
    },
  };
}

test('contact validation preserves optional email and rejects invalid personal details', () => {
  assert.deepEqual(validateContact(' Test Visitor ', '+91 99999 99999'), { name: 'Test Visitor', phone: '+919999999999', email: '' });
  assert.equal(validateContact('Test Visitor', contact.phone, ' test@example.com ').email, 'test@example.com');
  assert.throws(() => validateContact('T', contact.phone));
  assert.throws(() => validateContact(contact.name, '123'));
  assert.throws(() => validateContact(contact.name, contact.phone, 'invalid'));
});

test('tab contact storage keeps delivery state and lead ID', (t) => {
  receiver(t);
  rememberContact({ ...contact, delivered: false });
  assert.deepEqual(readSavedContact(), { ...contact, delivered: false });
});

test('delivery accepts only a matching receipt from Google and cleans up', async (t) => {
  const fake = receiver(t);
  const saving = submitChatbotContact(contact, endpoint);
  fake.receipt({}, 'https://example.com');
  fake.receipt({ nonce: 'wrong' });
  fake.receipt({ id: 'wrong' });
  assert.equal(fake.listeners.size, 1);
  fake.receipt();
  await saving;
  assert.equal(fake.listeners.size, 0);
  assert.ok(fake.nodes.filter(({ tag }) => tag !== 'input').every(({ removed }) => removed));
});

test('failed receipts reject and retries reuse the existing lead ID', async (t) => {
  const fake = receiver(t);
  const saving = submitChatbotContact(contact, endpoint);
  const failure = assert.rejects(saving, /couldn’t be saved/);
  fake.receipt({ saved: false });
  await failure;
  const retry = submitChatbotContact(contact, endpoint);
  const payload = JSON.parse(fake.nodes.filter(({ tag }) => tag === 'input').at(-1).value);
  assert.equal(payload.id, contact.id);
  const listener = [...fake.listeners][0];
  listener({ origin: 'https://script.google.com', data: { type: 'maha-lead-receipt', nonce: payload.nonce, id: contact.id, saved: true } });
  await retry;
});

test('a missing receiver rejects without claiming delivery', async () => {
  await assert.rejects(submitChatbotContact(contact, ''), /not connected/);
});

test('a missing receipt times out without retaining the transport', async (t) => {
  const fake = receiver(t);
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const failure = assert.rejects(submitChatbotContact(contact, endpoint), /could not be confirmed/);
  t.mock.timers.tick(30001);
  await failure;
  assert.equal(fake.listeners.size, 0);
});
