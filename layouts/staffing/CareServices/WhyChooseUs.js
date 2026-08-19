"use client";

import { MdVerifiedUser, MdSupportAgent, MdAccessTime } from "react-icons/md";

const reasons = [
  {
    icon: <MdVerifiedUser size={36} className="text-primary" />,
    title: "Thorough Vetting",
    text: "All personnel undergo DBS and reference checks for complete peace of mind.",
  },
  {
    icon: <MdSupportAgent size={36} className="text-primary" />,
    title: "Dedicated Support",
    text: "Our consultants are on hand 24/7 to respond to urgent requests and queries.",
  },
  {
    icon: <MdAccessTime size={36} className="text-primary" />,
    title: "Fast Response",
    text: "We maintain a wide pool of available staff allowing quick placements when you need them most.",
  },
];

const WhyChooseUs = () => (
  <section className="py-16 bg-primary-50">
    <div className="container">
      <h2 className="text-center text-3xl font-bold text-primary mb-12">Why Choose Kare Plus Rugby</h2>
      <div className="grid gap-8 md:grid-cols-3">
        {reasons.map((reason, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow hover:shadow-lg transition"
          >
            <div className="mb-4 flex justify-center">{reason.icon}</div>
            <h3 className="text-lg font-semibold text-primary-800 mb-2">{reason.title}</h3>
            <p className="text-sm text-gray-600">{reason.text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChooseUs;
