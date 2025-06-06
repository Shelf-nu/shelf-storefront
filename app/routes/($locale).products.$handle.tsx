import {Suspense} from 'react';
import {defer, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, type MetaFunction} from '@remix-run/react';
import type {ProductFragment} from 'storefrontapi.generated';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
} from '@shopify/hydrogen';
import type {SelectedOption} from '@shopify/hydrogen/storefront-api-types';
import {getVariantUrl} from '~/lib/variants';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductImage} from '~/components/ProductImage';
import {ProductForm} from '~/components/ProductForm';
import {extractProductMetafields, isBundledProduct} from '~/utils/products';

import {MetafieldsAccordion} from '~/components/product/metafields';
import {appendToMetaTitle} from '~/utils/append-to-meta-title';
import {Breadcrumbs} from '~/components/breadcrumbs';
import {
  PRODUCT_IMAGE_STYLES,
  ProductMedia,
} from '~/components/product/product-media';
import {tw} from '~/utils/tw';
import {useWindowSize} from '~/utils/use-window-size';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: appendToMetaTitle(data?.product.title ?? '')}];
};

export const handle = {
  breadcrumbType: 'product',
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({
  context,
  params,
  request,
}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  const firstVariant = product.variants.nodes[0];
  const firstVariantIsDefault = Boolean(
    firstVariant.selectedOptions.find(
      (option: SelectedOption) =>
        option.name === 'Title' && option.value === 'Default Title',
    ),
  );

  if (firstVariantIsDefault) {
    product.selectedVariant = firstVariant;
  } else {
    // if no selected variant was returned from the selected options,
    // we redirect to the first variant's url with it's selected options applied
    if (!product.selectedVariant) {
      throw redirectToFirstVariant({product, request});
    }
  }

  return {
    product,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context, params}: LoaderFunctionArgs) {
  // In order to show which variants are available in the UI, we need to query
  // all of them. But there might be a *lot*, so instead separate the variants
  // into it's own separate query that is deferred. So there's a brief moment
  // where variant options might show as available when they're not, but after
  // this deffered query resolves, the UI will update.
  const variants = context.storefront
    .query(VARIANTS_QUERY, {
      variables: {handle: params.handle!},
    })
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    variants,
  };
}

function redirectToFirstVariant({
  product,
  request,
}: {
  product: ProductFragment;
  request: Request;
}) {
  const url = new URL(request.url);
  const firstVariant = product.variants.nodes[0];

  return redirect(
    getVariantUrl({
      pathname: url.pathname,
      handle: product.handle,
      selectedOptions: firstVariant.selectedOptions,
      searchParams: new URLSearchParams(url.search),
    }),
    {
      status: 302,
    },
  );
}

export default function Product() {
  const {product, variants} = useLoaderData<typeof loader>();
  const selectedVariant = useOptimisticVariant(
    product.selectedVariant,
    variants,
  );
  const metafields = extractProductMetafields(product);
  const {width} = useWindowSize();
  const isMobile = width ? width < 768 : false;

  const {title, descriptionHtml} = product;
  return (
    <div className="container">
      <div className="product">
        {!isMobile && (
          // Desktop Product Media
          <div className="product-media-desktop pt-7">
            <div className="flex flex-col gap-4">
              <ProductImage
                image={selectedVariant?.image}
                className={tw(PRODUCT_IMAGE_STYLES)}
              />
              <Suspense
                fallback={
                  <ProductMedia
                    media={product.media}
                    variants={[]}
                    isMobile={false}
                    selectedVariant={selectedVariant}
                  />
                }
              >
                <Await
                  errorElement="There was a problem loading product variants"
                  resolve={variants}
                >
                  {(data) => (
                    <ProductMedia
                      media={product.media}
                      variants={data?.product?.variants.nodes || []}
                      isMobile={false}
                      selectedVariant={selectedVariant}
                    />
                  )}
                </Await>
              </Suspense>
            </div>
          </div>
        )}

        <div className="product-main pt-4 md:pt-7">
          <Breadcrumbs />
          <img
            src="/images/logo-full-color.png"
            alt="shelf-logo"
            className="h-6 mb-3 hidden md:block"
          />
          {isMobile && (
            // Mobile Product Images Carousel
            <div className="w-full">
              <Suspense
                fallback={
                  <ProductMedia
                    media={product.media}
                    variants={[]}
                    isMobile={true}
                    selectedVariant={selectedVariant}
                  />
                }
              >
                <Await
                  errorElement="There was a problem loading product variants"
                  resolve={variants}
                >
                  {(data) => (
                    <ProductMedia
                      media={product.media}
                      variants={data?.product?.variants.nodes || []}
                      isMobile={true}
                      selectedVariant={selectedVariant}
                    />
                  )}
                </Await>
              </Suspense>
            </div>
          )}
          <h1 className="md:max-w-[550px]">{title}</h1>
          <ProductPrice
            price={selectedVariant?.price}
            compareAtPrice={selectedVariant?.compareAtPrice}
          />
          <br />
          <div>
            <div dangerouslySetInnerHTML={{__html: descriptionHtml}} />
          </div>
          <Suspense
            fallback={
              <ProductForm
                product={product}
                selectedVariant={selectedVariant}
                variants={[]}
              />
            }
          >
            <Await
              errorElement="There was a problem loading product variants"
              resolve={variants}
            >
              {(data) => (
                <ProductForm
                  product={product}
                  selectedVariant={selectedVariant}
                  variants={data?.product?.variants.nodes || []}
                />
              )}
            </Await>
          </Suspense>
          <br />
          <br />
          <MetafieldsAccordion metafields={metafields} />
          <br />
        </div>
        <Analytics.ProductView
          data={{
            products: [
              {
                id: product.id,
                title: product.title,
                price: selectedVariant?.price.amount || '0',
                vendor: product.vendor,
                variantId: selectedVariant?.id || '',
                variantTitle: selectedVariant?.title || '',
                quantity: 1,
              },
            ],
          }}
        />
      </div>
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url (transform:  {
        maxWidth: 950
        maxHeight: 950
      })
      altText
    }

    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
    labelsAmount: metafield(namespace: "custom", key: "labels_amount") {
      value
      type
      key
    }
  }
` as const;

const MEDIA_FRAGMENT = `#graphql
  fragment mediaFieldsByType on Media {
    ...on ExternalVideo {
      id
      embeddedUrl
    }
    ...on MediaImage {
      image {
        url (transform:  {
           maxWidth: 950
           maxHeight: 950
        })
        altText
        width
        height
      }
    }
    ...on Model3d {
      sources {
        url
        mimeType
        format
        filesize
      }
    }
    ...on Video {
      sources {
        url
        mimeType
        format
        height
        width
      }
    }
  }
`;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    options {
      name
      values
    }
    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    variants(first: 1) {
      nodes {
        ...ProductVariant
      }
    }
    seo {
      description
      title
    }
    collections(first: 3) {
      nodes {
        title
        handle
      }
    }

    media(first: 10) {
      edges {
        node {
          __typename
          id
          mediaContentType
          previewImage {
            url (transform:  {
              maxWidth: 950
              maxHeight: 950
            })
            altText
            width
            height
          }
          ...mediaFieldsByType
        }
      }
    }

    # metafields
    productFeatures: metafield(namespace: "custom", key: "product_features") {
      value
      type
      key
    }
    transformYourAssetManagement: metafield(namespace: "custom", key: "transform_your_specialized_asset_management") {
      value
      type
      key
    }

    perfectFor: metafield(namespace: "custom", key: "perfect_for") {
      value
      type
      key
    }
    whatOurClientsSay: metafield(namespace: "custom", key: "what_our_specialized_industry_clients_say") {
      value
      type
      key
    }
    extraInfo: metafield(namespace: "custom", key: "extra_info") {
      value
      type
      key
    }
    howToUse: metafield(namespace: "custom", key: "how_to_use") {
      value
      type
      key
    }  
    shipping: metafield(namespace: "custom", key: "shipping") {
      value
      type
      key
    }  
    returnPolicy: metafield(namespace: "custom", key: "return_policy") {
      value
      type
      key
    }  
  }
  ${PRODUCT_VARIANT_FRAGMENT}
  ${MEDIA_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

const PRODUCT_VARIANTS_FRAGMENT = `#graphql
  fragment ProductVariants on Product {
    variants(first: 250) {
      nodes {
        ...ProductVariant
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const VARIANTS_QUERY = `#graphql
  ${PRODUCT_VARIANTS_FRAGMENT}
  query ProductVariants(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...ProductVariants
    }
  }
` as const;
