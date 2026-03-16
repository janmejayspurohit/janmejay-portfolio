import Seo from '../components/Seo';
import PageBanner from '../components/PageBanner';
import Resume from '../components/Resume';
import Skills from '../components/Skills';
import Qualification from '../components/Qualification';
import Contact from '../components/Contact';

export default function ResumePage() {
  return (
    <>
      <Seo
        title="Janmejay S Purohit - Resume & Skills"
        description="Resume, technical skills, and educational qualifications of Janmejay S Purohit."
        canonicalPath="/resume"
      />
      <PageBanner
        title="Resume, Skills & Qualification"
        subtitle="Professional profile, technology stack, and academic journey."
      />
      <Resume />
      <Skills />
      <Qualification />
      <Contact />
    </>
  );
}
