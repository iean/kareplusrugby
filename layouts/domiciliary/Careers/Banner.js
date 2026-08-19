"use client";

const CareersBanner = () => (
  <section className="relative z-10 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-700 text-white">
    <div className="container py-20 text-center">
      <h1
        className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent"
        style={{
          backgroundImage:
            "linear-gradient(to right, #12469B, #1D5BC0, #847432)",
        }}
      >
        Our Careers
      </h1>
      <p className="max-w-2xl mx-auto text-lg">
        Discover rewarding opportunities and join our exceptional team of
        carers.
      </p>
    </div>
  </section>
);

export default CareersBanner;
