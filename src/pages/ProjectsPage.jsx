import Seo from '../components/Seo';
import PageBanner from '../components/PageBanner';
import Projects from '../components/Projects';
import Contact from '../components/Contact';

export default function ProjectsPage() {
  return (
    <>
      <Seo
        title="Janmejay S Purohit - Projects"
        description="Portfolio projects by Janmejay S Purohit including web apps, Android development, and computer vision work."
        canonicalPath="/projects"
      />
      <PageBanner
        title="Projects"
        subtitle="Selected projects spanning web, mobile, machine vision, and immersive experiences."
      />
      <Projects />
      <Contact />
    </>
  );
}
