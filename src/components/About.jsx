import { useScrollAnimation } from '../hooks/useScrollAnimation';

function getAge() {
  const encoded = ['MTk5Nw==', 'OQ==', 'Mjk='];
  const [year, month, day] = encoded.map((value) => Number.parseInt(atob(value), 10));
  const birth = new Date(year, month, day);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  if (
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
  ) {
    age--;
  }
  return age;
}

export default function About() {
  const [refLeft,  visLeft]  = useScrollAnimation();
  const [refRight, visRight] = useScrollAnimation();

  return (
    <section id="about" className="section-alt">
      <div className="container">
        <div className="section-header">
          <h2>About</h2>
          <hr />
        </div>

        <div className="about-grid">
          <div ref={refLeft} className={`about-text fade-left${visLeft ? ' visible' : ''}`}>
            <p>
              I&rsquo;m Janmejay, a Full Stack Developer and Graphic Designer. I enjoy building
              things for the web and solving complex problems with clean, maintainable code.
            </p>
            <p>
              Feel free to browse around &mdash; if you have any questions or suggestions,
              don&rsquo;t hesitate to reach out via the{' '}
              <a href="/contact">contact section</a>.
            </p>

            <div className="about-meta">
              <div className="about-meta-item">
                <i className="fas fa-birthday-cake" aria-hidden="true" />
                <span>Age: {getAge()}</span>
              </div>
              <div className="about-meta-item">
                <i className="fas fa-language" aria-hidden="true" />
                <span>Languages: English, ಕನ್ನಡ, हिंदी, 日本語</span>
              </div>
              <div className="about-meta-item">
                <i className="fas fa-map-marker-alt" aria-hidden="true" />
                <span>United States</span>
              </div>
              <div className="about-meta-item">
                <i className="fab fa-github" aria-hidden="true" />
                <span>
                  <a
                    href="https://github.com/janmejayspurohit"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    github.com/janmejayspurohit
                  </a>
                </span>
              </div>
              <div className="about-meta-item">
                <i className="fab fa-linkedin" aria-hidden="true" />
                <span>
                  <a
                    href="https://www.linkedin.com/in/jsp324/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    linkedin.com/in/jsp324
                  </a>
                </span>
              </div>
            </div>
          </div>

          <div ref={refRight} className={`about-photo fade-right${visRight ? ' visible' : ''}`}>
            <img
              src="/img/misc/janmejay.jpg"
              alt="Janmejay S Purohit"
              width="260"
              height="260"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
