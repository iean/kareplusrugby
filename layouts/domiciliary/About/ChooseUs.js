"use client";

import Image from "next/image";

const points = [
  "Experienced and caring professionals",
  "Flexible support tailored to your needs",
  "Commitment to quality and reliability",
];

const ChooseUs = () => (
  <section className="py-16">
    <div className="container grid md:grid-cols-2 gap-8 items-center">
      <div className="order-2 md:order-1">
        <Image
          src="/images/home/HOME_Financing.jpg"
          alt="Why Choose Us"
          width={600}
          height={400}
          className="rounded-xl w-full h-auto object-cover border"
        />
      </div>
      <div className="order-1 md:order-2">
        <h2 className="text-3xl font-bold text-primary mb-4">
          Why should I choose Kare Plus Rugby as my domiciliary care
          provider?
        </h2>
        <p className="text-gray-700 mb-4">
          We understand how important it is to work with a provider you can
          truly trust.
        </p>
        <ul className="list-disc pl-5 space-y-1 text-gray-700 text-sm">
          {points.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

export default ChooseUs;
