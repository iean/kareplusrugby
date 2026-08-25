import Link from "next/link";
import PageHeader from "@components/ui/PageHeader";
import Section, { Container } from "@components/ui/Section";
import site from "@config/site.json";
import { og } from "@lib/seo";
import { FUNDING, SOURCES, CHECKED_ON, REVIEW_BY, TAX_YEAR } from "@lib/funding";
import { Wallet, Home, HandCoins, Stethoscope, HeartHandshake, ExternalLink } from "lucide-react";

export const metadata = {
  title: "Paying for Care at Home — What the Council Pays and What You Pay",
  description:
    "How care at home is paid for in England: the free needs assessment, the savings thresholds, what the council covers, Attendance Allowance and NHS Continuing Healthcare. Plain English, with the current figures.",
  alternates: { canonical: "/paying-for-care" },
  openGraph: og({ url: "/paying-for-care", title: "Paying for care at home" }),
};

const STEPS = [
  {
    icon: Home,
    title: "1. Ask the council for a needs assessment",
    body: "Anyone can ask, and it is free. It does not matter how much money you have — the assessment is about what help you need, not what you can pay. The council has to do one if it looks like you might need care. Do this first, even if you are fairly sure you will be paying for yourself.",
  },
  {
    icon: Wallet,
    title: "2. If you might need help paying, they do a financial assessment",
    body: "A separate means test, looking at your income and your savings. It is only about the person needing care — a spouse or partner is not assessed, and their savings are not counted.",
  },
  {
    icon: HandCoins,
    title: "3. The council tells you what it will contribute",
    body: "Then you choose a provider. If the council is funding you, you can usually ask for a direct payment and arrange the care yourself, which is how a lot of people end up choosing who actually comes to their door.",
  },
];

const PayingForCare = () => (
  <>
    <PageHeader
      eyebrow="Money"
      title="Paying for care at home"
      intro="Most people we speak to have no idea what they are entitled to. This page explains how it works in England, in plain English, with the current figures — whether or not you ever use us."
      breadcrumbs={[{ label: "Paying for care" }]}
      primary={{ label: `Call ${site.business.phone}`, href: site.business.phone_href }}
      secondary={{ label: "Ask us a question", href: "/contact" }}
    />

    <Section tone="white" size="lg">
      <Container width="narrow">
        <div className="rounded-card border border-primary-200 bg-primary-50 p-6">
          <h2 className="text-lg font-bold text-primary-950">The short version</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-relaxed text-text">
            <li>
              A care needs assessment from the council is <strong>free for everyone</strong>,
              whatever your savings.
            </li>
            <li>
              If you have <strong>more than {FUNDING.upperCapitalLimit}</strong> in savings
              and capital, you will normally pay for your own care.
            </li>
            <li>
              <strong>The value of your home is not counted</strong> when you are getting
              care in it. That surprises most people.
            </li>
            <li>
              <strong>Attendance Allowance is not means-tested.</strong> Savings and income
              make no difference. It is the most missed money in this whole list.
            </li>
          </ul>
        </div>

        <h2 className="mt-10 text-2xl font-bold text-primary-950">How it actually works</h2>
        <div className="mt-6 space-y-6">
          {STEPS.map((s) => (
            <div key={s.title} className="flex items-start gap-4">
              <s.icon aria-hidden="true" className="mt-1 h-6 w-6 shrink-0 text-primary-600" />
              <div>
                <h3 className="text-lg font-bold text-primary-950">{s.title}</h3>
                <p className="mt-1.5 text-base leading-relaxed text-textMuted">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>

    {/* The means test, as a table, because the thresholds are what people came for. */}
    <Section tone="surface" size="lg">
      <Container width="narrow">
        <h2 className="text-2xl font-bold text-primary-950">
          The savings thresholds ({TAX_YEAR})
        </h2>
        <p className="mt-3 text-base leading-relaxed text-textMuted">
          These are national figures set by government, not by us. They apply in England.
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-left text-base">
            <caption className="sr-only">
              Savings thresholds and what you pay towards care at home in {TAX_YEAR}
            </caption>
            <thead>
              <tr className="border-b border-borderStrong">
                <th scope="col" className="py-3 pr-4 font-semibold text-primary-950">
                  Savings and capital
                </th>
                <th scope="col" className="py-3 font-semibold text-primary-950">
                  What it means
                </th>
              </tr>
            </thead>
            <tbody className="text-textMuted">
              <tr className="border-b border-border">
                <th scope="row" className="py-4 pr-4 font-semibold text-text">
                  Over {FUNDING.upperCapitalLimit}
                </th>
                <td className="py-4">
                  You pay the full cost of your care. You are still entitled to the free
                  needs assessment, and you can still claim Attendance Allowance.
                </td>
              </tr>
              <tr className="border-b border-border">
                <th scope="row" className="py-4 pr-4 font-semibold text-text">
                  {FUNDING.lowerCapitalLimit} – {FUNDING.upperCapitalLimit}
                </th>
                <td className="py-4">
                  The council contributes, and you pay a share. They add{" "}
                  {FUNDING.tariffIncome} of savings in this band to your assessed income —
                  this is called tariff income.
                </td>
              </tr>
              <tr>
                <th scope="row" className="py-4 pr-4 font-semibold text-text">
                  Under {FUNDING.lowerCapitalLimit}
                </th>
                <td className="py-4">
                  Your savings are not counted at all. You may still contribute from your
                  income, but never below the minimum income below.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-8 rounded-card border border-border bg-white p-6">
          <h3 className="text-lg font-bold text-primary-950">
            You cannot be charged down to nothing
          </h3>
          <p className="mt-2 text-base leading-relaxed text-textMuted">
            After paying for care at home, the council must leave you with a Minimum Income
            Guarantee of at least{" "}
            <strong className="text-text">{FUNDING.migPensionAge} a week</strong> if you are
            over Pension Credit age, or{" "}
            <strong className="text-text">{FUNDING.migUnderPensionAge} a week</strong> if you
            are under it and 25 or over. This is a legal floor.
          </p>
          <p className="mt-3 text-base leading-relaxed text-textMuted">
            This is different from the care home figure you may have read about. Care at home
            and moving into a care home are assessed under different rules — including on your
            property, which is counted for a care home and not for care at home.
          </p>
        </div>
      </Container>
    </Section>

    {/* Money people miss. */}
    <Section tone="white" size="lg">
      <Container width="narrow">
        <h2 className="text-2xl font-bold text-primary-950">Money people miss</h2>

        <div className="mt-6 space-y-5">
          <div className="rounded-card border border-border bg-surface p-6">
            <div className="flex items-start gap-3">
              <HandCoins aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              <div>
                <h3 className="text-lg font-bold text-primary-950">
                  Attendance Allowance — not means-tested
                </h3>
                <p className="mt-2 text-base leading-relaxed text-textMuted">
                  If you are over State Pension age and need help with personal care or
                  supervision, you can claim{" "}
                  <strong className="text-text">{FUNDING.attendanceLower} a week</strong> (help
                  during the day or supervision at night) or{" "}
                  <strong className="text-text">{FUNDING.attendanceHigher} a week</strong> (help
                  day and night, or if you are nearing the end of life).
                </p>
                <p className="mt-2 text-base leading-relaxed text-textMuted">
                  Your savings and income make no difference at all, and it is not taxed. You
                  do not need a diagnosis, and you do not need someone to already be caring for
                  you — the test is what help you need. Plenty of people who pay for their own
                  care are entitled to this and never claim it.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-card border border-border bg-surface p-6">
            <div className="flex items-start gap-3">
              <Stethoscope aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
              <div>
                <h3 className="text-lg font-bold text-primary-950">NHS Continuing Healthcare</h3>
                <p className="mt-2 text-base leading-relaxed text-textMuted">
                  If someone&apos;s need for care is primarily a <em>health</em> need rather
                  than a social one, the NHS may fund all of it — including care at home, with
                  no means test at all. It is assessed, not automatic, and it is refused far
                  more often than it is granted. If the health needs are significant or
                  changing, it is worth asking your GP or hospital discharge team to consider a
                  checklist assessment.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-card border border-border bg-surface p-6">
            <div className="flex items-start gap-3">
              <HeartHandshake aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
              <div>
                <h3 className="text-lg font-bold text-primary-950">
                  If you look after someone yourself
                </h3>
                <p className="mt-2 text-base leading-relaxed text-textMuted">
                  You have your own right to a <strong>carer&apos;s assessment</strong> from
                  the council, separately from the person you care for. You may also be able to
                  claim Carer&apos;s Allowance. Both are commonly missed by families who have
                  been managing on their own for years.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>

    {/* Honest about our own position. */}
    <Section tone="surface" size="md">
      <Container width="narrow">
        <h2 className="text-2xl font-bold text-primary-950">Where we fit in</h2>
        <p className="mt-3 text-base leading-relaxed text-textMuted">
          We are a care provider, not a funding service. We cannot decide what the council
          gives you and we do not assess you for benefits. What we can do is tell you honestly
          what your care would cost with us, so you have a real number to work with rather than
          a guess.
        </p>
        <p className="mt-3 text-base leading-relaxed text-textMuted">
          We do not publish a price list, because the honest answer depends on how many visits
          you need, how long they are and when they happen. Ring us and we will tell you.
        </p>
        <p className="mt-3 text-base leading-relaxed text-textMuted">
          If the council is funding you and you have a direct payment, you can usually choose
          us as your provider. Ask your social worker — you do not have to take whoever you are
          offered.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={site.business.phone_href}
            className="inline-flex min-h-[44px] items-center justify-center rounded-btn bg-primary-700 px-7 py-3.5 font-semibold text-white transition hover:bg-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
          >
            Call {site.business.phone}
          </a>
          <Link
            href="/contact"
            className="inline-flex min-h-[44px] items-center justify-center rounded-btn border border-borderStrong bg-white px-7 py-3.5 font-semibold text-primary-800 transition hover:bg-primary-50"
          >
            Send us a question
          </Link>
        </div>
      </Container>
    </Section>

    {/* Sources. A money page without them is not trustworthy. */}
    <Section tone="white" size="md">
      <Container width="narrow">
        <h2 className="text-xl font-bold text-primary-950">Where these figures come from</h2>
        <p className="mt-2 text-base leading-relaxed text-textMuted">
          Every figure on this page is from GOV.UK or the NHS, checked on {CHECKED_ON}. They
          are reviewed each April, when the rates usually change. Please check the source if
          you are making a decision that depends on the exact number.
        </p>
        <ul className="mt-4 space-y-2">
          {SOURCES.map((s) => (
            <li key={s.href}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-2 text-base font-medium text-primary-700 underline underline-offset-4 hover:text-primary-800"
              >
                {s.label}
                <ExternalLink aria-hidden="true" className="h-4 w-4" />
                <span className="sr-only">— {s.note} (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm leading-relaxed text-textMuted">
          This page is general information about how care funding works in England, not
          financial advice about your situation. Rates shown are for {TAX_YEAR} and are due for
          review in {REVIEW_BY}. For advice on your own circumstances, speak to your council&apos;s
          adult social care team, or to Age UK or Citizens Advice, all of which are free and
          independent of us.
        </p>
      </Container>
    </Section>
  </>
);

export default PayingForCare;
