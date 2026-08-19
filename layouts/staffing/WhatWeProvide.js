"use client";

import Image from "next/image";
import Link from "next/link";

import { MdVerifiedUser, MdGroups, MdHealthAndSafety } from "react-icons/md";

const services = [
  {
    title: "Quality Personnel Service",
    text: "We recruit and deliver services nationwide, staffing all specialties across social, health, and domestic sectors.",
    image: "/images/Staffing Page/Service Standard.jpg",
    icon: <MdVerifiedUser size={28} className="text-primary-900" />,
    link: "/staffing",
  },
  {
    title: "Professional & Reliable",
    text: "From staffing solutions to client experience — professionalism and reliability are at the heart of what we do.",
    image: "/images/Staffing Page/Professional & Reliable.jpg",
    icon: <MdGroups size={28} className="text-primary-900" />,
    link: "/staffing",
  },
  {
    title: "Our Service Standards",
    text: "Kare Plus Rugby maintains strict recruitment standards to deliver safe, effective, and person-centered care.",
    image: "/images/Staffing Page/Quality Personnel Service.jpg",
    icon: <MdHealthAndSafety size={28} className="text-primary-900" />,
    link: "/staffing",
  },
];

const WhatWeProvide = () => (
  <section className="py-20 px-4 bg-gradient-to-br from-surface via-primary-50 to-primary-50">
    <div className="max-w-7xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-primary-900 mb-4">
        What Kare Plus Rugby Provides
      </h2>
      <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
        From expert staffing services to professional healthcare delivery, we
        ensure quality in hospitals, care homes, and community environments.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl overflow-hidden border border-primary-100 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col h-full"
          >
            <div className="relative w-full h-48">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6 flex flex-col flex-grow text-center">
              <div className="flex justify-center mb-2">{item.icon}</div>
              <h3 className="text-lg font-semibold text-primary-900 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 flex-grow">{item.text}</p>
              <Link
                href={item.link}
                className="mt-4 inline-block bg-primary-900 hover:bg-primary-800 text-white text-sm font-semibold px-5 py-2 rounded-full transition"
              >
                READ MORE →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhatWeProvide;
