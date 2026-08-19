"use client";

import { MdLocalHospital, MdElderly, MdCleaningServices } from "react-icons/md";

const services = [
  {
    icon: <MdLocalHospital size={36} className="text-primary" />,
    title: "Nurses & HCAs",
    text: "Qualified nurses and healthcare assistants available for temporary or permanent placements.",
  },
  {
    icon: <MdElderly size={36} className="text-primary" />,
    title: "Support Workers",
    text: "Experienced carers for learning disability, mental health and community support.",
  },
  {
    icon: <MdCleaningServices size={36} className="text-primary" />,
    title: "Domestic Staff",
    text: "Reliable ancillary staff including cooks and cleaners to keep services running smoothly.",
  },
];

const ServiceCards = () => (
  <section className="py-16 bg-theme-light">
    <div className="container">
      <h2 className="text-center text-3xl font-bold text-primary mb-12">Our Staffing Options</h2>
      <div className="grid gap-8 md:grid-cols-3">
        {services.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow hover:shadow-lg transition"
          >
            <div className="mb-4 flex justify-center">{item.icon}</div>
            <h3 className="text-lg font-semibold text-primary-800 mb-2">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ServiceCards;
