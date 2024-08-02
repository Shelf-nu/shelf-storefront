import {MinusIcon, PlusIcon} from '@radix-ui/react-icons';
import {Button} from '../button';

export const QuantitySelector = ({
  state,
}: {
  state: [s: number, setter: React.Dispatch<React.SetStateAction<number>>];
}) => {
  const [quantity, setQuantity] = state;

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    if (v > 0) {
      setQuantity(v);
    }
  };
  return (
    <div className="flex h-[38px]">
      <Button
        onClick={() => {
          if (quantity > 1) {
            setQuantity(quantity - 1);
          }
        }}
        variant="secondary"
        size="sm"
        className="rounded-r-none"
      >
        <MinusIcon />
      </Button>
      <input
        value={quantity}
        onChange={handleQuantityChange}
        className="w-[52px] h-[38px] p-[8px 16px 8px 16px] border-l-0 border-r-0  opacity-[0px] m-0 border-gray-300 rounded-none text-[14px] text-center"
      />
      <Button
        onClick={() => setQuantity(quantity + 1)}
        variant="secondary"
        size="sm"
        className="rounded-l-none"
      >
        <PlusIcon />
      </Button>
    </div>
  );
};
