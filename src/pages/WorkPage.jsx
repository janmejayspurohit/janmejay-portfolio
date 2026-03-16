import Seo from '../components/Seo';
import PageBanner from '../components/PageBanner';
import WorkExperience from '../components/WorkExperience';
import Contact from '../components/Contact';

export default function WorkPage() {
  return (
    <>
      <Seo
        title="Janmejay S Purohit - Work Experience"
        description="Work experience timeline of Janmejay S Purohit across software engineering and full stack development roles."
        canonicalPath="/work"
      />
      <PageBanner
        title="Work Experience"
        subtitle="A timeline of roles, products, and technologies I've worked with."
      />
      <WorkExperience />
      <Contact />
    </>
  );
}
