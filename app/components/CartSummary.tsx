import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Money, type OptimisticCart} from '@shopify/hydrogen';
import {tw} from '~/utils/tw';
import Input from './form/input';
import {Button} from './button';
import {useMemo} from 'react';
import {FREE_SHIPPING_THRESHOLD, hasFreeShipping} from '~/utils/cart';
import {
  Award,
  Check,
  PackageCheck,
  PlaneTakeoff,
  Shield,
  TrendingUp,
} from 'lucide-react';
import {motion, AnimatePresence} from 'framer-motion';
import {Progress} from './marketing/progress';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  const isCartPage = layout === 'page';

  const subtotal = useMemo(
    () => parseFloat(cart.cost?.subtotalAmount?.amount || '0'),
    [cart.cost?.subtotalAmount?.amount],
  );
  const amountToFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;
  const freeShippingProgress = (subtotal / FREE_SHIPPING_THRESHOLD) * 100;
  console.log(freeShippingProgress);
  const isCloseToFreeShipping =
    freeShippingProgress >= 60 && freeShippingProgress < 100;

  const freeShipping = useMemo(() => hasFreeShipping(subtotal), [subtotal]);
  return (
    <div className="">
      {/* Free Shipping Progress */}
      {!freeShipping && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-1 text-blue-700" />
              <p className="text-sm font-medium text-blue-800">Almost there!</p>
            </div>
            <p className="text-sm font-medium text-blue-800">
              ${subtotal.toFixed(2)} of ${FREE_SHIPPING_THRESHOLD.toFixed(2)}
            </p>
          </div>
          <div className="relative">
            <Progress value={freeShippingProgress} className="h-3 mb-2" />
            {isCloseToFreeShipping && (
              <motion.div
                initial={{scale: 0.8, opacity: 0}}
                animate={{scale: 1, opacity: 1}}
                className="absolute right-0 top-[-5px] transform translate-x-1/2 -translate-y-1/2 bg-green-500 text-white rounded-full h-6 w-6 flex items-center justify-center shadow-md"
              >
                <Check className="h-4 w-4" />
              </motion.div>
            )}
          </div>

          <div className="mt-3 bg-white rounded-lg border border-blue-200 p-3 shadow-sm">
            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full p-1.5 mr-2 mt-0.5">
                <Shield className="h-4 w-4 text-blue-700" />
              </div>
              <div>
                <p className="text-sm font-bold text-blue-800">
                  FREE SHIPPING UNLOCKED AT $150
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Add{' '}
                  <span className="font-bold">
                    ${amountToFreeShipping.toFixed(2)}
                  </span>{' '}
                  more and{' '}
                  <span className="underline">
                    save $30(estimated) on shipping costs
                  </span>
                </p>
              </div>
            </div>

            {/* {idealProduct && (
              <div className="mt-3 pt-3 border-t border-blue-100">
                <p className="text-xs font-medium text-blue-800 mb-2">
                  Recommended to unlock free shipping:
                </p>
                <div
                  onClick={() => addToCart(idealProduct)}
                  className="flex items-center gap-3 bg-blue-50 rounded-md p-2 cursor-pointer hover:bg-blue-100 transition-colors"
                >
                  <div className="bg-white rounded h-12 w-12 p-1 flex items-center justify-center">
                    <Image
                      src={idealProduct.image || '/placeholder.svg'}
                      alt={idealProduct.name}
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium line-clamp-1">
                      {idealProduct.name}
                    </p>
                    <p className="text-xs">${idealProduct.price.toFixed(2)}</p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-7 text-xs bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Add
                  </Button>
                </div>
              </div>
            )} */}
          </div>
        </div>
      )}

      {freeShipping && (
        <motion.div
          initial={{y: 20, opacity: 0}}
          animate={{y: 0, opacity: 1}}
          className="p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200"
        >
          <div className="flex items-center mb-3">
            <div className="bg-green-100 p-2 rounded-full mr-3">
              <Award className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-green-800">
                FREE SHIPPING UNLOCKED!
              </h3>
              <p className="text-sm text-green-700">
                You&apos;ve saved at least $30(estimated) on shipping costs
              </p>
            </div>
          </div>
          <div className="bg-white border border-green-200 rounded-md p-3">
            <div className="flex items-center">
              <Check className="h-4 w-4 text-green-500 mr-2" />
              <p className="text-sm text-green-800">
                Your order qualifies for{' '}
                <span className="font-bold">FREE shipping</span>
              </p>
            </div>
          </div>
        </motion.div>
      )}
      <div
        aria-labelledby="cart-summary"
        className={tw(
          isCartPage
            ? 'cart-summary-page'
            : 'bg-white z-50 pt-3 border-t-1 w-full',
        )}
      >
        <h3>Totals</h3>
        <ul className="cart-subtotal my-3 [&>li]:flex [&>li]:gap-2">
          <li>
            <div className="font-semibold text-gray-800">Subtotal: </div>
            <div className="font-normal">
              {cart.cost?.subtotalAmount?.amount ? (
                <Money data={cart.cost?.subtotalAmount} className="" />
              ) : (
                '-'
              )}
            </div>
          </li>
          <li>
            <div className="font-semibold text-gray-800">Shipping: </div>
            <div className="font-normal">
              {freeShipping ? (
                <span className="text-green-600">Free (air) shipping</span>
              ) : (
                'Calculated at checkout ($15 to $30)'
              )}
            </div>
          </li>
        </ul>
        <CartDiscounts discountCodes={cart.discountCodes} />
        {/* <div className="border-t my-6" /> */}
        <CartCheckoutActions
          checkoutUrl={cart.checkoutUrl}
          isCartPage={isCartPage}
        />
      </div>
    </div>
  );
}
function CartCheckoutActions({
  checkoutUrl,
  isCartPage,
}: {
  checkoutUrl?: string;
  isCartPage: boolean;
}) {
  if (!checkoutUrl) return null;

  return (
    <div className="mb-4">
      {/* Trust Badges */}
      <div className="flex items-center justify-center gap-4 py-2 my-4">
        <div className="flex flex-col items-center">
          <Shield className="h-5 w-5 text-gray-600 mb-1" />
          <p className="text-xs text-gray-600">Secure Payment</p>
        </div>
        <div className="flex flex-col items-center">
          <PlaneTakeoff className="h-5 w-5 text-gray-600 mb-1" />
          <p className="text-xs text-gray-600">Fast Delivery</p>
        </div>
        <div className="flex flex-col items-center">
          <PackageCheck className="h-5 w-5 text-gray-600 mb-1" />
          <p className="text-xs text-gray-600">Easy Returns</p>
        </div>
      </div>
      <Button
        to={checkoutUrl}
        target="_self"
        width={!isCartPage ? 'full' : undefined}
      >
        Continue to Checkout &rarr;
      </Button>
      <br />
    </div>
  );
}

function CartDiscounts({
  discountCodes,
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div>
      {/* Have existing discount, display it with a remove option */}
      <dl hidden={!codes.length}>
        <div>
          <dt>Discount(s)</dt>
          <UpdateDiscountForm>
            <div className="cart-discount">
              <code>{codes?.join(', ')}</code>
              &nbsp;
              <button>Remove</button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>

      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div className="flex gap-2 my-2">
          <Input
            type="text"
            name="discountCode"
            placeholder="Discount code"
            label={'Discount code'}
            hideLabel
            inputClassName="my-0"
            className="flex-1"
          />
          <Button type="submit" variant="secondary">
            Apply
          </Button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}
