/**
 * The page itself is a client component ("use client"), and a client component
 * cannot export `metadata`. This layout carries it, so the page gets a real
 * title, description and canonical instead of inheriting the site defaults.
 */
export const metadata = {
  title: "Request Your Personal Data",
  description:
    "Exercise your rights under UK GDPR. Ask Kare Plus Rugby for a copy of the personal data we hold about you, or ask us to correct or erase it.",
  alternates: { canonical: "/request-personal-data" },
  // Disallowed in robots.txt as well - this is a form to be reached from the
  // privacy policy, not a search landing page.
  robots: { index: false, follow: true },
};

export default function RequestPersonalDataLayout({ children }) {
  return children;
}
