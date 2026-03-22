import Seo from '../components/Seo';
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
      <Resume />
      <Skills />
      <Qualification />
      <Contact />
    </>
  );
}
