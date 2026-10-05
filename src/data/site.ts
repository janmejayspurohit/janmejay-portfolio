export const site = {
  name: 'Janmejay S Purohit',
  url: 'https://janmejay.info',
  role: 'Full Stack Software Engineer',
  email: 'janmejayspurohit@gmail.com',
  github: 'https://github.com/janmejayspurohit',
  linkedin: 'https://www.linkedin.com/in/jsp324/',
  // One unversioned URL; the resume version is internal only. nginx.conf
  // redirects the old versioned file names here.
  resume: '/files/resume-janmejay.pdf',
  location: 'United States',
  languages: ['English', 'ಕನ್ನಡ', 'हिंदी', '日本語'],
  ogImage: '/og.png',
  portraitUrl: '/img/misc/janmejay.jpg',
};

export const nav = [
  { href: '/', label: 'Home' },
  { href: '/experience', label: 'Experience' },
  { href: '/projects', label: 'Projects' },
  { href: '/apps', label: 'Apps' },
  { href: '/resume', label: 'Resume' },
  { href: '/contact', label: 'Contact' },
];

// Date of birth, lightly obfuscated as on the previous site so it is not
// sitting in the page as plain text. Used only to show an age.
const DOB = ['MTk5Nw==', 'OQ==', 'Mjk='];

export function ageOn(today: Date): number {
  const [year, month, day] = DOB.map((v) => Number.parseInt(atob(v), 10));
  let age = today.getFullYear() - year;
  if (today.getMonth() < month || (today.getMonth() === month && today.getDate() < day)) age--;
  return age;
}
