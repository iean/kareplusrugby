import AboutBanner from "@layouts/domiciliary/About/Banner";
import Ethos from "@layouts/domiciliary/About/Ethos";
import Beliefs from "@layouts/domiciliary/About/Beliefs";
import ChooseUs from "@layouts/domiciliary/About/ChooseUs";
import MissionValues from "@layouts/domiciliary/About/MissionValues";
import TeamShowcase from "@layouts/domiciliary/About/TeamShowcase";

export const metadata = {
  title: "Our Ethos and Beliefs",
  description:
    "The ethos, beliefs and mission behind Kare Plus Rugby's home care, and what to weigh up when choosing a domiciliary care provider in Warwickshire.",
  alternates: { canonical: "/domiciliary/about" },
};


const AboutPage = () => (
  <>
    <AboutBanner />
    <Ethos />
    <Beliefs />
    <ChooseUs />
    <MissionValues />
    {/* <TeamShowcase /> */}
  </>
);

export default AboutPage;
