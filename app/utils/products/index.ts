import type {Metafield, Product, ProductWithOptions} from './types';

export const PRODUCT_METAFIELDS_KEYS = [
  'productFeatures',
  'transformYourAssetManagement',
  'perfectFor',
  'whatOurClientsSay',
  'extraInfo',
  'howToUse',
  'shipping',
  'returnPolicy',
];

export function extractProductMetafields(
  product: Product,
): Record<string, Metafield> {
  return PRODUCT_METAFIELDS_KEYS.reduce((acc, key) => {
    const metafield = product[key];

    if (metafield) {
      // @ts-ignore
      acc[key] = {
        key,
        type: metafield.type,
        value:
          metafield.type === 'rich_text_field'
            ? JSON.parse(metafield.value)
            : metafield.value,
        valueRaw: metafield.value,
        title: titleFromKey(metafield.key),
      };
    }
    return acc;
  }, {});
}

export function titleFromKey(key: string): string {
  const a = key.split('_');
  a[0] = a[0].charAt(0).toUpperCase() + a[0].slice(1).toLowerCase();
  return a.join(' ');
}

/** Checks if a product has the option Bundle */
export function isBundledProduct(product: ProductWithOptions): boolean {
  return product.options.some((option) => option.name === 'Bundle');
}

/** Extract amount of labels from option name
 * The options have to be named in the format "2 sheets (108)" */
export function extractLabelAmountFromOption(option: string): number {
  const match = option.match(/\((\d+)\)/);
  return match ? Number(match[1]) : 0;
}
