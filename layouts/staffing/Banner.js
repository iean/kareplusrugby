"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";
import Link from "next/link";
import { BiArrowBack } from "react-icons/bi";

SwiperCore.use([Autoplay, Pagination]);

const slides = [
  {
    title: "Expert Healthcare Staffing",
    text: "Connecting you with qualified professionals when you need them most.",
    buttonText: "Register Today",
    buttonLink: "/staffing/how-we-work",
  },
  {
    title: "Rapid Placement Solutions",
    text: "Our network allows quick response for urgent staffing requirements.",
    buttonText: "Contact Us",
    buttonLink: "/contact",
  },
  {
    title: "24/7 Support",
    text: "We are available around the clock to assist your organisation.",
    buttonText: "Contact Us",
    buttonLink: "/staffing/contact-us",
  },
];

const StaffingBanner = () => {
  return (
    <section className="relative z-10 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-700 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full z-0 bg-gradient-to-r from-primary-950/40 via-transparent to-transparent pointer-events-none" />
      <div className="max-w-screen-xl mx-auto px-6 lg:px-8 py-32 flex flex-col-reverse lg:flex-row items-center justify-between relative z-20 gap-12">
        {/* Left Text Carousel */}
        <div className="w-full lg:w-1/2 animate-fadeLeftSlow">
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop
          >
            {slides.map((slide, i) => (
              <SwiperSlide key={i} className="text-white py-4">
                <h1
                  className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, #12469B, #1D5BC0, #847432)",
                  }}
                >
                  {slide.title}
                </h1>
                <p className="text-lg max-w-xl mb-6">{slide.text}</p>
                <Link
                  href={slide.buttonLink}
                  className="inline-block border-2 border-white text-white px-6 py-3 rounded-full text-lg font-semibold shadow hover:bg-white hover:text-primary-800 transition"
                >
                  {slide.buttonText}
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Right Image - Enlarged */}
        <div className="w-full lg:w-[60%] h-auto">
          <div className="aspect-[3/2] h-full rounded-2xl shadow-2xl overflow-hidden border border-gray-200 bg-white">
            <Image
              src="/images/services/live-in-care-purple.jpeg"
              alt="Staffing banner"
              width={1000}
              height={700}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </div>
      </div>
      {/* Bottom Wave SVG */}
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

export default StaffingBanner;
