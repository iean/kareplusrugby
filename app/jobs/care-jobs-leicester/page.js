import AreaJobsPage from "@layouts/careers/AreaJobsPage";
import { getArea } from "@lib/areas";

/**
 * Area landing page. A static route, so it takes precedence over the
 * /jobs/[slug] vacancy route and the two cannot collide.
 */
const area = getArea("care-jobs-leicester");

export const metadata = {
  title: area.title,
  description: area.metaDescription,
  alternates: { canonical: "/jobs/care-jobs-leicester" },
  openGraph: { title: area.title, description: area.metaDescription, url: "/jobs/care-jobs-leicester" },
};

const Page = () => <AreaJobsPage area={area} />;
export default Page;
