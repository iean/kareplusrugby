import { Container } from "@components/ui/Section";
import { MapPin, Clock, CalendarDays, Banknote } from "lucide-react";

/**
 * Current vacancies, from content/vacancies/*.md (see lib/vacancies.js).
 *
 * The empty state is the important part. When there is nothing to advertise
 * this says so and invites a speculative application, rather than showing a
 * sample role. In care recruitment a speculative application is worth more
 * than a stale advert anyway, and an invented vacancy would waste the time of
 * whoever applied for it.
 */
const Meta = ({ icon: Icon, children }) =>
  children ? (
    <li className="flex items-center gap-2 text-base text-textMuted">
      <Icon aria-hidden="true" className="h-[18px] w-[18px] shrink-0 text-primary-600" />
      <span>{children}</span>
    </li>
  ) : null;

const VacancyList = ({ vacancies }) => {
  if (!vacancies || vacancies.length === 0) {
    return (
      <Container width="narrow" className="px-0">
        <div className="rounded-card border border-border bg-white p-7 text-center shadow-card">
          <h3 className="text-lg font-bold text-primary-950">
            No roles are advertised right now
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-textMuted">
            That does not mean we are not recruiting. We take on carers and
            nurses continuously, and shifts come up at short notice. Send us an
            application and we will tell you honestly what we have coming up in
            your area.
          </p>
          <a
            href="#apply"
            className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-btn bg-primary-700 px-7 py-3.5 font-semibold text-white transition hover:bg-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
          >
            Send a speculative application
          </a>
        </div>
      </Container>
    );
  }

  return (
    <ul className="grid gap-6 md:grid-cols-2">
      {vacancies.map((v) => (
        <li key={v.slug}>
          <article className="flex h-full flex-col rounded-card border border-border bg-white p-6 shadow-card">
            <h3 className="text-xl font-bold text-primary-950">{v.title}</h3>

            <ul className="mt-4 space-y-2">
              <Meta icon={MapPin}>{v.location}</Meta>
              <Meta icon={Clock}>
                {[v.type, v.hours].filter(Boolean).join(" · ")}
              </Meta>
              {/* Only rendered when a real figure was supplied. */}
              <Meta icon={Banknote}>{v.pay}</Meta>
              <Meta icon={CalendarDays}>
                {v.closing
                  ? `Closes ${new Date(v.closing).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}`
                  : ""}
              </Meta>
            </ul>

            {v.summary && (
              <p className="mt-4 flex-grow text-base leading-relaxed text-textMuted">
                {v.summary}
              </p>
            )}

            {!v.pay && (
              <p className="mt-4 text-base leading-relaxed text-textMuted">
                Pay for this role is discussed on application, along with
                holiday, pension and mileage.
              </p>
            )}

            <a
              href="#apply"
              className="mt-6 inline-flex min-h-[44px] items-center justify-center self-start rounded-btn bg-primary-700 px-6 py-3 font-semibold text-white transition hover:bg-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
            >
              Apply for this role
              <span className="sr-only">: {v.title}</span>
            </a>
          </article>
        </li>
      ))}
    </ul>
  );
};

export default VacancyList;
