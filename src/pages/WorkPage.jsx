import Seo from '../components/Seo';
import WorkExperience from '../components/WorkExperience';
import Contact from '../components/Contact';

export default function WorkPage() {
  return (
    <>
      <Seo
        title="Janmejay S Purohit - Experience"
        description="Experience timeline of Janmejay S Purohit across software engineering roles and graduate studies."
        canonicalPath="/experience"
      />
      <WorkExperience />
      <Contact />
    </>
  );
}
