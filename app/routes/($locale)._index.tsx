import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
import type {FeaturedCollectionFragment} from 'storefrontapi.generated';
import {appendToMetaTitle} from '~/utils/append-to-meta-title';
import {Button} from '~/components/button';
import {useState} from 'react';
import {tw} from '~/utils/tw';

export const meta: MetaFunction = () => {
  return [{title: appendToMetaTitle('Home')}];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  // const deferredData = loadDeferredData(args);
  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return defer({
    // ...deferredData,
    ...criticalData,
  });
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context}: LoaderFunctionArgs) {
  const [{collections}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {
    featuredCollection: collections.nodes[0],
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="home">
      <FeaturedCollection collection={data.featuredCollection} />
    </div>
  );
}

function FeaturedCollection({
  collection,
}: {
  collection: FeaturedCollectionFragment;
}) {
  if (!collection) return null;

  const image = collection?.image;
  return (
    <>
      <div className="flex items-center py-24">
        <div className="max-w-[560px] w-full p-[40px] z-20 shadow-3xl border border-gray-200 bg-white rounded-lg [&_h1]:mb-6 [&_h1]:mt-4 [&_p]:mb-4">
          <img
            src="/images/logo-full-color.png"
            alt={`Shelf logo`}
            className="h-[32px] w-[99px] rounded-none"
          />
          <div dangerouslySetInnerHTML={{__html: collection.descriptionHtml}} />
          <Button to="collections/all">Shop now</Button>
        </div>
        {image && (
          <div className="featured-collection-image z-10  h-[720px] w-full flex-1 ml-[-200px] r-0 overflow-hidden">
            <Image
              data={image}
              sizes="100vw"
              className="object-center object-cover h-full w-full"
            />
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-24 pb-16">
        <h2 className="">{collection.title}</h2>
        <Button to="collections/all" variant="secondary">
          View all products
        </Button>
      </div>

      <div className="featured-products-grid pb-24">
        {collection?.products?.nodes.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </>
  );
}

export const ProductCard = ({
  product,
}: {
  product: Pick<
    FeaturedCollectionFragment['products']['nodes'][number],
    'handle' | 'title' | 'priceRange' | 'images'
  >;
}) => {
  const mainImage = product.images.nodes[0];
  const hoverImage = product.images.nodes[1];

  return (
    <Link
      to={`/products/${product.handle}`}
      className="group product-card border border-gray-200 rounded-lg hover:!no-underline transition-all duration-500 ease-in-out"
    >
      <div className="relative h-auto aspect-square overflow-hidden">
        {' '}
        {/* Wrap images in a relative container */}
        <Image
          data={mainImage}
          aspectRatio="1/1"
          sizes="(min-width: 45em) 20vw, 50vw"
          className="absolute inset-0 w-full h-full main-image transition-opacity duration-500 ease-in-out"
        />
        <Image
          data={hoverImage}
          aspectRatio="1/1"
          sizes="(min-width: 45em) 20vw, 50vw"
          className="absolute inset-0 w-full h-full hover-image opacity-0 scale-100 transition-all duration-500 ease-in-out transform group-hover:opacity-100 group-hover:scale-105"
        />
      </div>
      <div className="p-5 text-center border-t border-t-gray-200">
        <h4 className="font-medium text-[16px] leading-[20px] text-gray-900 ">
          {product.title}
        </h4>
        <div className="text-gray-600 text-[16px] font-normal">
          <Money data={product.priceRange.minVariantPrice} />
        </div>
      </div>
    </Link>
  );
};

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    handle
    title
    description
    descriptionHtml
    image {
      id
      url
      altText
      width
      height
    }
    handle
    products(first: 4) {
      nodes{
        id
        title
        handle
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 2) {
          nodes {
            id
            url
            altText
            width
            height
          }
        }
      }
    }
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(query: "handle:frontpage", first: 1) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;
