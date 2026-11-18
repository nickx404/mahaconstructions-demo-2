import { Fragment, useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, ChatCircleDots, X } from '@phosphor-icons/react';
import { sitePath, siteRoute } from './paths.js';
import { saveChatbotLead } from './chatbotLead.js';
import { completionReply, createEnquiry, initialReply, locationPrompt, resetConversation, routeMessage } from './chatbotFlow.js';
import { leadDeliveryEnabled, readSavedContact, rememberContact, submitChatbotContact, validateContact } from './chatbotSubmission.js';

const initialLead = { name: '', phone: '', email: '', location: '' };

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [intent, setIntent] = useState(null);
  const [enquiry, setEnquiry] = useState(null);
  const [askingAnother, setAskingAnother] = useState(false);
  const [step, setStep] = useState('chat');
  const [messages, setMessages] = useState([]);
  const [replies, setReplies] = useState([initialReply]);
  const [animatedMessage, setAnimatedMessage] = useState(null);
  const messageId = useRef(0);
  const followBottom = useRef(true);
  const scrollPosition = useRef(0);
  const [locationCandidate, setLocationCandidate] = useState('');
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [context, setContext] = useState({});
  const [savedContact, setSavedContact] = useState(readSavedContact);
  const [lead, setLead] = useState(() => ({ ...initialLead, ...readSavedContact() }));
  const [pending, setPending] = useState(null);
  const [contactReady, setContactReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [contactError, setContactError] = useState('');
  const contactId = useRef(readSavedContact()?.id || crypto.randomUUID());
  const submitting = useRef(false);
  const contactInput = useRef(null);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const launcher = useRef(null);
  const panel = useRef(null);
  const conversation = useRef(null);
  const input = useRef(null);
  const manualOpen = useRef(false);
  const capturing = step === 'contact';
  const lastMessage = messages[messages.length - 1];
  const nextReply = replies[0];
  const presenting = replies.length > 0;

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(preference.matches);
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!open || !nextReply) return;
    const timer = window.setTimeout(() => {
      const id = ++messageId.current;
      setMessages((current) => [...current, { from: 'bot', ...nextReply, id }]);
      setAnimatedMessage(id);
      if (nextReply.showContact) setContactReady(true);
      setReplies((current) => current.slice(1));
    }, reducedMotion ? 0 : 650);
    return () => window.clearTimeout(timer);
  }, [open, nextReply, reducedMotion]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (manualOpen.current || document.hidden || document.querySelector('.menu-open, [aria-modal="true"]') ||
        document.activeElement?.matches('input, textarea, select, [contenteditable="true"]')) return;
      setOpen(true);
    }, 10000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (open && manualOpen.current) panel.current?.focus();
  }, [open]);

  useEffect(() => {
    if (conversation.current) conversation.current.scrollTop = followBottom.current ? conversation.current.scrollHeight : scrollPosition.current;
  }, [messages, replies, step, open, contactReady]);

  useEffect(() => {
    if (!open || presenting || !manualOpen.current) return;
    const active = document.activeElement;
    if (step === 'contact' && !answer && (active === panel.current || active === input.current || active === document.body)) contactInput.current?.focus();
    else if (active === document.body) input.current?.focus();
  }, [step, presenting, open]);

  function close() {
    manualOpen.current = true;
    setAnimatedMessage(null);
    setOpen(false);
    launcher.current?.focus();
  }

  function reply(bot) {
    setReplies((current) => [...current, bot]);
  }

  function visitor(text) {
    const id = ++messageId.current;
    setMessages((current) => [...current, { from: 'visitor', text, id }]);
  }

  function restart(text = 'Explore something else', replyText = 'Of course. What would you like to explore next?') {
    if (submitting.current) return;
    const reset = resetConversation(lead);
    setIntent(reset.intent);
    setEnquiry(null);
    setAskingAnother(false);
    setStep(reset.step);
    setContext(reset.context);
    setPending(reset.pending);
    setContactReady(false);
    setLocationCandidate(reset.locationCandidate);
    setLead(reset.lead);
    setError('');
    setContactError('');
    setAnswer('');
    visitor(text);
    setReplies([{ ...initialReply, text: replyText }]);
  }

  function start(nextIntent) {
    if (step === 'location' && nextIntent === intent) {
      reply({ text: `I’m already helping you with that. ${locationPrompt(intent)}` });
      return;
    }
    setIntent(nextIntent);
    setEnquiry(createEnquiry(lead, nextIntent, context));
    setStep('location');
    setLocationCandidate('');
    setLead((current) => ({ ...current, location: '' }));
    if (nextIntent === 'joint-venture') setContext({ topic: 'joint-venture' });
    reply({ text: locationPrompt(nextIntent) });
  }

  async function ask(value, action) {
    const text = value.trim();
    if (!text || submitting.current) return;
    manualOpen.current = true;
    const replyContext = step === 'review' ? { ...context, projectSlug: context.projectSlug || enquiry?.projectSlug } : context;
    const result = routeMessage(text, { step, intent, context: replyContext, locationCandidate }, action);
    if (result.kind === 'restart') return restart(text);
    if (result.kind === 'cancel') return restart(text, 'No problem. We can keep exploring. What would you like help with?');
    if (result.kind === 'explore') {
      setIntent(null);
      setEnquiry(null);
      setStep('chat');
      setLead((current) => ({ ...current, location: '' }));
      setLocationCandidate('');
      setContext({});
      setAnswer('');
      setError('');
      visitor(text);
      const next = routeMessage('Ongoing projects', { step: 'chat', context: {} });
      setContext(next.context);
      reply(next.response);
      return;
    }
    if (result.kind === 'compose') {
      setStep('chat');
      setContext(replyContext);
      setAskingAnother(true);
      input.current?.focus();
      return;
    }
    if (step === 'review') setStep('chat');
    setAskingAnother(false);
    setAnswer('');
    setError('');
    visitor(text);
    if (!savedContact || (leadDeliveryEnabled && !savedContact.delivered) || result.kind === 'pending') {
      if (step !== 'contact') setContactReady(false);
      setPending(result.pending || { text, action });
      setStep('contact');
      setContactError('');
      // The latest question replaces any unanswered prompt while contact capture is open.
      setReplies([{ showContact: true, text: step === 'contact' ? 'I’ll help with your latest question after you continue with your contact details.' : 'Sure, I can help. May I have your name and phone number?' }]);
      return;
    }
    if (result.kind === 'location') {
      const nextLead = { ...lead, location: result.location };
      const nextEnquiry = { ...enquiry, name: nextLead.name, phone: nextLead.phone, email: nextLead.email || '', location: nextLead.location, intent };
      submitting.current = true;
      setSaving(true);
      try {
        if (leadDeliveryEnabled) await submitChatbotContact({ ...savedContact, location: nextLead.location, projectName: enquiry?.projectName || '', intent });
      } catch (problem) { setError(problem.message); setAnswer((current) => current || text); return; }
      finally { submitting.current = false; setSaving(false); }
      setLead(nextLead);
      setEnquiry(nextEnquiry);
      setLocationCandidate('');
      setStep('review');
      reply({ text: leadDeliveryEnabled ? `Thank you, ${nextLead.name}. Your enquiry details have been updated. You can open the contact form to add more details.` : `Thank you, ${nextLead.name}. Here are your enquiry details. To reach our team, please use the phone or email on our Contact page.`, summary: nextEnquiry });
      reply(completionReply);
      return;
    }
    if (result.kind === 'enquiry') return start(result.intent);
    setLocationCandidate(result.locationCandidate || '');
    if (result.context) setContext(result.context);
    // An explicit move to a different information topic leaves the enquiry behind.
    if (result.kind === 'answer' && result.switchTopic) {
      setIntent(null);
      setEnquiry(null);
      setStep('chat');
      setLead((current) => ({ ...current, location: '' }));
      reply(result.response);
    } else reply(result.response);
  }

  async function captureContact(event) {
    event.preventDefault();
    if (submitting.current || !pending) return;
    setContactError('');
    let contact;
    try { contact = validateContact(lead.name, lead.phone, lead.email); }
    catch (problem) { setContactError(problem.message); return; }
    submitting.current = true;
    setSaving(true);
    const editing = pending.editEnquiry && enquiry;
    const record = { ...contact, id: contactId.current, question: editing ? savedContact?.question || pending.text : pending.text, page: window.location.pathname, delivered: leadDeliveryEnabled,
      ...(editing ? { location: enquiry.location, projectName: enquiry.projectName, intent: enquiry.intent } : {}) };
    try {
      if (leadDeliveryEnabled) await submitChatbotContact(record);
      rememberContact(record);
      setSavedContact(record);
      setLead((current) => ({ ...current, ...contact }));
      if (editing) {
        const updated = { ...enquiry, ...contact };
        setEnquiry(updated);
        setStep('review');
        reply({ text: leadDeliveryEnabled ? 'Your contact details have been updated.' : 'Your contact details are updated here.', summary: updated });
        reply(completionReply);
        setPending(null);
        return;
      }
      setStep('chat');
      reply({ text: leadDeliveryEnabled ? `Thank you, ${contact.name}. Your enquiry has been saved.` : `Thanks, ${contact.name}. Let’s continue with your question.` });
      const result = routeMessage(pending.text, { step: 'chat', intent, context }, pending.action);
      if (result.kind === 'enquiry') start(result.intent);
      else {
        setContext(result.context);
        reply(result.response);
      }
      setPending(null);
    } catch (problem) { setContactError(problem.message); }
    finally { submitting.current = false; setSaving(false); }
  }

  function continueToForm() {
    if (!enquiry || submitting.current) return;
    if (!saveChatbotLead(enquiry)) {
      setError('I couldn’t carry your details across. Please open the contact form below and enter them there.');
      return;
    }
    if (siteRoute() === '/contact') {
      window.dispatchEvent(new Event('maha-chatbot-enquiry'));
      setAnimatedMessage(null);
      setOpen(false);
      document.getElementById('contact-form')?.scrollIntoView();
    } else window.location.assign(sitePath('/contact#contact-form'));
  }

  return (
    <div className="maha-chat">
      {open && <section id="maha-chat-panel" className="maha-chat-panel" role="dialog" aria-modal="false" aria-labelledby="maha-chat-title" tabIndex={-1} ref={panel}
        onKeyDown={(event) => { if (event.key === 'Escape') { event.stopPropagation(); close(); } }}>
        <header className="maha-chat-header">
          <span className="maha-chat-avatar" aria-hidden="true">M</span>
          <div><h2 id="maha-chat-title">Chat with Maha</h2><p>Maha Constructions · Website assistant</p></div>
          <button type="button" onClick={close} aria-label="Close chatbot"><X size={20} aria-hidden="true" /></button>
        </header>

        <div className="maha-chat-conversation" ref={conversation} onScroll={(event) => {
          const { scrollHeight, scrollTop, clientHeight } = event.currentTarget;
          scrollPosition.current = scrollTop;
          followBottom.current = scrollHeight - scrollTop - clientHeight < 80;
        }}>
          <div className="maha-chat-transcript" role="log" aria-label="Chat conversation" aria-live="polite" aria-relevant="additions">
            {messages.map((message) => <Fragment key={message.id}><div className={`maha-chat-bubble${message.id === animatedMessage ? ' is-entering' : ''}${message.from === 'visitor' ? ' is-visitor' : ''}`}>
              <span className="maha-chat-sr">{message.from === 'visitor' ? 'You: ' : 'Maha: '}</span><p>{message.text}</p>
              {message.links?.length > 0 && <div className="maha-chat-sources">{message.links.map((item) => <a key={item.path} href={sitePath(item.path)}>{item.label}<ArrowUpRight size={14} aria-hidden="true" /></a>)}</div>}
            </div>
              {message.summary && <div className="maha-chat-actions">
                <dl className="maha-chat-summary"><div><dt>Name</dt><dd>{message.summary.name}</dd></div><div><dt>Phone</dt><dd>{message.summary.phone}</dd></div>{message.summary.email && <div><dt>Email</dt><dd>{message.summary.email}</dd></div>}{message.summary.projectName && <div><dt>Project</dt><dd>{message.summary.projectName}</dd></div>}<div><dt>{message.summary.intent === 'joint-venture' ? 'Land location' : 'Preferred location'}</dt><dd>{message.summary.location || 'Not specified'}</dd></div></dl>
                {step === 'review' && !presenting && message.summary === enquiry && <>
                  <button type="button" className="maha-chat-primary" disabled={saving} onClick={continueToForm}>Open contact form <ArrowRight size={17} aria-hidden="true" /></button>
                  <button type="button" className="maha-chat-secondary" disabled={saving} onClick={() => { setStep('contact'); setContactReady(true); setPending({ text: 'Update enquiry contact details', editEnquiry: true }); setContactError(''); }}>Edit details</button>
                </>}
              </div>}
            </Fragment>)}
          </div>

          {presenting && <div className="maha-chat-typing" aria-hidden="true"><span /><span /><span /></div>}

          {!presenting && !capturing && lastMessage?.choices && (!lastMessage.completion || step === 'review') && <div className="maha-chat-suggestions" aria-label="Suggested replies">{lastMessage.choices.map((choice) => {
            const label = typeof choice === 'string' ? choice : choice.label;
            return <button type="button" key={label} disabled={saving} onClick={() => ask(label, choice.action)}>{label}</button>;
          })}</div>}

          {capturing && contactReady && <form className="maha-chat-contact" onSubmit={captureContact} aria-label="Your contact details" aria-busy={saving}>
            <label htmlFor="maha-lead-name">Name</label>
            <input id="maha-lead-name" ref={contactInput} name="name" autoComplete="name" required minLength={2} maxLength={80} value={lead.name} disabled={saving} onChange={(event) => { setLead({ ...lead, name: event.target.value }); setContactError(''); }} />
            <label htmlFor="maha-lead-phone">Phone number</label>
            <input id="maha-lead-phone" name="phone" type="tel" autoComplete="tel" required maxLength={24} value={lead.phone} disabled={saving} onChange={(event) => { setLead({ ...lead, phone: event.target.value }); setContactError(''); }} />
            <label htmlFor="maha-lead-email">Email (optional)</label>
            <input id="maha-lead-email" name="email" type="email" autoComplete="email" maxLength={254} value={lead.email || ''} disabled={saving} onChange={(event) => { setLead({ ...lead, email: event.target.value }); setContactError(''); }} />
            {contactError && <p className="maha-chat-error" role="alert">{contactError} <a href={sitePath('/contact')}>Contact our team</a></p>}
            <button className="maha-chat-primary" type="submit" disabled={saving}>{saving ? 'Saving…' : contactError ? 'Retry' : 'Continue'} {!saving && <ArrowRight size={17} aria-hidden="true" />}</button>
          </form>}


        </div>

        <form className="maha-chat-answer maha-chat-composer" onSubmit={(event) => { event.preventDefault(); ask(answer); }}>
          <label htmlFor="maha-chat-answer">{step === 'location' ? (intent === 'joint-venture' ? 'Your land location' : 'Your preferred location') : 'Message Maha'}</label>
          <div><input id="maha-chat-answer" ref={input} value={answer} onChange={(event) => { setAnswer(event.target.value); setError(''); }} type="text" autoComplete="off" maxLength={500} placeholder={step === 'location' ? 'e.g. Ambattur, Chennai' : askingAnother ? 'What else would you like to know?' : 'Type your question here…'} aria-invalid={Boolean(error)} aria-describedby={error ? 'maha-chat-error' : undefined} /><button type="submit" disabled={saving} aria-label={saving ? 'Saving enquiry' : 'Send message'}><ArrowRight size={19} aria-hidden="true" /></button></div>
          {error && <p id="maha-chat-error" className="maha-chat-error" role="alert">{error} {step === 'review' && <a href={sitePath('/contact#contact-form')}>Open contact form</a>}</p>}
        </form>
      </section>}
      <button className={`maha-chat-launcher${open ? ' is-open' : ''}`} type="button" ref={launcher} aria-label={open ? 'Minimize chatbot' : 'Ask Maha — open Maha Constructions chatbot'} aria-controls="maha-chat-panel" aria-expanded={open} onClick={() => { manualOpen.current = true; if (open) close(); else setOpen(true); }}>
        {open ? <X size={23} aria-hidden="true" /> : <><ChatCircleDots size={24} weight="fill" aria-hidden="true" /><span>Ask Maha</span></>}
      </button>
    </div>
  );
}
