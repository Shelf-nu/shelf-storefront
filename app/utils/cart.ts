export const FREE_SHIPPING_THRESHOLD = 150;

/**
 * Check if the cart has free shipping
 * @param amount The total amount of the cart
 * @returns True if the cart has free shipping
 */
export function hasFreeShipping(amount: number) {
  if (!amount) return false;
  return amount >= FREE_SHIPPING_THRESHOLD;
}
