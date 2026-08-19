"use client";

import { MdSchedule, MdGroup, MdPerson } from "react-icons/md";
import { FaUserNurse } from "react-icons/fa6";
import Link from "next/link";

const options = [
  {
    icon: <MdSchedule size={32} className="text-primary-900" />,
    title: "Flexible Shifts",
    text: "Round-the-clock support with trained professionals, whenever you need them.",
  },
  {
    icon: <MdPerson size={32} className="text-primary-900" />,
    title: "Trusted Companions",
    text: "Dedicated caregivers who bring comfort, dignity, and consistency to care.",
  },
  {
    icon: <MdGroup size={32} className="text-primary-900" />,
    title: "Home & Residential Support",
    text: "Tailored in-home and care facility staffing that feels like family.",
  },
];

const StaffingOptions = () => (
  <section className="py-20 px-4 md:px-8 bg-gradient-to-br from-primary-50 via-primary-50 to-primary-50">
    <div className="max-w-7xl mx-auto flex flex-col gap-12">
      {/* Centered Intro + CTAs */}
      <div className="flex flex-col items-center text-center">
        <div className="mb-4">
          <FaUserNurse size={40} className="text-primary-900" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
          Kare Plus Rugby Staffing Services
        </h2>
        <p className="mt-4 text-gray-600 max-w-2xl">
          At Kare Plus Rugby, we go beyond traditional staffing. We match you
          with compassionate, qualified professionals who treat every individual
          with the dignity, respect, and warmth they deserve — whether at home,
          in hospitals, or residential settings.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row flex-wrap justify-center gap-4">
          <Link
            href="/work-for-us"
            className="bg-primary-900 hover:bg-primary-800 text-white text-sm font-semibold px-6 py-3 rounded-full transition duration-200"
          >
            JOIN OUR CARE TEAM
          </Link>
          <Link
            href="/staff-request"
            className="bg-primary-900 hover:bg-primary-800 text-white text-sm font-semibold px-6 py-3 rounded-full transition duration-200"
          >
            NEED COMPASSIONATE STAFF?
          </Link>
          <Link
            href="/about"
            className="bg-primary-900 hover:bg-primary-800 text-white text-sm font-semibold px-6 py-3 rounded-full transition duration-200"
          >
            LEARN ABOUT OUR MISSION
          </Link>
        </div>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {options.map((item, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-md transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-fade-up"
            style={{
              animationDelay: `${i * 100}ms`,
              animationFillMode: "both",
            }}
          >
            <div className="mb-4 flex justify-center">{item.icon}</div>
            <h3 className="text-lg font-semibold text-primary-900 mb-2">
              {item.title}
            </h3>
            <p className="text-sm text-gray-600">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default StaffingOptions;
