import CareTypePage from "@layouts/services/CareTypePage";
import { getCareType } from "@lib/careTypes";
import { og } from "@lib/seo";

const careType = getCareType("respite-care");

export const metadata = {
  title: careType.title,
  description: careType.metaDescription,
  alternates: { canonical: "/respite-care" },
  openGraph: og({ url: "/respite-care", title: careType.title, description: careType.metaDescription }),
};

const Page = () => <CareTypePage careType={careType} />;
export default Page;
