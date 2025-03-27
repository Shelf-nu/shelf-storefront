import {MediaFile} from '@shopify/hydrogen';
import type {Media} from '@shopify/hydrogen/storefront-api-types';
import type {ProductVariantFragment} from 'storefrontapi.generated';
import {tw} from '~/utils/tw';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../shadcn/carousel';
import {ProductImage} from '../ProductImage';

/** This is based on the max width the column can have. It is approx 62% of the container */
export const PRODUCT_IMAGE_SIZE = 950;
export const PRODUCT_IMAGE_STYLES = tw('border border-gray-200 rounded-lg');

export const ProductMedia = ({
  media,
  variants,
  isMobile,
  selectedVariant,
}: {
  media: any;
  variants: ProductVariantFragment[];
  isMobile: boolean;
  selectedVariant: any;
}) => {
  if (!media) {
    return null;
  }

  let items = media.edges;
  if (variants.length > 1) {
    const variantsUrls = variants.map((variant) => variant.image?.url);
    /**
     * We filter out the images that are already present in the variants
     * Currently the only way we can do this is by comparing the urls
     */
    items = items.filter((item: {node: Media}) => {
      return (
        item.node.mediaContentType === 'IMAGE' &&
        !variantsUrls.includes(item?.node?.previewImage?.url)
      );
    });
  }

  // Return carousel for mobile
  if (isMobile) {
    return (
      <Carousel className="mb-4">
        <div>
          <CarouselContent>
            {/* Show selected variant image first */}
            {selectedVariant?.image && (
              <CarouselItem key="selected-variant">
                <ProductImage
                  image={selectedVariant.image}
                  className={tw(PRODUCT_IMAGE_STYLES)}
                />
              </CarouselItem>
            )}

            {/* Then show additional media items */}
            {items.map((item: {node: Media}) => (
              <CarouselItem key={item.node.id}>
                <MediaFile
                  data={item.node}
                  className={PRODUCT_IMAGE_STYLES}
                  mediaOptions={
                    item.node.mediaContentType === 'IMAGE'
                      ? {
                          image: {
                            loading: 'lazy',
                            width: PRODUCT_IMAGE_SIZE,
                            height: PRODUCT_IMAGE_SIZE,
                          },
                        }
                      : {}
                  }
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </div>
        <CarouselPrevious className="left-1" />
        <CarouselNext className="right-1" />
      </Carousel>
    );
  }

  // Return original layout for desktop
  return (
    <div className="flex flex-col gap-3">
      {items.map((item: {node: Media}) => {
        return (
          <MediaFile
            data={item.node}
            key={item.node.id}
            className={PRODUCT_IMAGE_STYLES}
            mediaOptions={
              item.node.mediaContentType === 'IMAGE'
                ? {
                    image: {
                      loading: 'lazy',
                      width: PRODUCT_IMAGE_SIZE,
                      height: PRODUCT_IMAGE_SIZE,
                    },
                  }
                : {}
            }
          />
        );
      })}
    </div>
  );
};
