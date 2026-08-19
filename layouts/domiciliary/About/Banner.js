"use client";
import Link from "next/link";

const AboutBanner = () => (
  <section className="relative z-10 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-700 text-white">
    <div className="container py-20 text-center">
      <h1
        className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent"
        style={{
          backgroundImage:
            "linear-gradient(to right, #12469B, #1D5BC0, #847432)",
        }}
      >
        Your Privacy is Central — Your Care is Personal
      </h1>
      <p className="max-w-2xl mx-auto text-lg">
        At Kare Plus Rugby, we believe that true care starts with trust.
        That’s why your privacy is not just respected — it's at the heart of
        everything we do. We deliver dignified, compassionate, and professional
        support that empowers you or your loved ones to live independently with
        confidence. From everyday assistance to complex care needs, our
        dedicated team is here to provide comfort, companionship, and a helping
        hand — all with the utmost discretion and warmth. Because at Kare Plus Rugby, you’re not just receiving care — you’re gaining a partner who
        genuinely understands and respects your journey.
      </p>
      <Link
        href="/domiciliary/get-started"
        className="inline-block mt-6 border-2 border-white text-white px-6 py-3 rounded-full text-lg font-semibold shadow hover:bg-white hover:text-primary-800 transition"
      >
        Get Started
      </Link>
    </div>
  </section>
);

export default AboutBanner;
