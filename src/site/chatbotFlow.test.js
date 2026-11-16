import assert from 'node:assert/strict';
import test from 'node:test';
import { completionReply, createEnquiry, resetConversation, routeMessage, menuChoices } from './chatbotFlow.js';
import { ongoingProjects } from './siteContent.js';

const context = { topic: 'project', projectSlug: ongoingProjects[0].slug };
const collecting = { step: 'location', intent: 'callback', context };

test('restart clears enquiry and project context while preserving reusable contact fields', () => {
  const lead = { name: 'Test Visitor', phone: '9999999999', email: 'test@example.com', location: 'Ambattur', id: 'same-id' };
  const next = resetConversation(lead);
  assert.deepEqual(next.context, {});
  assert.equal(next.intent, null);
  assert.equal(next.pending, null);
  assert.equal(next.step, 'chat');
  assert.deepEqual(next.lead, { ...lead, location: '' });
  assert.equal(lead.location, 'Ambattur');
  assert.deepEqual(menuChoices, ['Ongoing projects', 'Joint venture', 'Request a callback']);
  for (const text of ['restart', 'Start over', 'main menu', 'cancel']) {
    assert.equal(routeMessage(text, { ...collecting, step: 'contact' }).kind, 'restart');
  }
});

test('contact capture replaces the pending question without resolving it early', () => {
  const result = routeMessage('Joint venture', { step: 'contact', context });
  assert.deepEqual(result, { kind: 'pending', pending: { text: 'Joint venture', action: undefined } });
});

test('joint venture and callback requests are routed before location capture', () => {
  const info = routeMessage('Joint venture', collecting);
  assert.equal(info.kind, 'answer');
  assert.equal(info.switchTopic, true);
  assert.equal(info.context.projectSlug, undefined);
  assert.ok(!info.response.text.includes('For your enquiry:'));
  const start = routeMessage('Start a landowner enquiry', collecting, 'joint-venture');
  assert.deepEqual(start, { kind: 'enquiry', intent: 'joint-venture' });
  assert.equal(routeMessage('Request a callback', { ...collecting, intent: 'joint-venture' }).intent, 'callback');
});

test('informational follow-ups are answered during location collection with a reminder', () => {
  const result = routeMessage('What sizes are available?', collecting);
  assert.equal(result.kind, 'answer');
  assert.equal(result.context.projectSlug, context.projectSlug);
  assert.ok(result.response.text.includes('540 - 960 sq.ft'));
  assert.ok(result.response.text.includes('For your enquiry:'));
  assert.equal(routeMessage('What is the weather?', collecting).kind, 'answer');
});

test('unrecognized location text requires confirmation and is never silently saved', () => {
  const ambiguous = routeMessage('Ambattur, Chennai', collecting);
  assert.equal(ambiguous.kind, 'clarify');
  assert.equal(ambiguous.locationCandidate, 'Ambattur, Chennai');
  const confirmed = routeMessage('Use this location', { ...collecting, locationCandidate: ambiguous.locationCandidate });
  assert.deepEqual(confirmed, { kind: 'location', location: 'Ambattur, Chennai' });
  assert.equal(routeMessage('skip', collecting).location, '');
  assert.equal(routeMessage('skip', { ...collecting, intent: 'joint-venture' }).kind, 'clarify');
});

test('callback requests preserve project context and unrelated topic switches clear it', () => {
  assert.equal(routeMessage('Request a callback', { step: 'chat', context }).intent, 'callback');
  const sizes = routeMessage('What sizes are available?', { step: 'chat', context });
  assert.equal(sizes.context.projectSlug, context.projectSlug);
  const services = routeMessage('Tell me about building requirements instead', { step: 'review', context });
  assert.equal(services.response.topic, 'services');
  assert.equal(services.context.projectSlug, undefined);
  assert.equal(services.switchTopic, true);
});

test('construction requirement wording uses approved services without invented building rules', () => {
  for (const text of ['building requirement', 'construction requirements', 'I want to build a house', 'construction services']) {
    const result = routeMessage(text, { step: 'chat', context: {} });
    assert.equal(result.response.topic, 'services', text);
    assert.ok(result.response.links.some(({ path }) => path === '/#services'));
  }
});

test('location sentences answer the active question without returning a project address or abandoning a JV enquiry', () => {
  for (const [text, intent, expected] of [
    ['My preferred location is Anna Nagar', 'callback', 'Anna Nagar'],
    ['I own land in Ambattur', 'joint-venture', 'Ambattur'],
    ['My land is located in Ambattur', 'joint-venture', 'Ambattur'],
    ['I have a plot in Anna Nagar', 'joint-venture', 'Anna Nagar'],
  ]) {
    const result = routeMessage(text, { ...collecting, intent });
    assert.equal(result.kind, 'clarify', text);
    assert.equal(result.locationCandidate, expected, text);
    assert.ok(result.response.choices.includes('Explore something else'));
  }
  const question = routeMessage('My land is in Ambattur, can you tell me the price?', collecting);
  assert.equal(question.kind, 'answer');
  assert.equal(question.response.topic, 'callback-offer');
});

test('natural cancellation works in location, completed enquiry and contact capture steps', () => {
  for (const step of ['location', 'review', 'contact']) {
    for (const text of ['I don’t want a callback', 'No callback', 'Cancel my enquiry', 'No thanks', 'I do not need a joint venture']) {
      assert.equal(routeMessage(text, { ...collecting, step }).kind, 'cancel', `${step}: ${text}`);
    }
  }
});

test('an enquiry keeps its original project when the conversation moves to services', () => {
  const draft = createEnquiry({ name: 'Test Visitor', phone: '9999999999', email: 'test@example.com' }, 'callback', context);
  const services = routeMessage('What services do you offer?', collecting);
  assert.equal(services.context.projectSlug, undefined);
  assert.equal(draft.projectName, ongoingProjects[0].name);
  const updated = { ...draft, location: 'Ambattur', name: 'Edited Visitor' };
  assert.equal(updated.projectName, draft.projectName);
  assert.equal(updated.location, 'Ambattur');
  assert.equal(createEnquiry(draft, 'joint-venture', context).projectName, '');
});

test('completion choices have explicit actions and remain outside the knowledge matcher', () => {
  assert.deepEqual(completionReply.choices.map((item) => typeof item === 'string' ? item : item.label), ['Explore projects', 'Joint venture', 'Ask another question']);
  assert.equal(routeMessage('Explore projects', { step: 'review', context }, 'explore-projects').kind, 'explore');
  assert.equal(routeMessage('Ask another question', { step: 'review', context }, 'ask-question').kind, 'compose');
  assert.equal(routeMessage('Explore something else', collecting).kind, 'restart');
});
