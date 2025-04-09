import {Await, type MetaFunction, useRouteLoaderData} from '@remix-run/react';
import {Suspense} from 'react';
import type {CartQueryDataReturn} from '@shopify/hydrogen';
import {
  CartForm,
  cartMetafieldDeleteDefault,
  cartMetafieldsSetDefault,
} from '@shopify/hydrogen';
import {json, type ActionFunctionArgs} from '@shopify/remix-oxygen';
import {CartMain} from '~/components/CartMain';
import type {RootLoader} from '~/root';
import {appendToMetaTitle} from '~/utils/append-to-meta-title';

export const meta: MetaFunction = () => {
  return [{title: appendToMetaTitle(`Cart`)}];
};

export async function action({request, context}: ActionFunctionArgs) {
  const {cart, storefront} = context;

  const formData = await request.formData();

  const {action, inputs} = CartForm.getFormInput(formData);

  if (!action) {
    throw new Error('No action provided');
  }

  let status = 200;
  let result: CartQueryDataReturn;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    case CartForm.ACTIONS.DiscountCodesUpdate: {
      const formDiscountCode = inputs.discountCode;

      // User inputted discount code
      const discountCodes = (
        formDiscountCode ? [formDiscountCode] : []
      ) as string[];

      // Combine discount codes already applied on cart
      discountCodes.push(...inputs.discountCodes);

      result = await cart.updateDiscountCodes(discountCodes);
      break;
    }
    case CartForm.ACTIONS.BuyerIdentityUpdate: {
      result = await cart.updateBuyerIdentity({
        ...inputs.buyerIdentity,
      });
      break;
    }
    case CartForm.ACTIONS.AttributesUpdateInput:
      const attr = [
        {
          key: 'custom.client_logos',
          value:
            'https://cdn.prod.website-files.com/64186faca4f0a0ec048fb2dd/672cb3561c292cee3970a223_chicagobulls.png',
        },
      ];
      result = await cart.updateAttributes(inputs.attributes);
      break;
    // case CartForm.ACTIONS.MetafieldsSet: {
    //   result = await cart.setMetafields([
    //     {
    //       key: 'custom.client_logos',
    //       type: 'JSON',
    //       value:
    //         JSON.stringify({
    //           client_logos: [
    //             {
    //               url: 'https://cdn.shopify.com/s/files/1/0680/4150/7113/files/logo.png?v=1669727667',
    //             },
    //             {
    //               url: 'https://cdn.prod.website-files.com/64186faca4f0a0ec048fb2dd/672cb3561c292cee3970a223_chicagobulls.png',
    //             },
    //           ],
    //         }) ?? '',
    //     },
    //   ]);

    //   break;
    // }

    // /** @ts-ignore - for some reason there is a type mismatch. if I use MetafieldsDelete, which is what i see in the type, i get an error: No action provided */
    // case CartForm.ACTIONS.MetafieldDelete: {
    //   const cartDeleteMetafield = cartMetafieldDeleteDefault({
    //     storefront,
    //     getCartId: cart.getCartId,
    //   });

    //   result = await cartDeleteMetafield('custom.client_logos');
    //   break;
    // }
    default:
      throw new Error(`${action} cart action is not defined`);
  }

  const cartId = result?.cart?.id;
  const headers = cartId ? cart.setCartId(result.cart.id) : new Headers();
  const {cart: cartResult, errors} = result;

  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string') {
    status = 303;
    headers.set('Location', redirectTo);
  }

  return json(
    {
      cart: cartResult,
      errors,
      analytics: {
        cartId,
      },
    },
    {status, headers},
  );
}

export default function Cart() {
  const rootData = useRouteLoaderData<RootLoader>('root');
  if (!rootData) return null;

  return (
    <div className="cart container">
      <h1>Cart</h1>
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await
          resolve={rootData.cart}
          errorElement={<div>An error occurred</div>}
        >
          {(cart) => {
            return <CartMain layout="page" cart={cart} />;
          }}
        </Await>
      </Suspense>
    </div>
  );
}
