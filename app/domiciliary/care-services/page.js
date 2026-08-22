import DomiciliaryBanner from "@layouts/domiciliary/Banner";
import ServiceOptions from "@layouts/domiciliary/Options";
import ServiceScopes from "@layouts/domiciliary/Scopes";
import ServiceDescription from "@layouts/domiciliary/Description";

export const metadata = {
  title: "Home Care Services",
  description:
    "The home care services Kare Plus Rugby provides across Rugby and Warwickshire, from help with personal care to companionship and overnight support.",
  alternates: { canonical: "/domiciliary/care-services" },
};


const CareServices = () => (
  <>
    <DomiciliaryBanner />
    <ServiceOptions />
    <ServiceScopes />
    <ServiceDescription />
  </>
);

export default CareServices;
