import StaffingBanner from "@layouts/staffing/Banner";
import StaffingOptions from "@layouts/staffing/Options";
import ServiceScopes from "@layouts/staffing/Scopes";
import ServiceDescription from "@layouts/staffing/Description";
import WhatWeProvide from "@layouts/staffing/WhatWeProvide";

export const metadata = {
  title: "Temporary Care Home Staffing",
  description:
    "Kare Plus Rugby supplies nurses, senior carers and care assistants to care homes across Rugby, Coventry, Leicestershire and Northamptonshire.",
  alternates: { canonical: "/staffing" },
};


const StaffingPage = () => {
  return (
    <>
      <StaffingBanner />
      <StaffingOptions />
      {/* <ServiceScopes /> */}
      <WhatWeProvide />
      <ServiceDescription />
    </>
  );
};

export default StaffingPage;
