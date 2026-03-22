import Seo from '../components/Seo';
import Apps from '../components/Apps';
import Contact from '../components/Contact';

export default function AppsPage() {
  return (
    <>
      <Seo
        title="Janmejay S Purohit - Apps"
        description="Apps dashboard featuring Uptime Kuma, Grafana, Drive, and PDF Editor."
        canonicalPath="/apps"
      />
      <Apps />
      <Contact />
    </>
  );
}
