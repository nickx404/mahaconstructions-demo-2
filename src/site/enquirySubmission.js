import { validateContact } from './chatbotSubmission.js';

export function enquiryPayload(data, source, id, page) {
  return {
    id, source, page,
    ...validateContact(data.get('name') || '', data.get('phone') || '', data.get('email') || ''),
    location: String(data.get('location') || '').trim().slice(0, 160),
    message: String(data.get('message') || '').trim().slice(0, 2000),
    enquiryTypes: data.getAll('enquiryType'),
  };
}
