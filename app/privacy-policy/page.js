import PageHero from "@layouts/partials/PageHero";

const PrivacyPolicyPage = () => {
  return (
    <>
      <PageHero
        title="Privacy Policy"
        subtitle="How we protect your personal information"
        image="/images/Staffing Page/Professional & Reliable.jpg"
        small
      />

      <section className="section">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="content prose prose-lg max-w-none">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="mb-8">
                  <p className="text-sm text-gray-600 mb-4">
                    <strong>Last updated:</strong>{" "}
                    {new Date().toLocaleDateString("en-GB")}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Version:</strong> 1.0
                  </p>
                </div>

                <h2 className="text-2xl font-bold text-primary mb-6">
                  1. Introduction
                </h2>
                <p className="mb-6">
                  Kare Plus Rugby Healthcare (&quot;we&quot;, &quot;our&quot;, or
                  &quot;us&quot;) is committed to protecting and respecting your
                  privacy. This Privacy Policy explains how we collect, use,
                  store, and protect your personal information when you visit
                  our website, use our services, or interact with us in any way.
                </p>
                <p className="mb-6">
                  We are registered as a data controller with the Information
                  Commissioner&apos;s Office (ICO) and comply with the UK
                  General Data Protection Regulation (UK GDPR) and the Data
                  Protection Act 2018.
                </p>

                <h2 className="text-2xl font-bold text-primary mb-6">
                  2. Information We Collect
                </h2>
                <h3 className="text-xl font-semibold text-primary-800 mb-4">
                  2.1 Personal Information
                </h3>
                <p className="mb-4">
                  We may collect the following personal information:
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>
                    Name and contact details (email, phone number, address)
                  </li>
                  <li>Information about care needs and requirements</li>
                  <li>
                    Health and medical information (with your explicit consent)
                  </li>
                  <li>Emergency contact information</li>
                  <li>Payment and billing information</li>
                  <li>Communication preferences</li>
                </ul>

                <h3 className="text-xl font-semibold text-primary-800 mb-4">
                  2.2 Technical Information
                </h3>
                <p className="mb-4">We automatically collect:</p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>IP address and browser type</li>
                  <li>Pages visited and time spent on our website</li>
                  <li>Device information and operating system</li>
                  <li>Cookies and similar technologies</li>
                </ul>

                <h2 className="text-2xl font-bold text-primary mb-6">
                  3. How We Use Your Information
                </h2>
                <p className="mb-4">
                  We use your personal information for the following purposes:
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>To provide and manage our domiciliary care services</li>
                  <li>To communicate with you about your care needs</li>
                  <li>To process payments and manage billing</li>
                  <li>To comply with legal and regulatory obligations</li>
                  <li>To improve our services and website</li>
                  <li>
                    To send you relevant information about our services (with
                    your consent)
                  </li>
                </ul>

                <h2 className="text-2xl font-bold text-primary mb-6">
                  4. Legal Basis for Processing
                </h2>
                <p className="mb-4">
                  We process your personal information based on:
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>
                    <strong>Contract:</strong> To provide our care services
                  </li>
                  <li>
                    <strong>Legitimate Interest:</strong> To improve our
                    services and communicate with you
                  </li>
                  <li>
                    <strong>Consent:</strong> For marketing communications and
                    sensitive health data
                  </li>
                  <li>
                    <strong>Legal Obligation:</strong> To comply with healthcare
                    regulations
                  </li>
                </ul>

                <h2 className="text-2xl font-bold text-primary mb-6">
                  5. Information Sharing
                </h2>
                <p className="mb-4">We may share your information with:</p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>
                    Our care staff and healthcare professionals (on a
                    need-to-know basis)
                  </li>
                  <li>
                    Regulatory bodies (CQC, local authorities) as required by
                    law
                  </li>
                  <li>Service providers who assist in our operations</li>
                  <li>Emergency services in case of emergency</li>
                </ul>
                <p className="mb-6">
                  We will never sell your personal information to third parties
                  for marketing purposes.
                </p>

                <h2 className="text-2xl font-bold text-primary mb-6">
                  6. Data Security
                </h2>
                <p className="mb-6">
                  We implement appropriate technical and organisational measures
                  to protect your personal information against unauthorised
                  access, alteration, disclosure, or destruction. This includes
                  encryption, secure servers, and regular security assessments.
                </p>

                <h2 className="text-2xl font-bold text-primary mb-6">
                  7. Data Retention
                </h2>
                <p className="mb-4">We retain your personal information for:</p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>
                    Care records: 8 years after the end of care (NHS guidelines)
                  </li>
                  <li>Financial records: 7 years (HMRC requirements)</li>
                  <li>Marketing data: Until you withdraw consent</li>
                  <li>Website analytics: 26 months</li>
                </ul>

                <h2 className="text-2xl font-bold text-primary mb-6">
                  8. Your Rights
                </h2>
                <p className="mb-4">Under UK GDPR, you have the right to:</p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of your information</li>
                  <li>Restrict processing of your information</li>
                  <li>Data portability</li>
                  <li>Object to processing</li>
                  <li>Withdraw consent</li>
                </ul>

                <h2 className="text-2xl font-bold text-primary mb-6">
                  9. Cookies
                </h2>
                <p className="mb-6">
                  Our website uses cookies to improve your experience. You can
                  control cookie settings through your browser preferences. For
                  more information, please see our Cookie Policy.
                </p>

                <h2 className="text-2xl font-bold text-primary mb-6">
                  10. Contact Us
                </h2>
                <p className="mb-4">
                  If you have any questions about this Privacy Policy, please
                  contact us:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="mb-2">
                    <strong>Data Protection Officer</strong>
                  </p>
                  <p className="mb-2">Kare Plus Rugby Healthcare</p>
                  <p className="mb-2">Email: kp.rugby@kareplus.co.uk</p>
                  <p className="mb-2">Phone: 01788 422422</p>
                  <p className="mb-2">Address: [Your Business Address]</p>
                </div>

                <div className="mt-8 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
                  <p className="text-sm text-blue-800">
                    <strong>Supervisory Authority:</strong> You have the right
                    to lodge a complaint with the Information
                    Commissioner&apos;s Office (ICO) at{" "}
                    <a
                      href="https://ico.org.uk"
                      className="text-blue-600 hover:underline"
                    >
                      ico.org.uk
                    </a>
                    if you believe we have not handled your personal information
                    properly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PrivacyPolicyPage;
