import Contact from "@layouts/Contact";
import { getRegularPage } from "@lib/contentParser";

const ContactUsPage = async () => {
  const data = await getRegularPage("contact");
  return (
    <>
      {/* Hero Section with Background Image and Gradient */}
      <section
        className="h-[70vh] bg-gradient-to-br from-primary-950 via-primary-900 to-primary-700 flex items-center relative"
        style={{
          backgroundImage: `url('/images/services/respite-care.jpeg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
        }}
      >
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-700"></div>

        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-white text-center mb-8">
            We are here to help
          </p>

          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Get in Touch with Our Care Team
            </h2>
            <p className="text-lg text-white opacity-90 leading-relaxed">
              Ready to discuss your care needs? Our compassionate team is here
              to provide personalized support and answer all your questions
              about our domiciliary care services.
            </p>
          </div>
        </div>
      </section>

      <Contact data={data} requestType="domiciliary" />
    </>
  );
};

export default ContactUsPage;
