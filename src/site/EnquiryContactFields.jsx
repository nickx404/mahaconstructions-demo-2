import { validateContact } from './chatbotSubmission.js';

export function validateEnquiryContact(form) {
  const defaults = { name: 'Visitor', phone: '9999999999', email: '' };
  for (const name of Object.keys(defaults)) {
    const input = form.elements.namedItem(name);
    input.setCustomValidity('');
    try {
      const values = { ...defaults, [name]: input.value };
      validateContact(values.name, values.phone, values.email);
    } catch (error) {
      input.setCustomValidity(error.message);
      input.reportValidity();
      return false;
    }
  }
  return true;
}

export default function EnquiryContactFields({ values, onChange, landowner = false }) {
  const change = (event) => {
    event.target.setCustomValidity('');
    onChange?.(event);
  };
  const field = (name, label, props) => (
    <label className="animated-input-group">
      <span>{label}</span>
      <input name={name} value={values?.[name]} onChange={change} {...props} />
    </label>
  );
  return (
    <>
      <div className="form-row contact-form-field">
        {field('name', 'Name', { autoComplete: 'name', placeholder: 'Your full name', required: true, minLength: 2, maxLength: 80 })}
        {field('phone', 'Phone number', { type: 'tel', autoComplete: 'tel', placeholder: '+91 90000 00000', required: true, maxLength: 24 })}
      </div>
      <div className="contact-form-field">
        {field('email', 'Email address (optional)', { type: 'email', autoComplete: 'email', placeholder: 'you@example.com', maxLength: 254 })}
      </div>
      <div className="contact-form-field">
        {field('location', landowner ? 'Land location (optional)' : 'Preferred / land location (optional)', { placeholder: 'Area or locality in Chennai', maxLength: 160 })}
      </div>
    </>
  );
}
