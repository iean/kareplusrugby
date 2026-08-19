"use client";

import Image from "next/image";

const options = [
  {
    image: "/images/services/holiday-care.jpeg",
    title: "Holiday Care",
    text: "Short-term support while family carers are away on holiday.",
  },
  {
    image: "/images/services/hospital_home.jpeg",
    title: "Hospital to Home",
    text: "Helping you settle back home safely after a hospital stay.",
  },
  {
    image: "/images/services/live-in-care-purple.jpeg",
    title: "Live in Care",
    text: "Full-time care in your own home giving constant reassurance.",
  },
  {
    image: "/images/services/night-care.jpeg",
    title: "Night Care",
    text: "Overnight assistance for peace of mind and uninterrupted rest.",
  },
  {
    image: "/images/services/personal-care.jpeg",
    title: "Personal Care",
    text: "Support with washing, dressing and other daily routines.",
  },
  {
    image: "/images/services/respite-care.jpeg",
    title: "Respite Care",
    text: "Temporary care giving family members time to recharge.",
  },
  {
    image: "/images/services/specialist.jpeg",
    title: "Specialist Care",
    text: "Bespoke services for complex medical or disability needs.",
  },
  {
    image: "/images/services/social-companionship.PNG",
    title: "Social Companionship",
    text: "Friendly company and help getting out and about.",
  },
];

const ServiceOptions = () => (
  <section className="py-16 bg-theme-light">
    <div className="container">
      <h2 className="text-center text-3xl font-bold text-primary mb-8">
        Our Services
      </h2>
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {options.map((item, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow hover:shadow-lg transition"
          >
            <div className="relative h-40 w-full">
              <Image
                src={item.image}
                alt={item.title}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="p-4 text-center">
              <h3 className="text-lg font-semibold text-primary-800 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ServiceOptions;
