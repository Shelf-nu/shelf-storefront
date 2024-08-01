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
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    if (v > 0) {
      setQuantity(v);
    }
  };

  return (
    <div className="">
      <VariantSelector
        handle={product.handle}
        options={product.options.filter((option) => option.values.length > 1)}
        variants={variants}
      >
        {({option}) => <ProductOptions key={option.name} option={option} />}
      </VariantSelector>
      <PricePerSheet product={product} />

      <br />
      <div className="flex gap-2 items-center">
        <div className="flex-1 [&>form]:w-full">
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
        <div className="flex h-[38px]">
          <Button
            onClick={() => {
              if (quantity > 1) {
                setQuantity(quantity - 1);
              }
            }}
            variant="secondary"
            size="sm"
          >
            <MinusIcon />
          </Button>
          <input
            value={quantity}
            onChange={handleQuantityChange}
            className="w-[62px] h-[38px] p-[8px 16px 8px 16px]  border-[0px 1px 0px 0px] opacity-[0px] m-0"
          />
          <Button
            onClick={() => setQuantity(quantity + 1)}
            variant="secondary"
            size="sm"
          >
            <PlusIcon />
          </Button>
        </div>
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
                'text-[14px] font-semibold py-2 px-3 rounded-[3px] whitespace-nowrap hover:no-underline',
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
