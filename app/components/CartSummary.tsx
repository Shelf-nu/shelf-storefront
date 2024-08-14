import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Money, type OptimisticCart} from '@shopify/hydrogen';
import {tw} from '~/utils/tw';
import Input from './form/input';
import {Button} from './button';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  const isCartPage = layout === 'page';

  return (
    <div
      aria-labelledby="cart-summary"
      className={tw(isCartPage ? 'cart-summary-page' : 'bg-white z-50 pt-3')}
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
          <div className="font-normal">Calculated at chekout</div>
        </li>
      </ul>
      <CartDiscounts discountCodes={cart.discountCodes} />
      {/* <div className="border-t my-6" /> */}
      <CartCheckoutActions
        checkoutUrl={cart.checkoutUrl}
        isCartPage={isCartPage}
      />
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
