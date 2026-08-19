import Link from "next/link";
import { Container } from "@components/ui/Section";
import Button from "@components/ui/Button";

/**
 * Standard inner-page header with breadcrumbs.
 *
 * Breadcrumbs are a real navigation aid on a site with three service lines,
 * and they also feed BreadcrumbList structured data on the pages that emit it.
 */
const PageHeader = ({
  eyebrow,
  title,
  intro,
  breadcrumbs = [],
  primary,
  secondary,
}) => (
  <section className="bg-primary-950 text-white">
    <Container className="py-12 md:py-16">
      {breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-primary-100">
            <li>
              <Link href="/" className="underline-offset-4 hover:underline">
                Home
              </Link>
            </li>
            {breadcrumbs.map((c, i) => (
              <li key={c.url || c.label} className="flex items-center gap-2">
                <span aria-hidden="true" className="text-primary-300">
                  /
                </span>
                {i === breadcrumbs.length - 1 || !c.url ? (
                  <span aria-current="page" className="text-white">
                    {c.label}
                  </span>
                ) : (
                  <Link href={c.url} className="underline-offset-4 hover:underline">
                    {c.label}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      {eyebrow && (
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary-200">
          {eyebrow}
        </p>
      )}

      <h1 className="max-w-4xl text-4xl font-bold leading-[1.15] tracking-tight md:text-5xl">
        {title}
      </h1>

      {intro && (
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/85">
          {intro}
        </p>
      )}

      {(primary || secondary) && (
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {primary && (
            <Button href={primary.href} variant="onDark" size="lg">
              {primary.label}
            </Button>
          )}
          {secondary && (
            <Button href={secondary.href} variant="onDarkOutline" size="lg">
              {secondary.label}
            </Button>
          )}
        </div>
      )}
    </Container>
  </section>
);

export default PageHeader;
