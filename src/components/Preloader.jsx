import { useEffect, useState } from 'react';

export default function Preloader() {
  const [visible,  setVisible]  = useState(true);
  const [mounted,  setMounted]  = useState(true);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(false), 500);
    const t2 = setTimeout(() => setMounted(false), 1000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (!mounted) return null;

  return (
    <div className={`preloader${!visible ? ' hidden' : ''}`} aria-hidden="true">
      <div className="preloader-spinner" />
    </div>
  );
}
