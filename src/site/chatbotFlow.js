import { answerQuestion } from './chatbotKnowledge.js';
import { ongoingProjects } from './siteContent.js';

export const menuChoices = ['Ongoing projects', 'Joint venture', 'Request a callback'];
export const initialReply = { text: 'Hi, I’m Maha. How can I help you today?', choices: menuChoices };
export const completionReply = {
  completion: true,
  text: 'Would you like help with anything else? Choose below, or type your question.',
  choices: [{ label: 'Explore projects', action: 'explore-projects' }, 'Joint venture', { label: 'Ask another question', action: 'ask-question' }],
};
export const locationPrompt = (intent) => intent === 'joint-venture'
  ? 'Where is your land located? A locality or area is enough.'
  : 'Do you have a preferred location? You can say “skip” if you’re still exploring.';

export function resetConversation(lead) {
  return { intent: null, step: 'chat', context: {}, pending: null, locationCandidate: '', lead: { ...lead, location: '' } };
}

export function createEnquiry(lead, intent, context = {}) {
  const project = intent === 'callback' ? ongoingProjects.find((item) => item.slug === context.projectSlug) : null;
  return { name: lead.name, phone: lead.phone, email: lead.email || '', location: '', intent, projectName: project?.name || '', projectSlug: project?.slug };
}

export function routeMessage(text, { step, intent, context, locationCandidate }, action) {
  if (action === 'explore-projects') return { kind: 'explore' };
  if (action === 'ask-question') return { kind: 'compose' };
  if (/^(restart|start over|main menu|cancel|stop|never mind|nevermind|explore something else)[.!]?$/i.test(text)) return { kind: 'restart' };
  const normalized = text.toLowerCase().replace(/[’']/g, '');
  if (/\b(dont (want|need)|do not (want|need)|no longer (want|need)|not interested in|cancel|stop)\b.*\b(call|callback|enquiry|joint venture|partnership)\b/.test(normalized) || /\b(no|without) (a |any )?(callback|call|enquiry)\b/.test(normalized) ||
      (['location', 'review', 'contact'].includes(step) && /^(no thanks|no thank you)[.!]?$/.test(normalized))) return { kind: 'cancel' };
  if (step === 'contact') return { kind: 'pending', pending: { text, action } };
  if (step === 'location' && locationCandidate && /^(yes|yes please|use this location)$/i.test(text)) return { kind: 'location', location: locationCandidate };
  const confirmLocation = (location) => ({ kind: 'clarify', locationCandidate: location.slice(0, 160), response: {
    text: `Should I use “${location.slice(0, 160)}” as your ${intent === 'joint-venture' ? 'land' : 'preferred'} location? If you meant another question, please rephrase it.`,
    choices: ['Use this location', 'Explore something else'],
  } });
  if (step === 'location') {
    // Explicit answers to our location question take precedence over general topic keywords.
    const statement = text.match(/^(?:(?:my |our )?(?:preferred location|land|plot|property|location|locality|area)\s+(?:(?:is located|is)\s+(?:(?:in|at)\s+)?|(?:in|at)\s+)|i\s+(?:own|have)\s+(?:some |a )?(?:land|a plot)\s+(?:in|at)\s+)(.+?)[.!]?$/i);
    if (statement && !/\?|\b(can you|could you|what|how|price|pricing|cost)\b/i.test(text)) return confirmLocation(statement[1]);
  }
  const response = action ? { action } : answerQuestion(text, context);
  if (response.action) return { kind: 'enquiry', intent: response.action };
  if (step === 'location') {
    if (/^(skip|not sure|not decided|anywhere|no preference)$/i.test(text)) {
      return intent === 'joint-venture'
        ? { kind: 'clarify', response: { text: 'Please share the land locality so our team knows which property your enquiry concerns.' } }
        : { kind: 'location', location: '' };
    }
    if (response.topic === 'unknown' && !/\?|^(what|where|which|can|could|do|does|how|tell|show|is|are|why)\b/i.test(text)) {
      if (/^(yes|sure|ok|okay|no)$/i.test(text)) return { kind: 'clarify', response: { text: locationPrompt(intent) } };
      return confirmLocation(text);
    }
  }
  const projectTopic = ['project', 'projects', 'callback-offer'].includes(response.topic);
  const nextContext = { topic: response.topic, projectSlug: projectTopic ? response.projectSlug : undefined, followUp: response.followUp };
  const switchTopic = response.topic === 'joint-venture' || /\b(instead|switch|another topic|different topic)\b/i.test(text);
  return { kind: 'answer', context: nextContext, switchTopic, response: step === 'location' && !switchTopic
    ? { ...response, text: `${response.text}\n\nFor your enquiry: ${locationPrompt(intent)}` }
    : response };
}
