import Hero from "@layouts/home/Hero";
import IntentRouter from "@layouts/home/IntentRouter";
import ServicesOverview from "@layouts/home/ServicesOverview";
import TrustSignals from "@layouts/home/TrustSignals";
import HowItWorks from "@layouts/home/HowItWorks";
import WhatItCosts from "@layouts/home/WhatItCosts";
import AreasWeCover from "@components/ui/AreasWeCover";
import Stats from "@layouts/home/Stats";
import Testimonials from "@layouts/home/Testimonials";
import CtaBand from "@layouts/home/CtaBand";

export const metadata = {
  title: "Home Care & Care Home Staffing in Rugby | Kare Plus Rugby",
  description:
    "Kare Plus Rugby provides domiciliary care at home, supported living, and supplies vetted nurses and care assistants to care homes. Talk to us about care or staffing today.",
  alternates: { canonical: "/" },
  // The homepage is the one page where og:url is genuinely the site root.
  openGraph: { url: "/" },
};

const Home = () => (
  <>
    <Hero />
    <IntentRouter />
    <ServicesOverview />
    <TrustSignals />
    <HowItWorks />
    <WhatItCosts />
    <AreasWeCover />
    <Stats />
    <Testimonials />
    <CtaBand />
  </>
);

export default Home;
