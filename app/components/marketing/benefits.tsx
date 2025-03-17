export function Benefits() {
  return (
    <section className="py-9 bg-primary-50">
      <div className="container">
        <div className="flex flex-col md:flex-row gap-[60px] justify-center">
          <div className="text-center">
            <img
              src="/images/free-shipping-icon.png"
              alt="Free shipping"
              className="size-14 mx-auto mb-3"
              sizes="56px"
            />
            <h4 className="mb-1">Free shipping above $150</h4>
            <p>Tracked deliveries, businesses trust.</p>
          </div>
          <div className="text-center">
            <img
              src="/images/no-minimum-order-icon.png"
              alt="Free shipping"
              className="size-14 mx-auto mb-3"
              sizes="56px"
            />
            <h4 className="mb-1">No minimum order</h4>
            <p>Scale your asset tracking at your own pace.</p>
          </div>
          <div className="text-center">
            <img
              src="/images/seamless-integration-icon.png"
              alt="Free shipping"
              className="size-14 mx-auto mb-3"
              sizes="56px"
            />
            <h4 className="mb-1">Seamless Integration</h4>
            <p>Labels engineered exclusively for our software.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
