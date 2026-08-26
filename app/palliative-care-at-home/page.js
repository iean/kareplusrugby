import CareTypePage from "@layouts/services/CareTypePage";
import { getCareType } from "@lib/careTypes";
import { og } from "@lib/seo";

const careType = getCareType("palliative-care-at-home");

export const metadata = {
  title: careType.title,
  description: careType.metaDescription,
  alternates: { canonical: "/palliative-care-at-home" },
  openGraph: og({ url: "/palliative-care-at-home", title: careType.title, description: careType.metaDescription }),
};

const Page = () => <CareTypePage careType={careType} />;
export default Page;
