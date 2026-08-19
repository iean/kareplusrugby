import Link from "next/link";

const ContactUsBanner = () => {
  return (
    <section className="py-12 bg-gradient-to-r from-primary-950 via-primary-900 to-primary-700 text-center text-white">
      <h2 className="text-2xl md:text-3xl font-semibold mb-4">Ready to Begin?</h2>
      <p className="mb-6 max-w-xl mx-auto">
        Reach out to our friendly team today to discuss how we can support you or your loved ones.
      </p>
      <Link
        href="/contact"
        className="inline-block bg-white text-primary-900 font-semibold px-6 py-3 rounded-full shadow hover:opacity-90 transition"
      >
        Contact Us
      </Link>
    </section>
  );
};

export default ContactUsBanner;
