"use client";

import Image from "next/image";
import Link from "next/link";

const ServiceDescription = ({
  title = "Kare Plus Rugby",
  subtitle1 = "Flexible Opportunities with Personalised Support",
  subtitle2 = "Competitive Pay That Values Your Work",
  description1 = `At Kare Plus Rugby, we connect compassionate professionals with meaningful roles in healthcare and social support. Our goal is to deliver trusted staffing solutions that empower both our clients and carers.`,
  description2 = `Whether you're looking for part-time flexibility or full-time placement, we offer a variety of roles tailored to your schedule and strengths. From hospitals to home care, we ensure you're matched with the right opportunity.`,
  description3 = `We believe in recognising the dedication of our staff. That’s why we offer competitive pay rates to reward your commitment and help you focus on what matters most — delivering exceptional care.`,
  imageSrc = "/images/services/care-unique-domiliciary.jpeg",
}) => (
  <section className="py-16 bg-white">
    <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
      {/* Left: Image with border */}
      <div className="order-1">
        <div className="p-2 border-2 border-green-500 rounded-2xl inline-block">
          <Image
            src={imageSrc}
            alt={title}
            width={500}
            height={500}
            className="rounded-xl object-cover"
          />
        </div>
      </div>

      {/* Right: Content */}
      <div className="order-2">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          {title}
        </h2>
        <p className="text-gray-700 mb-4">{description1}</p>

        <h3 className="font-semibold text-gray-800 mb-1">{subtitle1}</h3>
        <p className="text-gray-700 mb-4">{description2}</p>

        <h3 className="font-semibold text-gray-800 mb-1">{subtitle2}</h3>
        <p className="text-gray-700 mb-6">{description3}</p>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/staffing/about-us"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 text-sm rounded-full transition"
          >
            FIND OUT MORE
          </Link>
          <Link
            href="/staffing/how-we-work"
            className="bg-primary-900 hover:bg-primary-800 text-white font-semibold px-6 py-3 text-sm rounded-full transition"
          >
            REGISTER TODAY
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default ServiceDescription;
