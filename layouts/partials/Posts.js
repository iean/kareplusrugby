import config from "@config/config.json";
import { plainify } from "@lib/utils/textConverter";
import Image from "next/image";
import Link from "next/link";

const Posts = ({ posts }) => {
  const { blog_folder, summary_length } = config.settings;

  // The template shipped five sample posts, so this never had to cope with an
  // empty list - it read posts[0].frontmatter unguarded and would throw. Those
  // posts have been removed, so the empty case is now the normal one.
  if (!posts || posts.length === 0) {
    return (
      <div className="col-12 py-12 text-center">
        <p className="mx-auto max-w-xl text-lg leading-relaxed text-textMuted">
          We haven&apos;t published anything here yet. In the meantime, our{" "}
          <Link href="/faq" className="font-semibold text-primary-700 underline underline-offset-4">
            frequently asked questions
          </Link>{" "}
          cover most of what people ask us, or you can{" "}
          <Link href="/contact" className="font-semibold text-primary-700 underline underline-offset-4">
            get in touch
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="section row pb-0">
      <div className="col-12 pb-12 lg:pb-24">
        <div className="row items-center">
          <div className="col-12 md:col-6">
            {posts[0].frontmatter.image && (
              <Image
                className="h-auto w-full rounded-lg"
                src={posts[0].frontmatter.image}
                alt={posts[0].frontmatter.title}
                width={540}
                height={227}
                priority={true}
              />
            )}
          </div>
          <div className="col-12 md:col-6">
            <h2 className="h3 mb-2 mt-4">
              <Link
                href={`/${blog_folder}/${posts[0].slug}`}
                className="block hover:text-primary"
              >
                {posts[0].frontmatter.title}
              </Link>
            </h2>
            <p className="text-brandText">
              {plainify(
                posts[0].content?.slice(0, Number(summary_length)),
                "div",
              )}
            </p>
            <Link
              className="btn btn-primary mt-4"
              href={`/${blog_folder}/${posts[0].slug}`}
              rel=""
            >
              Read More
            </Link>
          </div>
        </div>
      </div>
      {posts.slice(1).map((post, i) => (
        <div key={`key-${i}`} className="col-12 mb-8 sm:col-6 lg:col-4">
          {post.frontmatter.image && (
            <Image
              className="rounded-lg"
              src={post.frontmatter.image}
              alt={post.frontmatter.title}
              width={i === 0 ? "925" : "445"}
              height={i === 0 ? "475" : "230"}
            />
          )}
          <h2 className="h3 mb-2 mt-4">
            <Link
              href={`/${blog_folder}/${post.slug}`}
              className="block hover:text-primary"
            >
              {post.frontmatter.title}
            </Link>
          </h2>
          <p className="text-brandText">{post.frontmatter.desc}</p>
          <Link
            className="btn btn-primary mt-4"
            href={`/${blog_folder}/${post.slug}`}
            rel=""
          >
            Read More
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Posts;
