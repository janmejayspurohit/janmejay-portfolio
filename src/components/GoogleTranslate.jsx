import { useEffect } from 'react';

const GOOGLE_TRANSLATE_SCRIPT_ID = 'google-translate-script';

export default function GoogleTranslate() {
  useEffect(() => {
    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) return;

      const host = document.getElementById('google_translate_element');
      if (!host || host.childElementCount > 0) return;

      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          autoDisplay: false,
          layout: window.google.translate.TranslateElement.InlineLayout.HORIZONTAL,
        },
        'google_translate_element'
      );
    };

    const existingScript = document.getElementById(GOOGLE_TRANSLATE_SCRIPT_ID);
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = GOOGLE_TRANSLATE_SCRIPT_ID;
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    } else if (window.google?.translate?.TranslateElement) {
      window.googleTranslateElementInit();
    }
  }, []);

  return (
    <div className="nav-translate" aria-label="Translate this page">
      <div id="google_translate_element" />
    </div>
  );
}
