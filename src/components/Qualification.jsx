import { useScrollAnimation } from '../hooks/useScrollAnimation';

const EDUCATION = [
  {
    id: 1,
    icon: 'fa fa-school',
    name: 'Cambridge Public School',
    years: '2003 – 2013',
    desc: 'Primary Education · Class 10 · ICSE',
  },
  {
    id: 2,
    icon: 'fa fa-university',
    name: 'Jain College, Jaynagar',
    years: '2013 – 2015',
    desc: 'Secondary Education · Class 12 · KPUC',
  },
  {
    id: 3,
    icon: 'fa fa-graduation-cap',
    name: 'Dayananda Sagar University',
    years: '2015 – 2019',
    desc: 'Undergraduate Education · B.Tech · Computer Science & Engineering',
  },
  {
    id: 4,
    icon: 'fa fa-graduation-cap',
    name: 'Indiana University Bloomington',
    years: '2022 – 2024',
    desc: 'Graduate Education · M.S. · Computer Science',
  },
];

export default function Qualification() {
  const [ref, visible] = useScrollAnimation();

  return (
    <section id="education">
      <div className="container">
        <div className="section-header">
          <h2>Qualification</h2>
          <hr />
        </div>

        <div
          ref={ref}
          className={`education-grid fade-in${visible ? ' visible' : ''}`}
        >
          {EDUCATION.map((edu, i) => (
            <article
              key={edu.id}
              className="edu-card"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="edu-icon">
                <i className={edu.icon} aria-hidden="true" />
              </div>
              <h3>{edu.name}</h3>
              <span className="edu-years">{edu.years}</span>
              <p>{edu.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
