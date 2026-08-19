"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";

SwiperCore.use([Autoplay, Pagination]);

const slides = [
  {
    title: "Quality Home Care",
    text: "Empowering you to live independently with support tailored to your lifestyle.",
  },
  {
    title: "Reliable Carers",
    text: "Our compassionate team is on hand whenever you need a helping hand.",
  },
  {
    title: "Peace of Mind",
    text: "Experienced professionals ensuring comfort and safety at home.",
  },
];

const imageSlides = [
  "/images/domiciliary/h1.png",
  "/images/domiciliary/h2.jpg",
  "/images/domiciliary/h3.png",
  "/images/domiciliary/about-ethos.png",
  "/images/domiciliary/Bannerdomiciliary.jpg",
];

const DomiciliaryBanner = () => {
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
                <p className="text-lg max-w-xl">{slide.text}</p>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Right Image Carousel */}
        <div className="w-full max-w-[680px] h-auto">
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            loop
          >
            {imageSlides.map((src, i) => (
              <SwiperSlide key={i}>
                <div className="aspect-video h-full rounded-2xl shadow-xl overflow-hidden border border-gray-200 bg-white">
                  <Image
                    src={src}
                    alt={`Domiciliary image ${i + 1}`}
                    width={900}
                    height={720}
                    className="w-full h-full object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
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

export default DomiciliaryBanner;
