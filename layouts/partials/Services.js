"use client";

import Image from "next/image";
import Link from "next/link";

const services = [
  {
    title: "Domiciliary Care Services",
    content:
      "Personalized home care tailored to your loved one’s daily needs — from companionship to medication support, ensuring comfort and independence at home.",
    images: ["/images/home/home_card_domilciary.jpg"],
    link: "/domiciliary",
  },
  {
    title: "Temporary Staffing Services",
    content:
      "Flexible, on-demand healthcare staffing solutions for hospitals, clinics, and care homes — connecting you with certified professionals quickly and efficiently.",
    images: ["/images/home/home_card_staffing.jpg"],
    link: "/staffing",
  },
  {
    title: "Supported Living Services",
    content:
      "Empowering individuals with disabilities or mental health needs to live independently with tailored support in a safe and caring environment.",
    images: ["/images/home/home_card_supported_living.jpg"],
    link: "/services/supported-living",
  },
];

const Services = () => {
  return (
    <section className="py-20 bg-theme-light w-full px-6 bg-gradient-to-r from-primary-50 via-surface to-surface">
      <div className="container">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary-700 mb-4">
            Our Services
          </h2>
          <p className="text-primary-600 max-w-2xl mx-auto text-base">
            Quality care for every stage of life — from checkups to chronic
            care.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service, index) => (
            <Link
              key={index}
              href={service.link}
              className="group block relative bg-white border border-primary-100 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] h-[450px] overflow-hidden"
            >
              {/* Gradient Top Border */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-primary-200 to-primary-700 rounded-t-xl" />

              {/* Image */}
              <div className="relative h-[50%] w-full overflow-hidden">
                <Image
                  src={service.images?.[0] || "/images/white-log.png"}
                  alt={service.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
                />
              </div>

              {/* Content */}
              <div className="h-[50%] p-6 flex flex-col justify-between">
                <div className="text-left">
                  <h3 className="text-xl font-semibold mb-2 text-primary-700 group-hover:text-primary-800 transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-sm text-black leading-relaxed line-clamp-4">
                    {service.content}
                  </p>
                </div>
                <div className="mt-4 text-sm font-medium text-primary-700 group-hover:underline">
                  Learn more →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
