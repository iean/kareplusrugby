"use client";
import { markdownify } from "@lib/utils/textConverter";
import Image from "next/image";
import Link from "next/link";
import { BiArrowBack } from "react-icons/bi";

const DomiciliaryBanner = () => {
  return (
    <section className="relative z-10 bg-gradient-to-r from-success via-primary-300 to-primary-400 overflow-hidden">
      <Link
        href="/"
        className="absolute top-4 left-4 flex items-center text-white text-sm font-semibold bg-primary-900 bg-opacity-70 hover:bg-opacity-90 px-3 py-1 rounded-full"
      >
        <BiArrowBack className="mr-1" />
        Services
      </Link>
      <div className="max-w-screen-xl mx-auto px-6 lg:px-8 py-24 flex flex-col lg:flex-row items-center justify-between relative z-20 gap-10 lg:gap-20">
        {/* Left Content */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Expert Care at Home Services in Our Region
          </h1>
          <p className="mt-4 text-white text-lg">
            {markdownify("Home care built around you and your loved ones")}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link
              href="/domiciliary"
              className="inline-block border-2 border-white text-white px-6 py-3 rounded-full text-base font-semibold shadow hover:bg-white hover:text-primary-800 transition"
            >
              View Services
            </Link>
            <Link
              href="/contact"
              className="inline-block border-2 border-white text-white px-6 py-3 rounded-full text-base font-semibold shadow hover:bg-white hover:text-primary-800 transition"
            >
              Know More About Us
            </Link>
          </div>
        </div>

        {/* Right Image */}
        <div className="w-full lg:w-1/2">
          <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200">
            <Image
              src="/images/banner-caregiving/hero1.jpg"
              alt="Caregiver and elderly woman"
              width={700}
              height={500}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DomiciliaryBanner;
