import BrandLogo from "@components/BrandLogo";
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
    <section className="py-16 bg-[#F9F7FB] bg-gradient-to-r from-[#f9f5ff] via-[#fdf6eb] to-[#fff9ec]">
      <div className="container mx-auto px-4">
        {/* Logo & Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="flex justify-center mb-4">
            <BrandLogo
              linked={false}
              className="rounded-[2rem] border border-[#2f2f85]/10 bg-white px-6 py-5 shadow-sm"
              imageClassName="h-auto w-[220px] sm:w-[280px]"
            />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-[#2f2f85] mb-2">
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
              className="bg-white border border-[#2f2f85] rounded-xl text-center p-8 shadow-md hover:shadow-lg hover:scale-[1.015] transition duration-300"
            >
              <div className="w-16 h-16 mx-auto flex items-center justify-center bg-[#e8eafd] rounded-full mb-5">
                {iconMap[item.icon] || <MdAccessTime size={30} />}
              </div>
              <h3 className="text-lg font-semibold text-[#2f2f85]">
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
              className="inline-block bg-[#2f2f85] text-white font-medium py-2.5 px-7 rounded-full hover:bg-opacity-90 transition"
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
