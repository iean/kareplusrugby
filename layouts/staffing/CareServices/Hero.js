"use client";

import Image from "next/image";
import Link from "next/link";

const Hero = () => (
  <section className="relative z-10 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-700 overflow-hidden">
    <div className="max-w-screen-xl mx-auto px-6 lg:px-8 py-24 flex flex-col lg:flex-row items-center gap-12 relative z-20">
      <div className="w-full lg:w-1/2 text-center lg:text-left animate-fadeLeftSlow">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white">
          Professional Staffing Services
        </h1>
        <p className="mt-4 text-lg text-white max-w-xl mx-auto lg:mx-0">
          Kare Plus Rugby supplies compassionate and reliable professionals
          across hospitals, care homes and community services.
        </p>
        <Link
          href="/contact"
          className="inline-block mt-6 border-2 border-white text-white px-6 py-3 rounded-full text-lg font-semibold shadow hover:bg-white hover:text-primary-800 transition"
        >
          Request Staff Today
        </Link>
      </div>
      <div className="w-full lg:w-1/2 h-64 md:h-80 relative">
        <div className="absolute inset-0 rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <Image
            src="/images/Staffing Page/Staffing 2.jpg"
            alt="Staffing"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
