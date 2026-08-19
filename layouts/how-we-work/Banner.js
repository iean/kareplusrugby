"use client";

import Image from "next/image";
import Link from "next/link";

const HowWeWorkBanner = () => {
  return (
    <section className="relative z-10 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-700 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full z-0 bg-gradient-to-r from-primary-950/40 via-transparent to-transparent pointer-events-none" />
      <div className="max-w-screen-xl mx-auto px-6 lg:px-8 py-32 flex flex-col-reverse lg:flex-row items-center justify-between relative z-20 gap-12">
        <div className="w-full lg:w-1/2 text-left animate-fadeLeftSlow">
          <h1
            className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(to right, #12469B, #1D5BC0, #847432)",
            }}
          >
            How We Work
          </h1>
          <p className="mt-4 text-white text-lg max-w-xl">
            We follow a simple process to match you with the right carers and
            ensure quality support at every step.
          </p>
          <Link
            href="/contact"
            className="inline-block mt-6 border-2 border-white text-white px-6 py-3 rounded-full text-lg font-semibold shadow hover:bg-white hover:text-primary-800 transition"
          >
            Get Started
          </Link>
        </div>
        <div className="w-full max-w-[680px] h-auto">
          <div className="aspect-video h-full rounded-2xl shadow-xl overflow-hidden border border-gray-200 bg-white">
            <Image
              src="/images/Contact us.jpg"
              alt="How we work"
              width={900}
              height={720}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg
          viewBox="0 0 1440 120"
          className="w-full h-[100px] lg:h-[160px] transform scale-x-[-1]"
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
};

export default HowWeWorkBanner;
