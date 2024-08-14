import type {SVGProps} from 'react';

export const QrIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 20 21"
      {...props}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 11h5v5m-8.99-5H1m5.01 5H6m4.01 4H10m9.01-9H19M1 16h1.5m11-5h2M1 20h5m4-19v6m5.6 13h1.8c.56 0 .84 0 1.054-.109a1 1 0 0 0 .437-.437C19 19.24 19 18.96 19 18.4v-1.8c0-.56 0-.84-.109-1.054a1 1 0 0 0-.437-.437C18.24 15 17.96 15 17.4 15h-1.8c-.56 0-.84 0-1.054.109a1 1 0 0 0-.437.437C14 15.76 14 16.04 14 16.6v1.8c0 .56 0 .84.109 1.054a1 1 0 0 0 .437.437C14.76 20 15.04 20 15.6 20Zm0-13h1.8c.56 0 .84 0 1.054-.109a1 1 0 0 0 .437-.437C19 6.24 19 5.96 19 5.4V3.6c0-.56 0-.84-.109-1.054a1 1 0 0 0-.437-.437C18.24 2 17.96 2 17.4 2h-1.8c-.56 0-.84 0-1.054.109a1 1 0 0 0-.437.437C14 2.76 14 3.04 14 3.6v1.8c0 .56 0 .84.109 1.054a1 1 0 0 0 .437.437C14.76 7 15.04 7 15.6 7Zm-13 0h1.8c.56 0 .84 0 1.054-.109a1 1 0 0 0 .437-.437C6 6.24 6 5.96 6 5.4V3.6c0-.56 0-.84-.109-1.054a1 1 0 0 0-.437-.437C5.24 2 4.96 2 4.4 2H2.6c-.56 0-.84 0-1.054.109a1 1 0 0 0-.437.437C1 2.76 1 3.04 1 3.6v1.8c0 .56 0 .84.109 1.054a1 1 0 0 0 .437.437C1.76 7 2.04 7 2.6 7Z"
      />
    </svg>
  );
};

export const ShippingIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={'100%'}
    height={'100%'}
    viewBox="0 0 22 18"
    fill="none"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 4h2.337c.245 0 .367 0 .482.028a1 1 0 0 1 .29.12c.1.061.187.148.36.32l4.062 4.063c.173.173.26.26.322.36.054.09.095.188.12.29.027.115.027.237.027.482V12.5c0 .466 0 .699-.076.883a1 1 0 0 1-.541.54c-.184.077-.417.077-.883.077m-5 0H13m0 0V4.2c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C11.48 1 10.92 1 9.8 1H4.2c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C1 2.52 1 3.08 1 4.2V12a2 2 0 0 0 2 2m10 0H9m0 0a3 3 0 1 1-6 0m6 0a3 3 0 1 0-6 0m16.5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
    />
  </svg>
);

export const ReturnIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    viewBox="0 0 18 18"
    fill="none"
    {...props}
  >
    <path
      stroke="#475467"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 1v1.4c0 3.36 0 5.04-.654 6.324a6 6 0 0 1-2.622 2.622C12.44 12 10.76 12 7.4 12H1m0 0 5-5m-5 5 5 5"
    />
  </svg>
);

export const QuestionmarkIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={'100%'}
    height={'100%'}
    viewBox="0 0 20 21"
    fill="none"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 6.002a2.248 2.248 0 0 1 4.37.75C12.37 8.25 10.12 9 10.12 9m.03 3h.01M5 16v2.335c0 .533 0 .8.11.937a.5.5 0 0 0 .39.188c.176 0 .384-.167.8-.5l2.385-1.908c.488-.39.731-.585 1.002-.724.241-.122.497-.212.762-.267.299-.061.61-.061 1.235-.061H14.2c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C19 13.72 19 12.88 19 11.2V5.8c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C16.72 1 15.88 1 14.2 1H5.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C1 3.28 1 4.12 1 5.8V12c0 .93 0 1.395.102 1.777a3 3 0 0 0 2.122 2.12C3.605 16 4.07 16 5 16Z"
    />
  </svg>
);

export const ShoppingCartIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    viewBox="0 0 22 22"
    fill="none"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M1 1h1.306c.246 0 .37 0 .468.045a.5.5 0 0 1 .213.185c.059.092.076.213.111.457L3.571 5m0 0 1.052 7.731c.134.982.2 1.472.435 1.841a2 2 0 0 0 .853.745c.398.183.893.183 1.883.183h8.558c.942 0 1.414 0 1.799-.17a2 2 0 0 0 .841-.696c.239-.346.327-.81.503-1.735l1.324-6.95c.062-.325.093-.488.048-.615a.5.5 0 0 0-.22-.266C20.532 5 20.366 5 20.034 5H3.571ZM9 20a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm8 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"
    />
  </svg>
);

export function TrashIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M13.333 5v-.667c0-.933 0-1.4-.181-1.756a1.667 1.667 0 0 0-.729-.729c-.356-.181-.823-.181-1.756-.181H9.333c-.933 0-1.4 0-1.756.181-.314.16-.569.415-.729.729-.181.356-.181.823-.181 1.756V5m1.666 4.583v4.167m3.334-4.167v4.167M2.5 5h15m-1.667 0v9.333c0 1.4 0 2.1-.272 2.635a2.5 2.5 0 0 1-1.093 1.093c-.534.272-1.235.272-2.635.272H8.167c-1.4 0-2.1 0-2.635-.272a2.5 2.5 0 0 1-1.093-1.093c-.272-.535-.272-1.235-.272-2.635V5"
        stroke="currentColor"
        strokeWidth={1.667}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
