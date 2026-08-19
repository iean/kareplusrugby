"use client";
import Image from "next/image";

const PageHero = ({ title, subtitle, image, small = false }) => (
  <section
    className={`h-[70vh] bg-gradient-to-br from-primary-950 via-primary-900 to-primary-700 flex items-center`}
  >
    <div className="container mx-auto grid md:grid-cols-2 gap-8 items-center">
      <div>
        <h1
          className="text-4xl font-bold mb-4 bg-clip-text text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(to right, #12469B, #1D5BC0, #847432)",
          }}
        >
          {title}
        </h1>
        {subtitle && <p className="text-lg text-white">{subtitle}</p>}
      </div>
      {image && (
        <div className="rounded-xl overflow-hidden shadow-lg h-full">
          <Image
            src={image}
            alt={title}
            width={700}
            height={300}
            className="object-cover w-full h-full"
          />
        </div>
      )}
    </div>
  </section>
);

export default PageHero;
