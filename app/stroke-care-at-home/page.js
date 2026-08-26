import CareTypePage from "@layouts/services/CareTypePage";
import { getCareType } from "@lib/careTypes";
import { og } from "@lib/seo";

const careType = getCareType("stroke-care-at-home");

export const metadata = {
  title: careType.title,
  description: careType.metaDescription,
  alternates: { canonical: "/stroke-care-at-home" },
  openGraph: og({ url: "/stroke-care-at-home", title: careType.title, description: careType.metaDescription }),
};

const Page = () => <CareTypePage careType={careType} />;
export default Page;
