import PageHero from "@layouts/partials/PageHero";

const TermsAndConditionsPage = () => {
  return (
    <>
      <PageHero
        title="Terms and Conditions"
        subtitle="Our service agreement and policies"
        image="/images/Staffing Page/Service Standard.jpg"
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
                  These Terms and Conditions (&quot;Terms&quot;) govern your use
                  of Kare Plus Rugby Healthcare&apos;s services, website, and
                  any related services. By using our services, you agree to be
                  bound by these Terms.
                </p>
                <p className="mb-6">
                  Kare Plus Rugby Healthcare is a registered domiciliary care
                  provider regulated by the Care Quality Commission (CQC) and
                  operates in accordance with UK healthcare regulations.
                </p>

                <h2 className="text-2xl font-bold text-primary mb-6">
                  2. Definitions
                </h2>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>
                    <strong>&quot;Service&quot;</strong> means our domiciliary
                    care services
                  </li>
                  <li>
                    <strong>&quot;Client&quot;</strong> means the person
                    receiving care services
                  </li>
                  <li>
                    <strong>&quot;Carer&quot;</strong> means our qualified care
                    staff
                  </li>
                  <li>
                    <strong>&quot;Website&quot;</strong> means our online
                    platform and services
                  </li>
                  <li>
                    <strong>&quot;We/Us/Our&quot;</strong> means Kare Plus Rugby Healthcare
                  </li>
                </ul>

                <h2 className="text-2xl font-bold text-primary mb-6">
                  3. Service Provision
                </h2>
                <h3 className="text-xl font-semibold text-primary-800 mb-4">
                  3.1 Care Services
                </h3>
                <p className="mb-4">We provide the following services:</p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Personal care and hygiene assistance</li>
                  <li>Medication management and administration</li>
                  <li>Mobility and movement support</li>
                  <li>Domestic tasks and household support</li>
                  <li>Companionship and social interaction</li>
                  <li>Specialist care for specific conditions</li>
                </ul>

                <h3 className="text-xl font-semibold text-primary-800 mb-4">
                  3.2 Service Standards
                </h3>
                <p className="mb-6">
                  We are committed to providing high-quality care services that
                  meet CQC standards and regulatory requirements. All our carers
                  are trained, qualified, and DBS-checked.
                </p>

                <h2 className="text-2xl font-bold text-primary mb-6">
                  4. Client Responsibilities
                </h2>
                <p className="mb-4">As a client, you agree to:</p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>
                    Provide accurate and complete information about your care
                    needs
                  </li>
                  <li>Treat our carers with respect and dignity</li>
                  <li>Maintain a safe environment for care delivery</li>
                  <li>
                    Notify us of any changes in your condition or circumstances
                  </li>
                  <li>Pay for services as agreed in your care plan</li>
                  <li>Give reasonable notice for cancellations</li>
                </ul>

                <h2 className="text-2xl font-bold text-primary mb-6">
                  5. Booking and Cancellation
                </h2>
                <h3 className="text-xl font-semibold text-primary-800 mb-4">
                  5.1 Booking
                </h3>
                <p className="mb-4">Care services can be booked through:</p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Our website contact forms</li>
                  <li>Phone: 01788 422422</li>
                  <li>Email: kp.rugby@kareplus.co.uk</li>
                  <li>Direct contact with our care coordinators</li>
                </ul>

                <h3 className="text-xl font-semibold text-primary-800 mb-4">
                  5.2 Cancellation Policy
                </h3>
                <p className="mb-6">
                  We require 24 hours&apos; notice for cancellations. Late
                  cancellations may incur charges as outlined in your individual
                  care agreement.
                </p>

                <h2 className="text-2xl font-bold text-primary mb-6">
                  6. Payment Terms
                </h2>
                <h3 className="text-xl font-semibold text-primary-800 mb-4">
                  6.1 Fees
                </h3>
                <p className="mb-4">Our fees are:</p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Clearly outlined in your care plan</li>
                  <li>Subject to regular review</li>
                  <li>Inclusive of all basic care services</li>
                  <li>Exclusive of additional services (clearly stated)</li>
                </ul>

                <h3 className="text-xl font-semibold text-primary-800 mb-4">
                  6.2 Payment Methods
                </h3>
                <p className="mb-6">
                  We accept payment by bank transfer, direct debit, or other
                  agreed methods. Invoices are issued monthly and payment is due
                  within 14 days.
                </p>

                <h2 className="text-2xl font-bold text-primary mb-6">
                  7. Health and Safety
                </h2>
                <p className="mb-6">
                  We are committed to maintaining the highest standards of
                  health and safety. Our carers follow strict protocols and are
                  trained in infection control, manual handling, and emergency
                  procedures.
                </p>

                <h2 className="text-2xl font-bold text-primary mb-6">
                  8. Complaints and Feedback
                </h2>
                <p className="mb-4">
                  We welcome feedback and have a formal complaints procedure:
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Informal complaints: Contact your care coordinator</li>
                  <li>
                    Formal complaints: Submit in writing to our complaints
                    officer
                  </li>
                  <li>External complaints: Contact CQC or local authority</li>
                  <li>
                    Response time: We aim to respond within 5 working days
                  </li>
                </ul>

                <h2 className="text-2xl font-bold text-primary mb-6">
                  9. Limitation of Liability
                </h2>
                <p className="mb-6">
                  Our liability is limited to the extent permitted by law. We
                  maintain appropriate insurance coverage for our services and
                  will provide details upon request.
                </p>

                <h2 className="text-2xl font-bold text-primary mb-6">
                  10. Website Use
                </h2>
                <h3 className="text-xl font-semibold text-primary-800 mb-4">
                  10.1 Acceptable Use
                </h3>
                <p className="mb-4">You agree not to:</p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Use our website for unlawful purposes</li>
                  <li>Attempt to gain unauthorised access to our systems</li>
                  <li>Transmit harmful or malicious content</li>
                  <li>Interfere with website functionality</li>
                </ul>

                <h3 className="text-xl font-semibold text-primary-800 mb-4">
                  10.2 Intellectual Property
                </h3>
                <p className="mb-6">
                  All content on our website is owned by Kare Plus Rugby
                  Healthcare and protected by copyright laws.
                </p>

                <h2 className="text-2xl font-bold text-primary mb-6">
                  11. Privacy and Data Protection
                </h2>
                <p className="mb-6">
                  Your privacy is important to us. Please refer to our Privacy
                  Policy for details on how we collect, use, and protect your
                  personal information.
                </p>

                <h2 className="text-2xl font-bold text-primary mb-6">
                  12. Changes to Terms
                </h2>
                <p className="mb-6">
                  We may update these Terms from time to time. Significant
                  changes will be communicated to clients in advance. Continued
                  use of our services constitutes acceptance of updated Terms.
                </p>

                <h2 className="text-2xl font-bold text-primary mb-6">
                  13. Governing Law
                </h2>
                <p className="mb-6">
                  These Terms are governed by English law and subject to the
                  jurisdiction of English courts.
                </p>

                <h2 className="text-2xl font-bold text-primary mb-6">
                  14. Contact Information
                </h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="mb-2">
                    <strong>Kare Plus Rugby Healthcare</strong>
                  </p>
                  <p className="mb-2">Phone: 01788 422422</p>
                  <p className="mb-2">Email: kp.rugby@kareplus.co.uk</p>
                  <p className="mb-2">Address: [Your Business Address]</p>
                  <p className="mb-2">CQC Registration: [Your CQC Number]</p>
                </div>

                <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                  <p className="text-sm text-yellow-800">
                    <strong>Important:</strong> These terms should be read in
                    conjunction with your individual care plan and service
                    agreement. If you have any questions, please contact us for
                    clarification.
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

export default TermsAndConditionsPage;
