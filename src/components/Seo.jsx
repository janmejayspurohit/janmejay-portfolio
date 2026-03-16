import { useEffect } from 'react';

export default function Seo({ title, description, canonicalPath = '/' }) {
  useEffect(() => {
    if (title) document.title = title;

    if (description) {
      let descTag = document.querySelector('meta[name="description"]');
      if (!descTag) {
        descTag = document.createElement('meta');
        descTag.setAttribute('name', 'description');
        document.head.appendChild(descTag);
      }
      descTag.setAttribute('content', description);
    }

    const absoluteCanonical = `https://www.janmejay.info${canonicalPath}`;
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', absoluteCanonical);
  }, [title, description, canonicalPath]);

  return null;
}
