import config from "@config/config.json";

import HomeBanner from "@layouts/partials/HomeBanner";
import HomeFeatures from "@layouts/partials/HomeFeatures";
import Services from "@layouts/domiciliary-care-home/Services";
import { getListPage, getRegularPage } from "../../lib/contentParser";
import banner from "@/content/home/banner.json";
import DomiciliaryBanner from "@layouts/domiciliary-care-home/Banner";
import DomiciliaryPerks from "@layouts/domiciliary-care-home/Perks";
import StaffingApart from "@layouts/domiciliary-care-home/StaffingApart";
import Contact from "@layouts/Contact";
import CareInfoBanner from "@layouts/partials/CareInfoBanner";

const Domiciliary = async () => {
  const homePage = await getListPage("content/_index.md");
  const contactPage = await getRegularPage("contact");

  const { frontmatter } = homePage;
  const { feature } = frontmatter;
  const { title } = config.site;

  return (
    <>
      {/* Banner */}
      <HomeBanner banner={banner} />
      {/* services */}
      <Services />
      <StaffingApart />
      <DomiciliaryPerks feature={feature} />

      <Contact data={contactPage} />
      <CareInfoBanner
        title="Financing your care options available to you"
        description="Most people are under the assumption that quality care in their own home is beyond their financial means; however, there are various financing options available..."
        extraText="Benefit from the peace of mind that accompanies the service our excellent and empathetic staff provide."
        imageSrc="/images/home/HOME_Financing.jpg"
        primaryButton={{ text: "FIND OUT MORE", href: "/domiciliary" }}
        secondaryButton={{
          text: "OUR CARERS",
          href: "/domiciliary/our-careers",
        }}
      />
    </>
  );
};

export default Domiciliary;
