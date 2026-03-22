import { useMemo, useState } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const INITIAL_FORM = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT || '';
const MIN_MESSAGE_LENGTH = 5;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function clamp(text, max) {
  if (!text) return '';
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max)}...`;
}

function buildDiscordPayload({ name, email, subject, message }) {
  return {
    username: 'Portfolio Bot',
    allowed_mentions: { parse: [] },
    embeds: [
      {
        title: 'Contact Request',
        color: 3658935,
        fields: [
          { name: 'Name', value: clamp(name, 120) || 'Not provided', inline: true },
          { name: 'Email', value: clamp(email, 254) || 'Not provided', inline: true },
          { name: 'Subject', value: clamp(subject, 300) || 'No subject', inline: false },
          { name: 'Message', value: clamp(message, 1000) || 'No message', inline: false },
        ],
        footer: {
          text: 'Sent from janmejay.info/contact',
        },
        timestamp: new Date().toISOString(),
      },
    ],
  };
}

export default function ContactForm() {
  const [ref, visible] = useScrollAnimation();
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState('idle');
  const [feedback, setFeedback] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [messageTouched, setMessageTouched] = useState(false);

  const emailValue = form.email.trim();
  const isEmailInvalid = emailValue.length > 0 && !EMAIL_REGEX.test(emailValue);
  const showEmailError = emailTouched && isEmailInvalid;
  const messageLength = form.message.trim().length;
  const isMessageTooShort = messageLength > 0 && messageLength < MIN_MESSAGE_LENGTH;
  const showMessageError = messageTouched && isMessageTooShort;

  const isSubmitDisabled = useMemo(() => {
    return (
      status === 'loading' ||
      !form.name.trim() ||
      !form.email.trim() ||
      !form.subject.trim() ||
      !form.message.trim() ||
      isEmailInvalid ||
      isMessageTooShort
    );
  }, [form, isEmailInvalid, isMessageTooShort, status]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setEmailTouched(true);
    setMessageTouched(true);

    if (isEmailInvalid) {
      setStatus('error');
      setFeedback('Please enter a valid email address.');
      return;
    }

    if (isMessageTooShort) {
      setStatus('error');
      setFeedback(`Message is too short. Please write at least ${MIN_MESSAGE_LENGTH} characters.`);
      return;
    }

    if (!CONTACT_ENDPOINT) {
      setStatus('error');
      setFeedback('Contact endpoint is not configured yet. Please try again later.');
      return;
    }

    setStatus('loading');
    setFeedback('Sending your message...');

    try {
      const payload = buildDiscordPayload(form);
      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMessage = '';

        try {
          const data = await response.json();
          errorMessage = typeof data?.error === 'string' ? data.error : '';
        } catch {
          try {
            errorMessage = (await response.text()).trim();
          } catch {
            errorMessage = '';
          }
        }

        throw new Error(errorMessage || `Request failed with status ${response.status}`);
      }

      setStatus('success');
      setFeedback('Message sent successfully. I will get back to you soon.');
      setForm(INITIAL_FORM);
      setEmailTouched(false);
      setMessageTouched(false);
    } catch (error) {
      setStatus('error');
      const message = error instanceof Error ? error.message.trim() : '';
      setFeedback(message || 'Could not send your message right now. Please try again later or email me directly.');
    }
  };

  return (
    <section id="contact-form" className="contact-form-section">
      <div className="container">
        <div className="section-header">
          <h2>Contact Me</h2>
          <hr />
        </div>

        <div ref={ref} className={`contact-form-wrap fade-in${visible ? ' visible' : ''}`}>
          <p className="contact-form-note">
            Use this form to send me a message. Your submission is delivered to my Discord inbox.
          </p>

          <form className="contact-form" onSubmit={onSubmit} noValidate>
            <div className="contact-row">
              <div className="contact-field">
                <label htmlFor="name">
                  Name <span className="required-mark" aria-hidden="true">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={onChange}
                  maxLength={120}
                  required
                />
              </div>

              <div className="contact-field">
                <label htmlFor="email">
                  Email <span className="required-mark" aria-hidden="true">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(event) => {
                    onChange(event);
                    if (!emailTouched) {
                      setEmailTouched(true);
                    }
                  }}
                  onBlur={() => setEmailTouched(true)}
                  aria-invalid={showEmailError}
                  aria-describedby={showEmailError ? 'email-error' : undefined}
                  maxLength={254}
                  required
                />

                {showEmailError ? (
                  <p id="email-error" className="contact-field-error" role="alert">
                    Please enter a valid email address.
                  </p>
                ) : null}
              </div>
            </div>

            <label htmlFor="subject">
              Subject <span className="required-mark" aria-hidden="true">*</span>
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              placeholder="What is this about?"
              value={form.subject}
              onChange={onChange}
              maxLength={300}
              required
            />

            <label htmlFor="message">
              Message <span className="required-mark" aria-hidden="true">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows="6"
              placeholder="Write your message here..."
              value={form.message}
              onChange={(event) => {
                onChange(event);
                if (!messageTouched) {
                  setMessageTouched(true);
                }
              }}
              onBlur={() => setMessageTouched(true)}
              minLength={MIN_MESSAGE_LENGTH}
              aria-invalid={showMessageError}
              aria-describedby={showMessageError ? 'message-error' : undefined}
              maxLength={1000}
              required
            />

            {showMessageError ? (
              <p id="message-error" className="contact-field-error" role="alert">
                Please enter at least {MIN_MESSAGE_LENGTH} characters in your message.
              </p>
            ) : null}

            <button type="submit" className="contact-submit" disabled={isSubmitDisabled}>
              {status === 'loading' ? 'Sending...' : 'Send Message'}
            </button>

            {feedback ? (
              <p
                className={`contact-feedback ${status === 'error' ? 'error' : ''} ${status === 'success' ? 'success' : ''}`}
                role="status"
                aria-live="polite"
              >
                {feedback}
              </p>
            ) : null}
          </form>
        </div>
      </div>
    </section>
  );
}
