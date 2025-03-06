export function ApplicationShowcase() {
  return (
    <section className="pt-[30px] pb-[45px] bg-gray-50">
      <div className="container bg-gray-200 rounded-lg">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="py-8 px-4">
            <h3 className="text-[30px] mb-4">
              End asset tracking frustration—one seamless scan.
            </h3>
            <p className="text-[20px] text-gray-900 font-[300]">
              Access complete asset information, update locations, manage
              <br className="hidden md:block" /> reservations, and track
              check-outs instantly. Our proprietary
              <br className="hidden md:block" /> labels work exclusively with
              Shelf.nu software for a unified
              <br className="hidden md:block" /> solution generic labels
              can&apos;t match.
            </p>
          </div>
          <div>
            <img
              src="/images/collection-cover-image-optimized.png"
              alt="Asset tracking"
              className="mt-[-20px] mr-[-55px] max-w-[640px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
