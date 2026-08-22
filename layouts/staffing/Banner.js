import Image from "next/image";
import BannerCarousel from "@components/ui/BannerCarousel";

/**
 * Staffing section banner.
 *
 * Previously three <h1> slides in an auto-advancing, looping Swiper — which
 * rendered as FIVE <h1> elements once Swiper's loop clones were counted, two
 * of them repeats. See BannerCarousel for the full list of what was wrong.
 *
 * The page now has one real <h1> stating what the page is, and the rotating
 * messages sit beneath it as <h2> slides.
 */
const SLIDES = [
  {
    title: "Expert healthcare staffing",
    text: "Connecting you with qualified professionals when you need them most.",
    buttonText: "How we work",
    buttonLink: "/staffing/how-we-work",
  },
  {
    title: "Rapid placement",
    text: "Our network allows a quick response for urgent staffing requirements.",
    buttonText: "Contact us",
    buttonLink: "/contact",
  },
  {
    title: "24/7 support",
    text: "There is someone on call around the clock to assist your organisation.",
    buttonText: "Talk to our staffing team",
    buttonLink: "/staffing/contact-us",
  },
];

const StaffingBanner = () => (
  <section className="relative z-10 overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-primary-700">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 z-0 h-full w-full bg-gradient-to-r from-primary-950/40 via-transparent to-transparent"
    />
    <div className="relative z-20 mx-auto flex max-w-screen-xl flex-col-reverse items-center justify-between gap-12 px-6 py-32 lg:flex-row lg:px-8">
      <div className="w-full lg:w-1/2">
        <h1 className="mb-6 text-4xl font-extrabold text-white md:text-5xl">
          Nurses and carers for your care home
        </h1>
        <BannerCarousel items={SLIDES} ariaLabel="Our staffing services" />
      </div>

      <div className="h-auto w-full lg:w-[60%]">
        <div className="aspect-[3/2] h-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
          {/* Decorative - the heading beside it already says what this is. */}
          <Image
            src="/images/services/live-in-care-purple.jpeg"
            alt=""
            aria-hidden="true"
            width={1000}
            height={700}
            className="h-full w-full object-cover"
            priority
          />
        </div>
      </div>
    </div>

    <div aria-hidden="true" className="absolute bottom-0 left-0 right-0 z-10">
      <svg
        viewBox="0 0 1440 120"
        className="h-[100px] w-full scale-x-[-1] transform lg:h-[160px]"
        preserveAspectRatio="none"
      >
        <path
          fill="#062463"
          d="M0,32L60,48C120,64,240,96,360,96C480,96,600,64,720,64C840,64,960,96,1080,106.7C1200,117,1320,107,1380,101.3L1440,96L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
        />
      </svg>
    </div>
  </section>
);

export default StaffingBanner;
