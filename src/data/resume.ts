export interface School {
  name: string;
  years: string;
  what: string;
  extra?: string;
}

export const education: School[] = [
  {
    name: 'Indiana University Bloomington',
    years: 'Aug 2022 — Nov 2024',
    what: 'Graduate Education · M.S. in Computer Science',
    extra: 'GPA 3.82 / 4.00 · Teaching Assistant, Intro to Software Systems (CS-C212)',
  },
  {
    name: 'Dayananda Sagar University',
    years: '2015 — 2019',
    what: 'Undergraduate Education · B.Tech · Computer Science & Engineering',
    extra: 'GPA 9.21 / 10.00 · Vice President, Computer Society of India student chapter',
  },
  {
    name: 'Jain College, Jaynagar',
    years: '2013 — 2015',
    what: 'Secondary Education · Class 12 · KPUC',
  },
  {
    name: 'Cambridge Public School',
    years: '2003 — 2013',
    what: 'Primary Education · Class 10 · ICSE',
  },
];

export const certifications = [{ name: 'JLPT N3 Japanese Language Proficiency', year: '2020' }];

// Every skill from the previous site is kept; groups follow resume v5.
export const skillGroups: { title: string; items: string[] }[] = [
  { title: 'Languages', items: ['TypeScript', 'JavaScript', 'Python', 'Java', 'Ruby', 'SQL', 'C'] },
  {
    title: 'Frontend',
    items: ['Svelte', 'Astro', 'React', 'Next.js', 'Angular', 'NgRx', 'Alpine.js', 'jQuery', 'Bootstrap', 'Chakra UI', 'Material UI', 'Design systems', 'WCAG & axe-core', 'Responsive CSS & SCSS'],
  },
  {
    title: 'Backend',
    items: ['Node.js', 'Hapi', 'Express.js', 'Spring Boot', 'Ruby on Rails', 'Django', 'REST & OpenAPI', 'Joi & Zod', 'JWT', 'Kafka', 'Sidekiq', 'Sequelize', 'Pusher', 'Adobe Experience Manager'],
  },
  {
    title: 'Data & infrastructure',
    items: ['PostgreSQL', 'MongoDB', 'MySQL', 'SQLite', 'Redis', 'AWS', 'Docker', 'Kubernetes', 'Terraform', 'Firebase', 'Heroku', 'Netlify'],
  },
  {
    title: 'Testing & tooling',
    items: ['Playwright', 'Vitest', 'Jest', 'WireMock', 'Nx', 'Turborepo', 'Git', 'GitHub', 'GitLab CI/CD', 'Bitbucket', 'ESLint', 'Husky', 'Postman'],
  },
  {
    title: 'Observability & delivery',
    items: ['OpenTelemetry', 'Splunk', 'Conduktor', 'LaunchDarkly', 'Sentry', 'Rollbar', 'ELK Stack', 'Kibana'],
  },
  {
    title: 'Design & workspace',
    items: ['Figma', 'Photoshop', 'Illustrator', 'Draw.io', 'VS Code', 'Vim', 'Sublime Text', 'Atom', 'Android Studio', 'DBeaver', 'TablePlus', 'Atlassian', 'Asana', 'Ubuntu', 'Windows', 'MATLAB'],
  },
];
