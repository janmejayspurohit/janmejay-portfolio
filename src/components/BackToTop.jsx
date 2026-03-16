import { useState, useEffect } from 'react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <a
      href="#home"
      className={`back-to-top${visible ? ' visible' : ''}`}
      onClick={handleClick}
      aria-label="Back to top"
    >
      <i className="fa fa-arrow-up" aria-hidden="true" />
    </a>
  );
}
