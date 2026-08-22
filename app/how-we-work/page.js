import { getRegularPage } from "@lib/contentParser";
import HowWeWorkBanner from "@layouts/how-we-work/Banner";
import WorkSteps from "@layouts/how-we-work/WorkSteps";
import HelpCards from "@layouts/how-we-work/HelpCards";
import ContactFormSection from "@layouts/how-we-work/ContactFormSection";
import ContactUsBanner from "@layouts/how-we-work/ContactUsBanner";

/**
 * Metadata now comes from Next's own `metadata` export rather than the old
 * SeoMeta component. SeoMeta injected a second <title>, description and og:url
 * alongside the ones the root layout already emits, and browsers and crawlers
 * take the first of a duplicated pair — so this page was showing the generic
 * site title, not its own.
 */
export const metadata = {
  title: "How We Work",
  description:
    "How arranging care with Kare Plus Rugby works, from your first call through assessment and care planning to your regular visits in Rugby and Warwickshire.",
  alternates: { canonical: "/how-we-work" },
};

const HowWeWorkPage = async () => {
  const contactPage = await getRegularPage("contact");

  return (
    <>
      <HowWeWorkBanner />
      <WorkSteps />
      <HelpCards />
      <ContactFormSection data={contactPage} />
      <ContactUsBanner />
    </>
  );
};

export default HowWeWorkPage;
