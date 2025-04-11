import {useFetchers, type FetcherWithComponents} from '@remix-run/react';
import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';
import {Button} from './button';

export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick?: () => void;
}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <ButtonWithFetcher
            fetcher={fetcher}
            disabled={disabled ?? fetcher.state !== 'idle'}
            onClick={onClick}
          >
            {children}
          </ButtonWithFetcher>
        </>
      )}
    </CartForm>
  );
}

function ButtonWithFetcher({
  fetcher,
  children,
  disabled,
  onClick,
}: {
  fetcher: FetcherWithComponents<any>;
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <Button
      type="submit"
      onClick={onClick}
      disabled={disabled ?? fetcher.state !== 'idle'}
      className="w-full"
    >
      {children}
    </Button>
  );
}
