import { notFound } from "next/navigation";
import NotFound from "@layouts/404";
import Contact from "@layouts/Contact";
import Default from "@layouts/Default";
import Faq from "@layouts/Faq";
import Pricing from "@layouts/Pricing";
import SeoMeta from "@layouts/SeoMeta";
import { getRegularPage, getSinglePage } from "@lib/contentParser";

// for all regular pages
const RegularPages = async ({ params }) => {
  const { regular } = params;

  // Return a real 404 for unknown slugs. getRegularPage() silently falls back
  // to rendering content/404.md, which meant every mistyped URL returned HTTP
  // 200 with 404 content - a soft 404. Search engines index those, and
  // monitoring never sees the error.
  const known = await getSinglePage("content");
  if (!known.some((p) => p.slug === regular)) notFound();

  const regularPageData = await getRegularPage(regular);
  const { title, meta_title, description, image, noindex, canonical, layout } =
    regularPageData.frontmatter;
  const { content } = regularPageData;

  return (
    <>
      <SeoMeta
        title={title}
        description={description ? description : content.slice(0, 120)}
        meta_title={meta_title}
        image={image}
        noindex={noindex}
        canonical={canonical}
      />
      {layout === "404" ? (
        <NotFound data={regularPageData} />
      ) : layout === "contact" ? (
        <Contact data={regularPageData} />
      ) : layout === "pricing" ? (
        <Pricing data={regularPageData} />
      ) : layout === "faq" ? (
        <Faq data={regularPageData} />
      ) : (
        <Default data={regularPageData} />
      )}
    </>
  );
};
export default RegularPages;

/**
 * Slugs that have a real page under app/ and must NOT be generated here.
 *
 * This catch-all was silently winning over the dedicated routes: /contact and
 * /faq both rendered the old Lorem-ipsum markdown instead of the new pages,
 * because content/contact.md and content/faq.md produced matching static
 * params. Anything added as a real route must be listed here too.
 */
const RESERVED = new Set(["contact", "faq", "404", "_index", "index"]);

// for regular page routes
export const generateStaticParams = async () => {
  const allslugs = await getSinglePage("content");
  const paths = allslugs
    .map((item) => item.slug)
    .filter((slug) => !RESERVED.has(slug))
    .map((slug) => ({ regular: slug }));

  return paths;
};

// Only slugs returned by generateStaticParams are valid routes; anything
// else 404s instead of being rendered on demand.
export const dynamicParams = false;
