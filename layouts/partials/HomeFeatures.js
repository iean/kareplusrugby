import Image from "next/image";
import { markdownify } from "@lib/utils/textConverter";
import {
  MdAccessTime,
  MdHome,
  MdSupportAgent,
  MdMonetizationOn,
  MdSpeed,
  MdCloud,
} from "react-icons/md";

// Icon mapping
const iconMap = {
  hourly: <MdAccessTime size={30} className="text-brand" />,
  livein: <MdHome size={30} className="text-brand" />,
  "24h": <MdSupportAgent size={30} className="text-brand" />,
  value: <MdMonetizationOn size={30} className="text-brand" />,
  fast: <MdSpeed size={30} className="text-brand" />,
  cloud: <MdCloud size={30} className="text-brand" />,
};

const HomeFeatures = ({ feature }) => {
  return (
    <section className="py-16 bg-primary-50 bg-gradient-to-r from-primary-50 via-surface to-surface">
      <div className="container mx-auto px-4">
        {/* Logo & Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="flex justify-center mb-4">
            <Image
              src="/images/kareplus-logo.png"
              alt="Kare Plus Rugby"
              width={180}
              height={80}
              className="drop-shadow-md"
            />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-primary-800 mb-2">
            Compassionate Care, Trusted Support
          </h2>
          <p className="text-gray-600 text-base leading-relaxed">
            {feature.subtitle ||
              "Discover our reliable, professional home care services designed to bring peace of mind to you and your loved ones."}
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {feature.features.map((item, index) => (
            <div
              key={`feature-${index}`}
              className="bg-white border border-primary-800 rounded-xl text-center p-8 shadow-md hover:shadow-lg hover:scale-[1.015] transition duration-300"
            >
              <div className="w-16 h-16 mx-auto flex items-center justify-center bg-primary-100 rounded-full mb-5">
                {iconMap[item.icon] || <MdAccessTime size={30} />}
              </div>
              <h3 className="text-lg font-semibold text-primary-800">
                {item.name}
              </h3>
              <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                {item.content}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        {feature.button?.enable && (
          <div className="mt-12 text-center">
            <a
              href={feature.button.link}
              rel={feature.button.rel}
              className="inline-block bg-primary-800 text-white font-medium py-2.5 px-7 rounded-full hover:bg-opacity-90 transition"
            >
              {feature.button.label}
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeFeatures;
