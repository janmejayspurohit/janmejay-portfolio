import type { ImageMetadata } from 'astro';
import tmo from '../assets/logos/tmo.png';
import iu from '../assets/logos/iu.png';
import tesark from '../assets/logos/tesark.png';
import box8 from '../assets/logos/box8.png';
import ezpg from '../assets/logos/ezpg.png';
import mindiq from '../assets/logos/mindiq.png';

export interface Experience {
  id: number;
  company: string;
  via?: string;
  url: string;
  role: string;
  period: string;
  logo: ImageMetadata;
  summary: string;
  points: string[];
  tech: string[];
}

// T-Mobile, Tesark and Box8 details come from resume v5; the rest is carried
// over from the previous site unchanged.
export const experience: Experience[] = [
  {
    id: 1,
    company: 'T-Mobile',
    via: 'via Concentrix',
    url: 'https://www.t-mobile.com/',
    role: 'Lead Developer',
    period: 'Dec 2024 — Present',
    logo: tmo,
    summary:
      'Leading development initiatives and building production solutions with modern frontend and backend stacks.',
    points: [
      'Led the migration of Metro’s Guest Pay and Authenticated Bill Pay from the legacy stack to the new Svelte and Astro platform, with a performance-focused rebuild that took Guest Pay load time from 3.43 s to 1.3 s (about 62% faster) and server response from 1.6 s to 0.35 s (about 78% faster) at full production scale.',
      'Diagnosed a cross-stack authentication defect on an Angular self-service stack with a Spring Boot BFF, where an unconditional anonymous-token remint silently overwrote a session shared by three applications, and landed the token-reuse fix that eliminated the hidden 401 errors.',
      'Extended the Node.js microservices BFF to integrate external billing systems for authenticated and guest-pay flows: Hapi services with OpenAPI-driven codegen, Joi validation, repository-service-controller layering, and Google reCAPTCHA Enterprise bot protection on guest-facing endpoints.',
      'Built and maintained AEM components in Java and TypeScript on the multi-brand Alpine.js and OSGi platform, shipping account-management and payment features reused across Metro, T-Mobile Prepaid and Assurance Wireless without forking code.',
      'Reviewed merge requests and mentored engineers across the organization in Agile/Scrum sprints, and established the WireMock assertion patterns that catch false-passing Playwright error-path tests team-wide.',
    ],
    tech: ['Svelte', 'Astro', 'Angular', 'Spring Boot', 'Hapi.js', 'OpenAPI', 'AEM', 'Alpine JS', 'Nx', 'Playwright', 'WireMock', 'PostgreSQL', 'Claude Code'],
  },
  {
    id: 2,
    company: 'Indiana University Bloomington',
    url: 'https://bloomington.iu.edu/',
    role: 'M.S. in Computer Science',
    period: 'Aug 2022 — Nov 2024',
    logo: iu,
    summary:
      'Completed graduate studies in Computer Science with focus on advanced software engineering and systems foundations.',
    points: ['GPA 3.82 / 4.00.', 'Teaching Assistant for Intro to Software Systems (CS-C212).'],
    tech: ['Computer Science', 'Graduate Studies'],
  },
  {
    id: 3,
    company: 'Tesark Technologies',
    url: 'https://www.tesark.com/',
    role: 'Software Engineer II',
    period: 'Sep 2019 — Jul 2022',
    logo: tesark,
    summary:
      'Full stack development of various in-house products and services — building new features, improving existing systems, and resolving bugs across the stack.',
    points: [
      'Designed and built scalable enterprise web systems in React, Next.js, Node.js and Express with MongoDB and PostgreSQL on AWS, supporting a product line generating $2M+ in annual revenue.',
      'Engineered a multi-layer token-based authentication system that gave third-party vendors secure real-time reporting and data analysis, where they previously had only static exports.',
      'Drove technology evaluation and release planning for a five-engineer team, and ran client-facing technical discussions that turned requirements into scoped delivery schedules.',
    ],
    tech: ['ReactJS', 'Next.js', 'NodeJS', 'Express', 'Ruby on Rails', 'Redis', 'PostgreSQL', 'MongoDB', 'AWS', 'Metabase'],
  },
  {
    id: 4,
    company: 'Box8',
    url: 'https://box8.in/',
    role: 'Software Engineer Intern',
    period: 'Jan 2019 — Aug 2019',
    logo: box8,
    summary:
      'Worked in the Payments Team — developed and integrated customer-side payment systems (AmazonPay, PhonePe, Paytm, GooglePay) via server-to-server communication, data storage, and API development. Also handled in-house software development and bug fixes.',
    points: [
      'Integrated payment-gateway APIs in Ruby on Rails with Redis and PostgreSQL for Google Pay, Paytm and PhonePe, reaching a 93% settlement success rate and a 33% increase in end-user engagement.',
    ],
    tech: ['Ruby on Rails', 'AngularJS', 'Redis', 'Redash', 'PostgreSQL', 'ELK Stack'],
  },
  {
    id: 5,
    company: 'EzPG',
    url: 'https://www.ezpg.in/aboutus.html',
    role: 'Application Developer Intern',
    period: 'Jun 2018 — Dec 2018',
    logo: ezpg,
    summary:
      'Built features for a PG (Paying Guest) booking platform — integrating HDFC Bank payment system for accepting payments, application integration, and bug fixes.',
    points: [],
    tech: ['PHP', 'JavaScript', 'jQuery', 'HTML5', 'Bootstrap 4', 'CSS'],
  },
  {
    id: 6,
    company: 'MindIQ',
    url: 'https://www.facebook.com/mindiq.in/',
    role: 'Web Developer Intern',
    period: 'Jul 2017 — Sep 2017',
    logo: mindiq,
    summary:
      'Built a chatbot platform for business communications. The product featured a pop-up chat interface powered by predefined responses, with a human-takeover capability when the bot reached its limits.',
    points: [],
    tech: ['JavaScript', 'HTML5', 'CSS', 'Bootstrap 3'],
  },
];
