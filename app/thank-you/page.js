
export const metadata = {
  title: "Thank You",
  description:
    "Thank you — your message has been sent to Kare Plus Rugby.",
  alternates: { canonical: "/thank-you" },
  // Not useful in search results, and kept out of the sitemap too.
  robots: { index: false, follow: true },
};

const ThankYou = () => (
  <section className="section text-center">
    <div className="container">
      <h1 className="text-3xl font-bold mb-4">Thank you!</h1>
      <p>We have received your message and will get back to you soon.</p>
    </div>
  </section>
);

export default ThankYou;
