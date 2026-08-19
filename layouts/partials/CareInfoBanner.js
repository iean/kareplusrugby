"use client";

import Image from "next/image";
import Link from "next/link";

const CareInfoBanner = ({
  title,
  description,
  extraText,
  imageSrc,
  primaryButton,
  secondaryButton,
}) => {
  return (
    <section className="w-full py-12 px-6 bg-gradient-to-r from-primary-50 via-surface to-surface">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        {/* Text Content */}
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-primary-900 mb-4">
            {title}
          </h2>
          <p className="text-gray-700 mb-4">{description}</p>
          {extraText && <p className="text-gray-700 mb-6">{extraText}</p>}

          <div className="flex flex-wrap gap-4">
            {primaryButton && (
              <Link
                href={primaryButton.href}
                className="bg-primary-800 text-white px-5 py-2 rounded-full font-semibold text-sm hover:opacity-90 transition"
              >
                {primaryButton.text}
              </Link>
            )}
            {secondaryButton && (
              <Link
                href={secondaryButton.href}
                className="bg-green-500 text-white px-5 py-2 rounded-full font-semibold text-sm hover:opacity-90 transition"
              >
                {secondaryButton.text}
              </Link>
            )}
          </div>
        </div>

        {/* Image */}
        <div className="rounded-xl border-2 border-primary-900 overflow-hidden">
          <Image
            src={imageSrc}
            alt="Care Info"
            width={600}
            height={400}
            className="object-cover w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default CareInfoBanner;
