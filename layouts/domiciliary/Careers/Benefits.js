"use client";

import Image from "next/image";

const points = [
  "Competitive pay rates",
  "Ongoing training and development",
  "Employee recognition and rewards",
];

const Benefits = () => (
  <section className="py-16">
    <div className="container grid md:grid-cols-2 gap-8 items-center">
      <div className="order-2 md:order-1">
        <Image
          src="/images/services/social-companionship.PNG"
          alt="Benefits"
          width={600}
          height={400}
          className="rounded-xl w-full h-auto object-cover border"
        />
      </div>
      <div className="order-1 md:order-2">
        <h2 className="text-3xl font-bold text-primary mb-4">
          Why Join Kare Plus Rugby?
        </h2>
        <ul className="list-disc pl-5 space-y-1 text-gray-700 text-sm mb-4">
          {points.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
        <p className="text-gray-700">
          Become part of a passionate team making a real difference in people's
          lives every day.
        </p>
      </div>
    </div>
  </section>
);

export default Benefits;
