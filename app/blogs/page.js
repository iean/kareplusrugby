import BlogPagination, { generateStaticParams } from "./page/[slug]/page";

/**
 * The blog index reuses the pagination page's component. It needs its own
 * metadata though: without this it inherited the root layout's defaults, so
 * /blogs shared the generic site title and description with 22 other pages.
 */
export const metadata = {
  title: "News & Advice",
  description:
    "News, updates and practical advice on home care, supported living and care home staffing from Kare Plus Rugby in Rugby, Warwickshire.",
  alternates: { canonical: "/blogs" },
};

export { generateStaticParams };
export default BlogPagination;
