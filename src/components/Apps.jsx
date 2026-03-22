import { useScrollAnimation } from '../hooks/useScrollAnimation';

const APPS = [
  {
    id: 1,
    name: 'Uptime Kuma',
    url: 'https://uptime.janmejay.info',
    desc: 'Self-hosted uptime monitoring with status pages and alerting for service health.',
    tags: ['Monitoring', 'Status Pages', 'Alerts'],
  },
  {
    id: 2,
    name: 'Grafana',
    url: 'https://grafana.janmejay.info',
    desc: 'Dashboards and observability panels for metrics, logs, and system trends at a glance.',
    tags: ['Dashboards', 'Metrics', 'Observability'],
  },
  {
    id: 3,
    name: 'Drive',
    url: 'https://drive.janmejay.info',
    desc: 'Central file storage and sharing workspace for personal and project assets.',
    tags: ['Storage', 'File Sharing', 'Cloud'],
  },
  {
    id: 4,
    name: 'PDF Editor',
    url: 'https://pdf.janmejay.info',
    desc: 'Browser-based PDF tools for merge, split, convert, and document workflows.',
    tags: ['PDF Tools', 'Document Workflow', 'Web App'],
  },
];

export default function Apps() {
  const [ref, visible] = useScrollAnimation();

  return (
    <section id="apps" className="section-alt">
      <div className="container">
        <div className="section-header">
          <h2>Apps</h2>
          <hr />
        </div>

        <div
          ref={ref}
          className={`projects-grid fade-in${visible ? ' visible' : ''}`}
        >
          {APPS.map((app, i) => (
            <article
              key={app.id}
              className="project-card"
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <div className="project-card-body">
                <span className="project-num">App {String(app.id).padStart(2, '0')}</span>
                <h3 className="project-title">{app.name}</h3>
                <p className="project-desc">{app.desc}</p>
                <a
                  href={app.url}
                  className="app-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${app.name}`}
                >
                  Open App
                </a>
                <div className="project-tech">
                  {app.tags.map((tag) => (
                    <span key={tag} className="project-tech-tag">
                      {tag}
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
