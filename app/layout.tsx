import {
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from '@remix-run/react';
import {Analytics, useNonce} from '@shopify/hydrogen';
import {RootLoader} from '~/root';
import {useCrisp} from './marketing/crisp';
import {PageLayout} from './PageLayout';

export function Layout({children}: {children?: React.ReactNode}) {
  const nonce = useNonce();
  const data = useRouteLoaderData<RootLoader>('root');

  useCrisp(data?.CRISP_WEBSITE_ID);
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {data ? (
          <Analytics.Provider
            cart={data.cart}
            shop={data.shop}
            consent={data.consent}
          >
            <PageLayout {...data}>{children}</PageLayout>
          </Analytics.Provider>
        ) : (
          children
        )}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}
