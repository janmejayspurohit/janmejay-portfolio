import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function Resume() {
  const [ref, visible] = useScrollAnimation();

  return (
    <section id="resume">
      <div className="container">
        <div className="section-header">
          <h2>Resume</h2>
          <hr />
        </div>

        <div className="resume-center">
          <div
            ref={ref}
            className={`resume-card fade-in${visible ? ' visible' : ''}`}
          >
            <i className="far fa-address-card resume-icon" aria-hidden="true" />
            <p>Click below to view or download my full resume.</p>
            <a
              href="/files/resume-janmejay-v4.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="resume-btn"
            >
              <i className="fas fa-download" aria-hidden="true" />
              View / Download Resume
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
