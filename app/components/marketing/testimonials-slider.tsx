import {Await, Link} from '@remix-run/react';
import {Image, MediaFile, Money} from '@shopify/hydrogen';
import {Suspense} from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../shadcn/carousel';
import type {TestimonialsFragment} from 'storefrontapi.generated';

export function TestimonialsSlider({
  testimonials,
}: {
  testimonials: TestimonialsFragment['testimonials']['nodes'] | null;
}) {
  return (
    <Carousel
      className="py-24"
      style={{
        background:
          'linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, #FFFFFF 100%)',
        backgroundImage: `url(/images/bg-overlay1.png)`,
      }}
    >
      <div className="container">
        <CarouselContent>
          {testimonials
            ? testimonials.map((testimonial) => {
                return (
                  <CarouselItem key={testimonial.id}>
                    <div>
                      <blockquote className="text-center text-[36px] leading-[40px] max-w-[800px] mx-auto mb-9">
                        “{testimonial?.content?.value}”
                      </blockquote>
                      <div className="mx-auto  max-w-[800px] text-center">
                        {testimonial?.image?.reference && (
                          <div className="size-16 text-center mx-auto mb-4">
                            <MediaFile
                              data={testimonial?.image?.reference}
                              className="object-center object-cover h-full w-full rounded-full"
                            />
                          </div>
                        )}
                        <div className="text-[18px] mb-1 font-semibold">
                          {testimonial?.name?.value}
                        </div>
                        <div className="font-regular text-gray-600">
                          {testimonial?.postion?.value}
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                );
              })
            : null}
        </CarouselContent>
      </div>

      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
