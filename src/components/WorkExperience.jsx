import { useScrollAnimation } from '../hooks/useScrollAnimation';

const EXPERIENCES = [
  {
    id: 1,
    company: 'T-Mobile',
    url: 'https://www.t-mobile.com/',
    role: 'Lead Developer - Contract',
    period: 'Dec 2024 - Present',
    logo: '/img/logos/tmo.png',
    description:
      'Leading development initiatives and building production solutions with modern frontend and backend stacks.',
    tech: ['AEM', 'Alpine JS', 'Nx', 'Hapi.js', 'Angular', 'Spring Boot', 'PostgreSQL', 'Claude Code'],
  },
  {
    id: 2,
    company: 'Indiana University Bloomington',
    url: 'https://bloomington.iu.edu/',
    role: 'M.S. in Computer Science',
    period: 'Aug 2022 - Nov 2024',
    logo: '/img/logos/iu.png',
    description:
      'Completed graduate studies in Computer Science with focus on advanced software engineering and systems foundations.',
    tech: ['Computer Science', 'Graduate Studies'],
  },
  {
    id: 3,
    company: 'Tesark Technologies',
    url: 'https://www.tesark.com/',
    role: 'Software Engineer',
    period: 'Sep 2019 - Jun 2022',
    logo: '/img/logos/tesark.png',
    description:
      'Full stack development of various in-house products and services — building new features, improving existing systems, and resolving bugs across the stack.',
    tech: ['ReactJS', 'NodeJS', 'Ruby on Rails', 'Redis', 'PostgreSQL', 'Metabase'],
  },
  {
    id: 4,
    company: 'Box8',
    url: 'https://box8.in/',
    role: 'Software Developer Intern',
    period: 'Jan 2019 - Aug 2019',
    logo: '/img/logos/box8.png',
    description:
      'Worked in the Payments Team — developed and integrated customer-side payment systems (AmazonPay, PhonePe, Paytm, GooglePay) via server-to-server communication, data storage, and API development. Also handled in-house software development and bug fixes.',
    tech: ['Ruby on Rails', 'AngularJS', 'Redis', 'Redash', 'PostgreSQL', 'ELK Stack'],
  },
  {
    id: 5,
    company: 'EzPG',
    url: 'https://www.ezpg.in/aboutus.html',
    role: 'Application Developer Intern',
    period: 'Jun 2018 - Dec 2018',
    logo: '/img/logos/ezpg.png',
    description:
      'Built features for a PG (Paying Guest) booking platform — integrating HDFC Bank payment system for accepting payments, application integration, and bug fixes.',
    tech: ['PHP', 'JavaScript', 'jQuery', 'HTML5', 'Bootstrap 4', 'CSS'],
  },
  {
    id: 6,
    company: 'MindIQ',
    url: 'https://www.facebook.com/mindiq.in/',
    role: 'Web Developer Intern',
    period: 'Jul 2017 - Sep 2017',
    logo: '/img/logos/mindiq.png',
    description:
      'Built a chatbot platform for business communications. The product featured a pop-up chat interface powered by predefined responses, with a human-takeover capability when the bot reached its limits.',
    tech: ['JavaScript', 'HTML5', 'CSS', 'Bootstrap 3'],
  },
];

export default function WorkExperience() {
  const [ref, visible] = useScrollAnimation();

  return (
    <section id="experience" className="section-alt">
      <div className="container">
        <div className="section-header">
          <h2>Experience</h2>
          <hr />
        </div>

        <div
          ref={ref}
          className={`timeline-wrapper fade-in${visible ? ' visible' : ''}`}
        >
          {EXPERIENCES.map((exp, i) => (
            <article
              key={exp.id}
              className="timeline-item"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <span className="timeline-date">{exp.period}</span>
              <div className="timeline-card">
                <div className="timeline-header">
                  <img
                    src={exp.logo}
                    alt={exp.company}
                    className="timeline-logo"
                    loading="lazy"
                    decoding="async"
                  />
                  <div>
                    <h3 className="timeline-company">
                      <a href={exp.url} target="_blank" rel="noopener noreferrer">
                        {exp.company}
                      </a>
                    </h3>
                    <span className="timeline-role">{exp.role}</span>
                  </div>
                </div>
                <p className="timeline-desc">{exp.description}</p>
                <div className="tech-tags">
                  {exp.tech.map((t) => (
                    <span key={t} className="tech-tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
