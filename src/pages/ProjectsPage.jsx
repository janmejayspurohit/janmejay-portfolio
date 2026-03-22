import Seo from '../components/Seo';
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
      <Projects />
      <Contact />
    </>
  );
}
