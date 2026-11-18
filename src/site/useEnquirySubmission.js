import { useRef, useState } from 'react';
import { leadDeliveryEnabled, submitChatbotContact } from './chatbotSubmission.js';
import { validateEnquiryContact } from './EnquiryContactFields.jsx';
import { enquiryPayload } from './enquirySubmission.js';

export default function useEnquirySubmission(source) {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const attempt = useRef({ id: null, saving: false, saved: false });
  const reset = () => {
    if (attempt.current.saving) return;
    if (attempt.current.saved) attempt.current = { id: null, saving: false, saved: false };
    setStatus('idle');
    setError('');
  };
  const submit = async (event) => {
    event.preventDefault();
    if (attempt.current.saving || attempt.current.saved || !validateEnquiryContact(event.currentTarget)) return;
    if (!leadDeliveryEnabled) {
      setError('Online sending is not connected yet. Please contact us by phone or email; your details remain in this form.');
      setStatus('error');
      return;
    }
    const data = new FormData(event.currentTarget);
    attempt.current.id ||= crypto.randomUUID();
    attempt.current.saving = true;
    setStatus('saving');
    setError('');
    try {
      await submitChatbotContact(enquiryPayload(data, source, attempt.current.id, window.location.pathname));
      attempt.current.saved = true;
      setStatus('saved');
    } catch (failure) {
      setError(failure.message || 'Your enquiry could not be saved. Please retry; your details remain in the form.');
      setStatus('error');
    } finally {
      attempt.current.saving = false;
    }
  };
  return {
    submit, reset, saving: status === 'saving', saved: status === 'saved',
    buttonLabel: status === 'saving' ? 'Sending…' : status === 'saved' ? 'Enquiry received' : 'Send enquiry',
    message: error || (status === 'saved' ? 'Thank you. Your enquiry has been received by Maha Constructions.' : status === 'saving' ? 'Sending your enquiry…' : leadDeliveryEnabled ? '' : 'Online sending is not connected yet. Please contact us by phone or email.'),
  };
}
