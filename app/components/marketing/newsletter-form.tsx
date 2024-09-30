import {useRouteLoaderData} from '@remix-run/react';
import {useEffect} from 'react';
import {ClientOnly} from 'remix-utils/client-only';
import type {RootLoader} from '~/root';

export function NewsletterForm() {
  return (
    <ClientOnly fallback={<div>Loading...</div>}>{() => <El />}</ClientOnly>
  );
}

function El() {
  const data = useRouteLoaderData<RootLoader>('root');
  useEffect(() => {
    if (document && data && data.MAILERLITE_ACCOUNT) {
      const js = `(function(w,d,e,u,f,l,n){w[f]=w[f]||function(){(w[f].q=w[f].q||[])
    .push(arguments);},l=d.createElement(e),l.async=1,l.src=u,
    n=d.getElementsByTagName(e)[0],n.parentNode.insertBefore(l,n);})
    (window,document,'script','https://assets.mailerlite.com/js/universal.js','ml');
    ml('account', '${data.MAILERLITE_ACCOUNT}');`;
      const script = document.createElement('script');
      script.innerHTML = js;
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [data]);
  return (
    <div
      className="ml-embedded newsletter-form-wrapper"
      data-form="XoJtT1"
    ></div>
  );
}
