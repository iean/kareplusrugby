import Hero from "@layouts/staffing/CareServices/Hero";
import ServiceCards from "@layouts/staffing/CareServices/ServiceCards";
import ServiceProcess from "@layouts/staffing/CareServices/ServiceProcess";
import WhyChooseUs from "@layouts/staffing/CareServices/WhyChooseUs";
import ContactBanner from "@layouts/staffing/CareServices/ContactBanner";

export const metadata = {
  title: "Our Staffing Services",
  description:
    "Planned rotas and short-notice cover for care homes — registered nurses, senior carers and care assistants from Kare Plus Rugby.",
  alternates: { canonical: "/staffing/care-services" },
};


const CareServices = () => (
  <>
    <Hero />
    <ServiceCards />
    <ServiceProcess />
    <WhyChooseUs />
    <ContactBanner />
  </>
);

export default CareServices;
