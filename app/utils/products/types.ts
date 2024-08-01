import type {PRODUCT_METAFIELDS_KEYS} from '.';

export interface Product {
  [key: (typeof PRODUCT_METAFIELDS_KEYS)[number] | symbol]:
    | {
        type: string;
        value: string;
        key: string;
      }
    | any; // Allow for other keys that are not metafields and not relevant for this snippet
}

export interface Metafield {
  key: (typeof PRODUCT_METAFIELDS_KEYS)[number];
  type: string;
  value: string | Record<(typeof PRODUCT_METAFIELDS_KEYS)[number], unknown>;
  valueRaw: string;
  title: string;
}

export interface ProductWithOptions extends Product {
  options: {
    name: string;
    values: string[];
  }[];
}
