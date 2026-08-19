const helps = [
  {
    title: "Experienced Professionals",
    description: "Our carers are trained and vetted, giving you peace of mind.",
    icon: "user",
  },
  {
    title: "Tailored Services",
    description: "Flexible options ensure the right level of care for every situation.",
    icon: "cog",
  },
  {
    title: "24/7 Availability",
    description: "Support whenever you need it, day or night.",
    icon: "clock",
  },
];

import { MdPerson, MdBuild, MdAccessTime } from "react-icons/md";

const iconMap = {
  user: <MdPerson size={30} className="text-brand" />,
  cog: <MdBuild size={30} className="text-brand" />,
  clock: <MdAccessTime size={30} className="text-brand" />,
};

const HelpCards = () => {
  return (
    <section className="py-16">
      <div className="container px-4 mx-auto">
        <h2 className="text-3xl font-bold text-center text-primary-800 mb-12">How We Help</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {helps.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-primary-100 rounded-xl text-center p-8 shadow-md hover:shadow-lg hover:scale-[1.015] transition duration-300"
            >
              <div className="w-16 h-16 mx-auto flex items-center justify-center bg-primary-100 rounded-full mb-5">
                {iconMap[item.icon]}
              </div>
              <h3 className="text-lg font-semibold text-primary-800">{item.title}</h3>
              <p className="mt-3 text-gray-600 text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HelpCards;
