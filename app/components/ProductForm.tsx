import {Link} from '@remix-run/react';
import {type VariantOption, VariantSelector} from '@shopify/hydrogen';
import type {
  ProductFragment,
  ProductVariantFragment,
} from 'storefrontapi.generated';
import {twMerge} from 'tailwind-merge';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';
import {PricePerSheet} from './product/price-per-sheet';
import {useState} from 'react';
import {MinusIcon, PlusIcon} from '@radix-ui/react-icons';
import {Button} from './button';
import {QuantitySelector} from './product/quantity-selector';
import FileUploadDropzone from './product/file-upload-dropzone';
import {isCustomizedProduct} from '~/utils/products';

export function ProductForm({
  product,
  selectedVariant,
  variants,
}: {
  product: ProductFragment;
  selectedVariant: ProductFragment['selectedVariant'];
  variants: Array<ProductVariantFragment>;
}) {
  const {open} = useAside();
  const [quantity, setQuantity] = useState(1);
  const shouldShowLogoDropzone = isCustomizedProduct(product);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');

  return (
    <div className="">
      <VariantSelector
        handle={product.handle}
        options={product.options.filter((option) => option.values.length > 1)}
        variants={variants}
      >
        {({option}) => {
          return <ProductOptions key={option.name} option={option} />;
        }}
      </VariantSelector>
      <PricePerSheet product={product} />

      <br />
      {/* Logo upload dropzone */}
      {shouldShowLogoDropzone && (
        <FileUploadDropzone
          uploadedFileName={uploadedFileName}
          setUploadedFileName={setUploadedFileName}
        />
      )}
      <br />

      <div className="flex gap-2 items-center">
        <div className="flex-1 [&>form]:w-full [&>form]:max-w-full">
          <AddToCartButton
            disabled={!selectedVariant || !selectedVariant.availableForSale}
            onClick={() => {
              open('cart');
            }}
            lines={
              selectedVariant
                ? [
                    {
                      merchandiseId: selectedVariant.id,
                      quantity,
                      selectedVariant,
                    },
                  ]
                : []
            }
          >
            {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
          </AddToCartButton>
        </div>
        <QuantitySelector state={[quantity, setQuantity]} />
      </div>
    </div>
  );
}

function ProductOptions({option}: {option: VariantOption}) {
  return (
    <div className="mt-6" key={option.name}>
      <h5 className="text-gray-700 text-[14px] font-medium mb-[6px]">
        {option.name}
      </h5>
      <div className="flex items-center justify-normal border border-gray-200 rounded-[4px] p-1 bg-gray-50 w-fit">
        {option.values.map(({value, isAvailable, isActive, to}) => {
          return (
            <Link
              className={twMerge(
                'text-[14px] font-semibold py-2 px-3 rounded-[3px]  hover:no-underline',
                isActive
                  ? 'bg-white text-gray-700 shadow-md '
                  : 'bg-gray-10 text-gray-500',
              )}
              key={option.name + value}
              prefetch="intent"
              preventScrollReset
              replace
              to={to}
            >
              {value}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
