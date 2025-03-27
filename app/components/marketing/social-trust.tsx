export function SocialTrust() {
  return (
    <section className="pt-[44px] pb-[60px] bg-gray-50">
      <div className="container">
        <div>
          <h4 className="text-center mb-[30px]">
            Trusted by 1000+ organizations worldwide
          </h4>
        </div>
        <div className="flex flex-col md:flex-row gap-[35px] justify-center items-center">
          <img
            src="/images/logos/sea-shepherd-logo.jpg"
            alt="Sea shepherd logo"
            className="h-[40px] w-auto filter grayscale"
          />
          <img
            src="/images/logos/uss-midway-museum.png"
            alt="USS midway museum logo"
            className="h-[40px] w-auto"
          />
          <img
            src="/images/logos/purdue-university-logo.png"
            alt="Purdue university logo"
            className="h-[40px] w-auto"
          />
          <img
            src="/images/logos/sunrun-logo.png"
            alt="Sunrun logo"
            className="h-[40px] w-auto"
          />
          <img
            src="/images/logos/who-13-logo.png"
            alt="Who 13 logo"
            className="h-[40px] w-auto"
          />
        </div>
      </div>
    </section>
  );
}
