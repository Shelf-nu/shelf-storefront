import {RichText} from '@shopify/hydrogen';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/shadcn/accordion';
import {PRODUCT_METAFIELDS_KEYS} from '~/utils/products';
import type {Metafield} from '~/utils/products/types';
import {QrIcon, QuestionmarkIcon, ReturnIcon, ShippingIcon} from '../icons';
import {
  Crosshair2Icon,
  InfoCircledIcon,
  QuoteIcon,
  TransformIcon,
} from '@radix-ui/react-icons';

export function MetafieldsAccordion({
  metafields,
}: {
  metafields: Record<string, Metafield>;
}) {
  return (
    <Accordion
      type="multiple"
      defaultValue={Object.values(metafields).map((m) => m.title)}
    >
      {PRODUCT_METAFIELDS_KEYS.map((key, i) => {
        const metafield = metafields[key] ? metafields[key] : null;

        return metafield ? (
          <AccordionItem value={metafield.title} key={metafield.title}>
            <AccordionTrigger>
              <div className="flex items-center">
                <MetafieldIcon metafield={metafield.key} />
                {metafield.title}
              </div>
            </AccordionTrigger>
            {/* Padding is based on icon width + icon margin */}
            <AccordionContent className="pl-[40px]">
              {metafield.type === 'rich_text_field' ? (
                <RichText
                  data={metafield.valueRaw}
                  components={{
                    paragraph({node}) {
                      return <p className="mb-3">{node.children}</p>;
                    },
                    list({node}) {
                      return (
                        <ul className="list-disc list-inside text-[16px]">
                          {node.children}
                        </ul>
                      );
                    },
                  }}
                />
              ) : (
                <p key={metafield.key}>{metafield.valueRaw}</p>
              )}
            </AccordionContent>
          </AccordionItem>
        ) : null;
      })}
    </Accordion>
  );
}

const MetafieldIcon = ({
  metafield,
}: {
  metafield: (typeof PRODUCT_METAFIELDS_KEYS)[number];
}) => {
  const icons: Record<
    (typeof PRODUCT_METAFIELDS_KEYS)[number],
    React.ReactNode
  > = {
    productFeatures: <QrIcon />,
    transformYourAssetManagement: <TransformIcon className="w-5 h-auto" />,
    perfectFor: <Crosshair2Icon className="w-5 h-auto" />,
    whatOurClientsSay: <QuoteIcon className="w-5 h-auto" />,
    extraInfo: <InfoCircledIcon className="w-5 h-auto" />,
    howToUse: <QuestionmarkIcon />,
    shipping: <ShippingIcon />,
    returnPolicy: <ReturnIcon />,
  };

  return (
    <span className="w-6 h-auto p-[2px] inline-block text-gray-600 mr-4">
      {icons[metafield]}
    </span>
  );
};
