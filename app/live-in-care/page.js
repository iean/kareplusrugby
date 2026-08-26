import CareTypePage from "@layouts/services/CareTypePage";
import { getCareType } from "@lib/careTypes";
import { og } from "@lib/seo";

const careType = getCareType("live-in-care");

export const metadata = {
  title: careType.title,
  description: careType.metaDescription,
  alternates: { canonical: "/live-in-care" },
  openGraph: og({ url: "/live-in-care", title: careType.title, description: careType.metaDescription }),
};

const Page = () => <CareTypePage careType={careType} />;
export default Page;
