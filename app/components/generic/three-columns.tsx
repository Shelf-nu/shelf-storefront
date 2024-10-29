import {
  MediaImageFragment,
  ThreeColumnsSectionFragment,
} from 'storefrontapi.generated';
import {Button} from '../button';
import {Image} from '@shopify/hydrogen';

type CTA = {
  text: string;
  url: string;
};

type Column = {
  content: ThreeColumnsSectionFragment['fields'][0]['value'];
  image: MediaImageFragment;
};

interface ThreeColumnsData {
  cta: CTA | null;
  columns: Column[];
}
type ColumnKeys = 'left' | 'middle' | 'right';

export function ThreeColumns({
  content,
}: {
  content: ThreeColumnsSectionFragment;
}) {
  if (!content) return null;

  const cta = content.fields.find((field) => field.key === 'cta_link')?.value;
  const columns: Record<ColumnKeys, Column> = {
    left: {} as Column,
    middle: {} as Column,
    right: {} as Column,
  };

  content.fields.forEach((field) => {
    if (field.key.split('_').length === 3) {
      const [position, key] = field.key.split(/_(.+)/) as [string, string];

      if (['left', 'middle', 'right'].includes(position)) {
        const columnKey = position as ColumnKeys;

        /** Add the image or text, depending on the case */
        if (key === 'column_image' && field.reference?.image) {
          columns[columnKey] = {
            ...columns[columnKey],
            image: field.reference.image as MediaImageFragment,
          };
        } else if (key === 'column_text') {
          columns[columnKey] = {
            ...columns[columnKey],
            content: field.value as string,
          };
        }
      }
    }
  });

  const data: ThreeColumnsData = {
    cta: cta ? (JSON.parse(cta) as CTA) : null,
    columns: Object.values(columns),
  };

  return (
    <div className="py-24">
      <div className="container">
        <div className="flex flex-col gap-5 justify-center items-center">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            {data.columns.map(
              (column, index) =>
                column.image && (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center text-center gap-5"
                  >
                    <Image
                      data={column.image}
                      width={column.image.width || 240}
                      height={column.image.height || 240}
                      className="max-w-full rounded-full bg-gray-100"
                    />
                    <p>{column.content}</p>
                  </div>
                ),
            )}
          </div>
          {data.cta && (
            <Button to={data.cta.url} variant="secondary" className="mt-16">
              {data.cta.text}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
