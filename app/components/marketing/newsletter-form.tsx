import {useEffect} from 'react';
import {ClientOnly} from 'remix-utils/client-only';

export function NewsletterForm() {
  return (
    <ClientOnly fallback={<div>Loading...</div>}>{() => <El />}</ClientOnly>
  );
}

function El() {
  useEffect(() => {
    if (document) {
      const js = `(function(w,d,e,u,f,l,n){w[f]=w[f]||function(){(w[f].q=w[f].q||[])
    .push(arguments);},l=d.createElement(e),l.async=1,l.src=u,
    n=d.getElementsByTagName(e)[0],n.parentNode.insertBefore(l,n);})
    (window,document,'script','https://assets.mailerlite.com/js/universal.js','ml');
    ml('account', '523286');`;
      const script = document.createElement('script');
      script.innerHTML = js;
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);
  return (
    <div
      className="ml-embedded newsletter-form-wrapper"
      data-form="XoJtT1"
    ></div>
  );
}
