"use client";

import { MdLocalHospital, MdOutlineVolunteerActivism, MdElderly } from "react-icons/md";

const scopes = [
  {
    icon: <MdElderly size={40} className="text-primary-800" />,
    title: "Elderly Support",
    text: "Helping older adults remain safe and comfortable at home.",
  },
  {
    icon: <MdOutlineVolunteerActivism size={40} className="text-primary-800" />,
    title: "Respite Services",
    text: "Short-term care allowing family members to take a break.",
  },
  {
    icon: <MdLocalHospital size={40} className="text-primary-800" />,
    title: "Specialist Care",
    text: "Trained carers experienced with complex medical conditions.",
  },
];

const ServiceScopes = () => (
  <section className="py-16">
    <div className="container">
      <h2 className="text-center text-3xl font-bold text-primary mb-8">Care Areas</h2>
      <div className="grid gap-8 md:grid-cols-3">
        {scopes.map((item, i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-xl p-6 text-center bg-white shadow hover:shadow-lg transition"
          >
            <div className="flex justify-center mb-4">{item.icon}</div>
            <h3 className="text-lg font-semibold text-primary-800 mb-2">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ServiceScopes;
