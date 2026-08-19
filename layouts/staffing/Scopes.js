"use client";

import { MdLocalHospital, MdHomeWork, MdElderly } from "react-icons/md";

const scopes = [
  {
    icon: <MdLocalHospital size={40} className="text-primary-800" />,
    title: "Hospitals & Clinics",
    text: "Reliable staff to maintain high standards of patient care.",
  },
  {
    icon: <MdHomeWork size={40} className="text-primary-800" />,
    title: "Care Homes",
    text: "Supportive carers and nurses for residential settings.",
  },
  {
    icon: <MdElderly size={40} className="text-primary-800" />,
    title: "Community & Home Care",
    text: "Experienced caregivers helping clients remain independent.",
  },
];

const ServiceScopes = () => (
  <section className="py-16">
    <div className="container">
      <h2 className="text-center text-3xl font-bold text-primary mb-8">
        Service Scopes
      </h2>
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
