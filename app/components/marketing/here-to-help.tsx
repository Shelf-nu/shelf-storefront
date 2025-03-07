import {CrispButton} from './crisp';

export function HereToHelp() {
  return (
    <section
      className="py-9"
      style={{
        background:
          'linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, #FFFFFF 100%)',
        backgroundImage: `url(/images/bg-overlay1.png)`,
      }}
    >
      <div className="container">
        <div className="flex flex-col md:flex-row justify-center items-center gap-[75px]">
          <div className="md:w-1/2">
            <img
              src="/images/support-crew.png"
              alt="Support crew"
              className="h-[205px] w-auto ml-auto object-contain"
            />
          </div>
          <div className="md:w-1/2">
            <h3 className="text-[24px] font-medium mb-3">
              Meet Your Dedicated Support Team
            </h3>
            <p className="text-gray-600 text-[18px] font-[300]">
              Real people, real solutions. Our asset tracking experts
              <br className="hidden md:block" /> are ready to help your business
              succeed.
            </p>
            <CrispButton variant="secondary" className="mt-5">
              Ask a question
            </CrispButton>
          </div>
          <div></div>
        </div>
      </div>
    </section>
  );
}
