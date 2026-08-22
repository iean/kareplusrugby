import Image from "next/image";
import BannerCarousel from "@components/ui/BannerCarousel";

/**
 * Domiciliary care-services banner.
 *
 * This page rendered FIVE <h1> elements: three slide headings plus Swiper's
 * loop clones, with "Peace of Mind" and "Quality Home Care" each appearing
 * twice. That is the duplicated-carousel fault the work plan reported, alive
 * on a section page rather than the homepage.
 *
 * One <h1> for the page now; the rotating messages are <h2> slides.
 *
 * The image carousel beside it is gone. It rotated five unrelated photographs
 * on a 4-second timer with alt text reading "Domiciliary image 1", "Domiciliary
 * image 2"... — motion that carried no information and alt text that carried
 * none either. One decorative image serves the same purpose without the churn.
 */
const SLIDES = [
  {
    title: "Quality home care",
    text: "Support built around your life, so you can stay independent at home.",
  },
  {
    title: "Reliable carers",
    // Wording follows the FAQ, which is careful not to promise complete
    // continuity - carers take holiday and get ill. Do not harden this.
    text: "We plan rotas for continuity, so you should see a small group of familiar faces.",
  },
  {
    title: "Peace of mind",
    text: "Experienced carers, and someone on call whenever care is being delivered.",
  },
];

const DomiciliaryBanner = () => (
  <section className="relative z-10 overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-primary-700">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 z-0 h-full w-full bg-gradient-to-r from-primary-950/40 via-transparent to-transparent"
    />
    <div className="relative z-20 mx-auto flex max-w-screen-xl flex-col-reverse items-center justify-between gap-12 px-6 py-32 lg:flex-row lg:px-8">
      <div className="w-full lg:w-1/2">
        <h1 className="mb-6 text-4xl font-extrabold text-white md:text-5xl">
          Care services at home
        </h1>
        <BannerCarousel items={SLIDES} ariaLabel="What our home care offers" />
      </div>

      <div className="h-auto w-full max-w-[680px]">
        <div className="aspect-video h-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
          <Image
            src="/images/domiciliary/Bannerdomiciliary.jpg"
            alt=""
            aria-hidden="true"
            width={900}
            height={720}
            sizes="(min-width: 1024px) 50vw, 100vw"
            quality={60}
            className="h-full w-full object-cover"
            priority
          />
        </div>
      </div>
    </div>

    <div aria-hidden="true" className="absolute bottom-0 left-0 right-0 z-10">
      <svg
        viewBox="0 0 1440 120"
        className="h-[100px] w-full lg:h-[160px]"
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

export default DomiciliaryBanner;
