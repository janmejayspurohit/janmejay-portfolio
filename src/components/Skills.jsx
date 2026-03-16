import { useScrollAnimation } from '../hooks/useScrollAnimation';

const SKILLS = [
  { name: 'JavaScript',     img: '/img/logos/js.png' },
  { name: 'React',          img: '/img/logos/react.png' },
  { name: 'Node.js',        img: '/img/logos/node.png' },
  { name: 'Next.js',        img: '/img/logos/nextjs.png' },
  { name: 'Angular',        img: '/img/logos/angular.png' },
  { name: 'Ruby on Rails',  img: '/img/logos/ror.png' },
  { name: 'Express.js',     img: '/img/logos/express.png' },
  { name: 'Python',         img: '/img/logos/python.png' },
  { name: 'Java',           img: '/img/logos/java.png' },
  { name: 'C',              img: '/img/logos/c.png' },
  { name: 'PostgreSQL',     img: '/img/logos/postgresql.png' },
  { name: 'MySQL',          img: '/img/logos/mysql.png' },
  { name: 'MongoDB',        img: '/img/logos/mongodb.png' },
  { name: 'Redis',          img: '/img/logos/redis.png' },
  { name: 'JWT',            img: '/img/logos/jwt.png' },
  { name: 'Kafka',          img: '/img/logos/kafka.png' },
  { name: 'Sequelize',      img: '/img/logos/sequelize.png' },
  { name: 'Sidekiq',        img: '/img/logos/sidekiq.png' },
  { name: 'AWS',            img: '/img/logos/aws.png' },
  { name: 'Firebase',       img: '/img/logos/firebase.png' },
  { name: 'Heroku',         img: '/img/logos/heroku.png' },
  { name: 'Netlify',        img: '/img/logos/netlify.png' },
  { name: 'Terraform',      img: '/img/logos/terraform.png' },
  { name: 'GitHub',         img: '/img/logos/github.png' },
  { name: 'GitLab',         img: '/img/logos/gitlab.png' },
  { name: 'Bitbucket',      img: '/img/logos/bitbucket.png' },
  { name: 'Atlassian',      img: '/img/logos/atlassian.png' },
  { name: 'Bootstrap',      img: '/img/logos/bootstrap.png' },
  { name: 'Chakra UI',      img: '/img/logos/chakraui.png' },
  { name: 'Material UI',    img: '/img/logos/material-ui.png' },
  { name: 'jQuery',         img: '/img/logos/jquery.png' },
  { name: 'ELK Stack',      img: '/img/logos/elk.png' },
  { name: 'Kibana',         img: '/img/logos/kibana.png' },
  { name: 'Sentry',         img: '/img/logos/sentry.png' },
  { name: 'Rollbar',        img: '/img/logos/rollable.png' },
  { name: 'Postman',        img: '/img/logos/postman.png' },
  { name: 'Figma',          img: '/img/logos/figma.png' },
  { name: 'Photoshop',      img: '/img/logos/photoshop.png' },
  { name: 'Illustrator',    img: '/img/logos/illustrator.png' },
  { name: 'Draw.io',        img: '/img/logos/draw-io.png' },
  { name: 'DBeaver',        img: '/img/logos/dbeaver.png' },
  { name: 'TablePlus',      img: '/img/logos/table-plus.png' },
  { name: 'VS Code',        img: '/img/logos/vscode.png' },
  { name: 'Vim',            img: '/img/logos/vim.png' },
  { name: 'Sublime Text',   img: '/img/logos/sublime.png' },
  { name: 'Atom',           img: '/img/logos/atom.png' },
  { name: 'Android Studio', img: '/img/logos/android-studio.png' },
  { name: 'Ubuntu',         img: '/img/logos/ubuntu.png' },
  { name: 'Windows',        img: '/img/logos/windows.png' },
  { name: 'MATLAB',         img: '/img/logos/matlab.png' },
  { name: 'Pusher',         img: '/img/logos/pusher.png' },
  { name: 'Asana',          img: '/img/logos/asana.png' },
];

export default function Skills() {
  const [ref, visible] = useScrollAnimation();

  return (
    <section id="skills" className="section-alt">
      <div className="container">
        <div className="section-header">
          <h2>Tech I&rsquo;m Familiar With</h2>
          <hr />
        </div>

        <div
          ref={ref}
          className={`skills-board fade-in${visible ? ' visible' : ''}`}
        >
          {SKILLS.map(({ name, img }) => (
            <div key={name} className="skill-item" title={name}>
              <img src={img} alt={name} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
