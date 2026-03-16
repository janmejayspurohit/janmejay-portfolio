import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function Contact() {
  const [ref, visible] = useScrollAnimation();

  return (
    <>
      <footer id="contact" className="contact-section">
        <div className="container">
          <div
            ref={ref}
            className={`contact-grid fade-in${visible ? ' visible' : ''}`}
          >
            <div className="contact-item" style={{ transitionDelay: '0s' }}>
              <h3>
                <i className="fab fa-linkedin" aria-hidden="true" />
                LinkedIn
              </h3>
              <a
                href="https://www.linkedin.com/in/jsp324/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
              >
                Janmejay S Purohit
              </a>
            </div>

            <div className="contact-item" style={{ transitionDelay: '0.1s' }}>
              <h3>
                <i className="far fa-envelope" aria-hidden="true" />
                E-Mail
              </h3>
              <a
                href="mailto:janmejayspurohit@gmail.com?subject=Inquiry"
                aria-label="Send email"
              >
                janmejayspurohit@gmail.com
              </a>
            </div>

            <div className="contact-item" style={{ transitionDelay: '0.2s' }}>
              <h3>
                <i className="fas fa-mobile-alt" aria-hidden="true" />
                Phone
              </h3>
              <p>+1 (929)-593-8209</p>
            </div>
          </div>
        </div>
      </footer>

      <div className="copyright-bar">
        <div className="container">
          <p>
            &copy;&nbsp;
            <a href="#home">Janmejay S Purohit</a>. All Rights Reserved.
          </p>
        </div>
      </div>
    </>
  );
}
