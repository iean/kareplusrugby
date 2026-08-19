"use client";

import { MdCheck } from "react-icons/md";

const beliefs = [
  "Kindness and Compassion",
  "Respect",
  "Outstanding Care Quality",
  "Reliability and Punctuality",
  "Celebrate and Embrace Cultural Differences",
  "Above and Beyond",
];

const Beliefs = () => (
  <section className="py-16 bg-theme-light">
    <div className="container">
      <h2 className="text-center text-3xl font-bold text-primary mb-8">Our Beliefs</h2>
      <ul className="max-w-3xl mx-auto grid gap-4 md:grid-cols-2">
        {beliefs.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-gray-700">
            <MdCheck className="text-primary-800 mt-1" size={20} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default Beliefs;
