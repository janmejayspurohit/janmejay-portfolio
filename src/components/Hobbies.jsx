import { useScrollAnimation } from '../hooks/useScrollAnimation';

const HOBBIES = [
  { icon: 'fa fa-gamepad',    label: 'Gaming' },
  { icon: 'fas fa-dumbbell',  label: 'Gym' },
  { icon: 'fa fa-tv',         label: 'Soaps & TV Shows' },
  { icon: 'fa fa-code',       label: 'Coding' },
  { icon: 'fa fa-paint-brush',label: 'Graphic Design' },
  { icon: 'fa fa-headphones', label: 'Music' },
];

export default function Hobbies() {
  const [ref, visible] = useScrollAnimation();

  return (
    <section id="hobbies">
      <div className="container">
        <div className="section-header">
          <h2>Hobbies &amp; Interests</h2>
          <hr />
        </div>

        <div
          ref={ref}
          className={`hobbies-grid fade-in${visible ? ' visible' : ''}`}
        >
          {HOBBIES.map(({ icon, label }, i) => (
            <div
              key={label}
              className="hobby-card"
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <i className={icon} aria-hidden="true" />
              <h3>{label}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
