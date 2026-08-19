"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/pagination";

SwiperCore.use([Autoplay, Pagination]);

const slides = [
  {
    title: "Domiciliary Care Services",
    content:
      "Tailored home care designed to support independence, comfort, and well-being for your loved ones.",
    link: "/domiciliary",
    image: "/images/home/banner_01.png",
  },
  {
    title: "Temporary Staffing Services",
    content:
      "Flexible healthcare staffing solutions for clinics, hospitals, and care homes—fast, reliable, and certified.",
    link: "/staffing",
    image: "/images/home/banner_02.jpg",
  },
  {
    title: "Supported Living Solutions",
    content:
      "Empowering individuals with disabilities and mental health needs to live safely and independently.",
    link: "/services/supported-living",
    image: "/images/home/banner_03.png",
  },
];

const HomeBannerMain = () => {
  return (
    <section className="relative z-10 h-[80vh] overflow-hidden">
      <Swiper
        autoplay={{ delay: 500000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="w-full h-full relative flex items-center justify-center bg-cover bg-center"
              style={{
                backgroundImage: `url(${slide.image})`,
              }}
            >
              {/* Gradient Overlay */}
              <div className="absolute inset-0 z-0 bg-gradient-to-r from-primary-950 via-primary-900 to-primary-700" />

              {/* Content */}
              <div className="z-10 max-w-screen-xl mx-auto px-2 md:px-2 w-full">
                <div className="max-w-3xl text-white text-center mx-auto relative top-[10%] md:top-[-5%]">
                  <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">
                    {slide.title}
                  </h1>
                  <p className="text-md md:text-lg mb-6">{slide.content}</p>
                  <div className="flex justify-center">
                    <Link
                      href={slide.link}
                      className="inline-block bg-white text-primary-900 hover:bg-primary-700 hover:text-white font-semibold px-6 py-3 rounded-full transition"
                    >
                      View Service
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Bottom Wave Accent */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
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

export default HomeBannerMain;
