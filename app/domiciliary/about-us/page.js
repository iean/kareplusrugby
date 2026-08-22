import AboutBanner from "@layouts/domiciliary/About/Banner";
import MissionValues from "@layouts/domiciliary/About/MissionValues";
import TeamShowcase from "@layouts/domiciliary/About/TeamShowcase";

export const metadata = {
  title: "About Our Home Care Team",
  description:
    "Who we are and how we work at Kare Plus Rugby, and why privacy and dignity sit at the centre of the home care we provide in Rugby.",
  alternates: { canonical: "/domiciliary/about-us" },
};


const AboutUs = () => (
  <>
    <AboutBanner />
    <MissionValues />
    <TeamShowcase />
  </>
);

export default AboutUs;
