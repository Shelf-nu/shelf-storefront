import {MediaFile} from '@shopify/hydrogen';

export const ProductMedia = ({media}: {media: any}) => {
  if (!media) {
    return null;
  }
  const items = media.edges;
  console.log(items);
  // return null;
  return (
    <div>
      {items.map((item) => {
        console.log(item);
        return null;
        // return <MediaFile data={item} key={item.node.id} />;
      })}
    </div>
  );
};

// <>
//   <pre>{JSON.stringify(item.node, 0, 2)}</pre>
//   <br />
// </>
