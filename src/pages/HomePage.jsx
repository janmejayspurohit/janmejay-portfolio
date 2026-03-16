import Seo from '../components/Seo';
import Hero from '../components/Hero';
import About from '../components/About';
import Hobbies from '../components/Hobbies';
import Contact from '../components/Contact';

export default function HomePage() {
  return (
    <>
      <Seo
        title="Janmejay S Purohit - Home"
        description="Home page of Janmejay S Purohit's portfolio showcasing background, interests, and contact information."
        canonicalPath="/"
      />
      <Hero />
      <About />
      <Hobbies />
      <Contact />
    </>
  );
}
