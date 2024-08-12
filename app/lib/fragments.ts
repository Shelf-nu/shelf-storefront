// NOTE: https://shopify.dev/docs/api/storefront/latest/queries/cart
export const CART_QUERY_FRAGMENT = `#graphql
  fragment Money on MoneyV2 {
    currencyCode
    amount
  }
  fragment CartLine on CartLine {
    id
    quantity
    attributes {
      key
      value
    }
    cost {
      totalAmount {
        ...Money
      }
      amountPerQuantity {
        ...Money
      }
      compareAtAmountPerQuantity {
        ...Money
      }
    }
    merchandise {
      ... on ProductVariant {
        id
        availableForSale
        compareAtPrice {
          ...Money
        }
        price {
          ...Money
        }
        requiresShipping
        title
        image {
          id
          url (transform:  {
            maxWidth: 200
            maxHeight: 200
          })
          altText
        }
        product {
          handle
          title
          id
          vendor
        }
        selectedOptions {
          name
          value
        }
      }
    }
  }
  fragment CartApiQuery on Cart {
    updatedAt
    id
    checkoutUrl
    totalQuantity
    buyerIdentity {
      countryCode
      customer {
        id
        email
        firstName
        lastName
        displayName
      }
      email
      phone
    }
    lines(first: $numCartLines) {
      nodes {
        ...CartLine
      }
    }
    cost {
      subtotalAmount {
        ...Money
      }
      totalAmount {
        ...Money
      }
      totalDutyAmount {
        ...Money
      }
      totalTaxAmount {
        ...Money
      }
    }
    note
    attributes {
      key
      value
    }
    discountCodes {
      code
      applicable
    }
  }
` as const;

const MENU_FRAGMENT = `#graphql
  fragment MenuItem on MenuItem {
    id
    resourceId
    tags
    title
    type
    url
  }
  fragment ChildMenuItem on MenuItem {
    ...MenuItem
  }
  fragment ParentMenuItem on MenuItem {
    ...MenuItem
    items {
      ...ChildMenuItem
    }
  }
  fragment Menu on Menu {
    id
    items {
      ...ParentMenuItem
    }
  }
` as const;

export const HEADER_QUERY = `#graphql
  fragment Shop on Shop {
    id
    name
    description
    primaryDomain {
      url
    }
    brand {
      logo {
        image {
          url
        }
      }
    }
  }
  fragment Announcement on QueryRoot {
    announcement: metaobjects(type: "announcement", first: 5) {
      nodes {
      ... on Metaobject {
          handle
          type
          content: field(key: "content") { value }
          startDate: field(key: "start_date_time") { value }
          endDate: field(key: "end_date_time") { value }
        }
      }
    }
  }

  query Header(
    $country: CountryCode
    $headerMenuHandle: String!
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    shop {
      ...Shop
    }
    menu(handle: $headerMenuHandle) {
      ...Menu
    }

    ...Announcement
    
  }
  ${MENU_FRAGMENT}
` as const;

export const FOOTER_QUERY = `#graphql
  query Footer(
    $country: CountryCode
    $footerMenuHandle: String!
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    menu(handle: $footerMenuHandle) {
      ...Menu
    }
  }
  ${MENU_FRAGMENT}
` as const;

export const MEDIA_IMAGE_FRAGMENT = `#graphql
  fragment MediaImage on Image {
    url
    width
    altText
    height
  }
  
` as const;

export const PUBLISHED_TESTIMONIALS_FRAGMENT = `#graphql
  fragment Testimonials on QueryRoot {
      testimonials: metaobjects(type: "testimonials", first: 5) {
        nodes {
        ... on Metaobject {
            id
            handle
            type
            content: field(key: "content") { value }
            name: field(key: "name") { value }
            postion: field(key: "position_company") { value }
            image: field(key: "image") { 
              reference {
                ... on MediaImage {
                  id
                  __typename
                  image {
                    ...MediaImage
                  }
                }
              }
            }
          }
        }
      }
    }
` as const;

export const HOMEPAGE_CONTENT_FRAGMENT = `#graphql
  fragment HomepageContent on QueryRoot {
    homepageContent: metaobjects(type: "homepage_content", first: 1) {
      nodes {
        ... on Metaobject {
          id
          handle
          type
          fields {
            ... on MetaobjectField {
              key
              type
              value
              reference {
                ... on Metaobject {
                  ...WarrantySection
                  ...ThreeColumnsSection
                }
              }
            }
          }
        }
      }
    }
  }

  fragment WarrantySection on Metaobject {
    id
    handle
    type
    fields {
      key
      type
      value
      reference {
        ... on MediaImage {
          id
          image {
            ...MediaImage
          }
        }
      }
    }
  }

  fragment ThreeColumnsSection on Metaobject {
    id
    handle
    type
    fields {
      key
      type
      value
      reference {
        ... on MediaImage {
          id
          image {
            ...MediaImage
          }
        }
      }
    }
  }
` as const;
