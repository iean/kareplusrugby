import { markdownify } from "@lib/utils/textConverter";
import Image from "next/image";
import Link from "next/link";

/**
 * Section banner for /domiciliary.
 *
 * The image panel used to be a Swiper that cycled four photographs every four
 * seconds, on a loop, with no pause control - a WCAG 2.2.2 failure - and alt
 * text reading "Banner 1", "Banner 2", "Banner 3", "Banner 4". The rotation
 * carried no information and neither did the alt text, so it is one still
 * image, marked decorative. That also drops Swiper from this route's bundle.
 *
 * The heading was painted with a hardcoded hex gradient (#12469B, #1D5BC0,
 * #847432) onto transparent text over a dark blue panel: against the house
 * rule on hardcoded hexes, and gradient-on-transparent text has no dependable
 * contrast ratio. It is plain white now.
 */
const HomeBanner = ({ banner }) => {
  const bannerImage =
    (Array.isArray(banner.images) && banner.images[0]) ||
    "/images/domiciliary/Bannerdomiciliary.jpg";

  return (
    <section className="relative z-10 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-700 overflow-hidden">
      {/* Top Left Gradient Overlay */}
      <div className="absolute top-0 left-0 w-full h-full z-0 bg-gradient-to-r from-primary-950/40 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-screen-xl mx-auto px-6 lg:px-8 py-32 flex flex-col-reverse lg:flex-row items-center justify-between relative z-20 gap-12">
        {/* Left Content */}
        <div className="w-full lg:w-1/2 text-left animate-fadeLeftSlow">
          {/* Gradient Title */}
          <h1 className="text-4xl font-extrabold text-white md:text-5xl">
            {banner.title}
          </h1>

          <p className="mt-4 text-white text-lg max-w-xl">
            {markdownify(banner.content)}
          </p>

          {banner.button.enable && (
            <Link
              className="inline-block mt-6 border-2 border-white text-white px-6 py-3 rounded-full text-lg font-semibold shadow hover:bg-white hover:text-primary-800 transition"
              href={banner.button.link}
              rel={banner.button.rel}
            >
              {banner.button.label}
            </Link>
          )}
        </div>

        {/* Right Image Slider */}
        <div className="w-full max-w-[680px] h-auto">
          <div className="h-[400px] lg:h-[500px] rounded-2xl shadow-xl overflow-hidden border border-gray-200 bg-white">
            <Image
              src={bannerImage}
              alt=""
              aria-hidden="true"
              width={900}
              height={720}
              priority
              className="h-full w-full object-cover object-center"
            />
          </div>
        </div>
      </div>

      {/* Bottom Gradient Wave - Taller and Darker */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg
          viewBox="0 0 1440 120"
          className="w-full h-[100px] lg:h-[160px] transform scale-x-[-1]"
          preserveAspectRatio="none"
        >
          <path
            fill="#062463"
            d="M0,32L60,48C120,64,240,96,360,96C480,96,600,64,720,64C840,64,960,96,1080,106.7C1200,117,1320,107,1380,101.3L1440,96L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default HomeBanner;
