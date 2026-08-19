"use client";
import Link from "next/link";
import Image from "next/image";

import {
  MdAccessTime,
  MdHome,
  MdOutlinePsychology,
  MdHotel,
} from "react-icons/md";

const services = [
  {
    icon: <MdAccessTime size={40} className="text-primary-800" />,
    title: "Hourly Visiting",
    text: "Flexible visits providing help with day-to-day tasks when you need it.",
  },
  {
    icon: <MdHome size={40} className="text-primary-800" />,
    title: "Live-In Care",
    text: "24/7 support from a carer living with you at home.",
  },
  {
    icon: <MdOutlinePsychology size={40} className="text-primary-800" />,
    title: "Dementia Care",
    text: "Specialist assistance allowing those with dementia to stay at home.",
  },
  {
    icon: <MdHotel size={40} className="text-primary-800" />,
    title: "Respite Care",
    text: "Short-term care giving family and friends a well-earned break.",
  },
];

const DomiciliaryHomeServices = () => (
  <section className="py-16 bg-primary-50 bg-gradient-to-r from-primary-50 via-surface to-surface">
    <div className="container">
      <div className="flex justify-center mb-4">
        <Image
          src="/images/kareplus-logo.png"
          alt="Kare Plus Rugby"
          width={180}
          height={80}
          className="drop-shadow-md"
        />
      </div>
      <h2 className="text-center text-3xl font-bold text-primary mb-8">
        Premium Domiciliary Care Services
      </h2>
      <p className="text-center text-gray-600 text-base leading-relaxed mb-6">
        Discover our reliable, professional home care services designed to bring
        peace of mind to you and your loved one
      </p>
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
        {services.map((item, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow hover:shadow-lg transition"
          >
            <div className="mb-4 flex justify-center">{item.icon}</div>
            <h3 className="text-lg font-semibold text-primary-800 mb-2">
              {item.title}
            </h3>
            <p className="text-sm text-gray-600">{item.text}</p>
          </div>
        ))}
      </div>
      <div className="text-center mt-8">
        <Link
          href="/domiciliary/care-services"
          className="inline-block bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-opacity-90 transition"
        >
          All Services
        </Link>
      </div>
    </div>
  </section>
);

export default DomiciliaryHomeServices;
