import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import {tw} from '~/utils/tw';

export const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({className, value, ...props}, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={tw(
      'relative h-4 w-full overflow-hidden rounded-full bg-secondary border border-gray-300',
      className,
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={
        'h-full w-full flex-1 transition-transform transition-background'
      }
      style={{
        transform: `translateX(-${100 - (value || 0)}%)`,
        backgroundImage: 'linear-gradient(to right, #39A0FF, #8FFF85)',
      }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;
