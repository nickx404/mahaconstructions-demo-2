import assert from 'node:assert/strict';
import test from 'node:test';
import { enquiryPayload } from './enquirySubmission.js';

test('page enquiries send normalized contacts and all selected enquiry details', () => {
  const data = new FormData();
  for (const [key, value] of Object.entries({ name: ' Test Visitor ', phone: '+91 90000 00000', email: '', location: ' Anna Nagar ', message: ' Please call me. ' })) data.set(key, value);
  data.append('enquiryType', 'General Inquiry');
  data.append('enquiryType', 'Joint Venture');
  assert.deepEqual(enquiryPayload(data, 'contact', 'lead-id', '/contact'), {
    id: 'lead-id', source: 'contact', page: '/contact', name: 'Test Visitor', phone: '+919000000000', email: '', location: 'Anna Nagar', message: 'Please call me.', enquiryTypes: ['General Inquiry', 'Joint Venture'],
  });
  data.set('phone', '123');
  assert.throws(() => enquiryPayload(data, 'contact', 'lead-id', '/contact'), /phone number/);
});
