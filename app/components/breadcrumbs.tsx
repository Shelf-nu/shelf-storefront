import {ChevronRightIcon} from '@radix-ui/react-icons';
import {Link, useMatches} from '@remix-run/react';
import {tw} from '~/utils/tw';
import type {Collection, Product} from '@shopify/hydrogen/storefront-api-types';

// Define an interface that extends RouteHandle with the 'breadcrumb' property
interface HandleWithBreadcrumb {
  breadcrumbType?: 'collections' | 'collection' | 'product'; // Change 'any' to the actual type of 'breadcrumb' if known
}

export function Breadcrumbs() {
  const matches = useMatches();
  const currentRoute = matches.at(-1);
  const breadcrumbType = (currentRoute?.handle as HandleWithBreadcrumb)
    ?.breadcrumbType;
  const breadcrumbs: Breadcrumb[] = [{href: '/', label: 'Shop'}];

  switch (breadcrumbType) {
    case 'product': {
      // @ts-ignore - need to figure out how to get the type of the currentRoute on hydrogen
      const product = currentRoute?.data?.product as Product;
      const collection = product?.collections?.nodes[0] as Collection;
      breadcrumbs.push({
        href: `/collections/${collection.handle}`,
        label: collection.title,
      });
      breadcrumbs.push({
        href: `/products/${product?.handle}`,
        label: product?.title,
      });
      break;
    }
    default:
      break;
  }

  return (
    <div className="mb-[26px] flex max-w-full truncate">
      {breadcrumbs.map((breadcrumb, index) => (
        <Breadcrumb
          key={breadcrumb.href}
          breadcrumb={breadcrumb}
          isLastItem={index === breadcrumbs.length - 1}
        />
      ))}
    </div>
  );
}

type Breadcrumb = {
  href: string;
  label: string;
};

const Breadcrumb = ({
  breadcrumb,
  isLastItem,
}: {
  breadcrumb: Breadcrumb;
  isLastItem: boolean;
}) => {
  return (
    <div className={tw('breadcrumb', isLastItem ? 'truncate' : '')}>
      <Link
        to={isLastItem ? '' : breadcrumb.href}
        className={tw(
          'text-[14px] font-medium ',
          !isLastItem
            ? 'text-gray-600 hover:text-gray-600 hover:underline'
            : 'text-primary-800 hover:text-primary-800 pointer-events-none',
        )}
      >
        {breadcrumb.label}
      </Link>
      {!isLastItem && (
        <span className="mx-2.5 md:mx-3">
          <ChevronRightIcon className="inline align-middle" />
        </span>
      )}
    </div>
  );
};
