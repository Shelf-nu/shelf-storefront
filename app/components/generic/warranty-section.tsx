import {Image} from '@shopify/hydrogen';
import {WarrantySectionFragment} from 'storefrontapi.generated';
import {Button} from '../button';
interface WarrantySectionData {
  title: string;
  content: string;
  cta: {
    text: string;
    url: string;
  };
  big_image: {
    altText: string;
    url: string;
    width: number;
    height: number;
  };
  icon: {
    alText: string;
    url: string;
    width: number;
    height: number;
  };
}

export function WarrantySection({content}: {content: WarrantySectionFragment}) {
  // @ts-ignore
  const data: WarrantySectionData = content.fields.reduce((acc, field) => {
    let v: unknown = field.value;

    /** Handle file reference fields. In our case its only image */
    if (field.reference && field.type === 'file_reference') {
      v = field.reference.image;
    } else if (field.type === 'link' && field.value) {
      /** Handle links. They get returned as json */
      v = JSON.parse(field.value);
    }

    // @ts-ignore
    acc[field.key] = v;
    return acc;
  }, {});

  return (
    <div className="bg-white py-24">
      <div className="container text-center flex flex-col justify-center items-center gap-[20px]">
        <Image
          data={data.icon}
          width={data.icon.width}
          height={data.icon.height}
        />
        <h2 className="text-4xl font-semibold m-0">{data.title}</h2>
        <p className="md:max-w-[768px] text-[20px] text-gray-600">
          {data.content}
        </p>
        <Button to={data.cta.url} variant={'secondary'} className="mt-3">
          {data.cta.text}
        </Button>

        <Image
          data={data.big_image}
          width={data.big_image.width}
          height={data.big_image.height}
          className="mt-16"
        />
      </div>
    </div>
  );
}
