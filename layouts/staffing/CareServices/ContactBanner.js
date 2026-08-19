"use client";

import Link from "next/link";

const ContactBanner = () => (
  <section className="py-12 bg-gradient-to-r from-primary-950 via-primary-900 to-primary-700 text-center text-white">
    <h2 className="text-2xl md:text-3xl font-semibold mb-4">Need Caring Professionals?</h2>
    <p className="mb-6 max-w-xl mx-auto">
      Get in touch with our friendly team today and discover how Kare Plus Rugby can support your organisation.
    </p>
    <Link
      href="/contact"
      className="inline-block bg-white text-primary-900 font-semibold px-6 py-3 rounded-full shadow hover:opacity-90 transition"
    >
      Contact Us
    </Link>
  </section>
);

export default ContactBanner;
