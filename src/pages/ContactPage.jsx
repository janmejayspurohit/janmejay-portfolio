import Seo from '../components/Seo';
import ContactForm from '../components/ContactForm';
import Contact from '../components/Contact';

export default function ContactPage() {
  return (
    <>
      <Seo
        title="Janmejay S Purohit - Contact"
        description="Get in touch with Janmejay S Purohit through the contact form or direct channels."
        canonicalPath="/contact"
      />
      <ContactForm />
      <Contact />
    </>
  );
}
