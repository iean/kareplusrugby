import config from "@config/config.json";
import PostSingle from "@layouts/PostSingle";
import { getSinglePage } from "@lib/contentParser";
const { blog_folder } = config.settings;

// post single layout
const Article = async ({ params }) => {
  const { single } = params;
  const posts = await getSinglePage(`content/${blog_folder}`);
  const post = posts.filter((p) => p.slug == single);
  const { frontmatter, content } = post[0];

  return <PostSingle frontmatter={frontmatter} content={content} />;
};

/**
 * Per-post metadata, from the post's own front matter. This used to come from
 * SeoMeta inside PostSingle, which emitted a second <title> alongside the root
 * layout's - so every post shared the generic site title and description.
 */
export async function generateMetadata({ params }) {
  const { single } = params;
  const posts = await getSinglePage(`content/${blog_folder}`);
  const post = posts.find((p) => p.slug === single);

  if (!post) return {};

  const { frontmatter, content } = post;
  const description =
    frontmatter.description || `${content.slice(0, 155).trim()}...`;

  return {
    title: frontmatter.title,
    description,
    alternates: { canonical: `/blogs/${single}` },
    openGraph: {
      title: frontmatter.title,
      description,
      type: "article",
      ...(frontmatter.image ? { images: [{ url: frontmatter.image }] } : {}),
    },
  };
}

// get post single slug
export const generateStaticParams = () => {
  const allSlug = getSinglePage(`content/${blog_folder}`);
  const paths = allSlug.map((item) => ({
    single: item.slug,
  }));

  return paths;
};

export default Article;
