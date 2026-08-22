"use client";

import { useState } from "react";
import PageHero from "@layouts/partials/PageHero";

const RequestPersonalDataPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    requestType: "",
    additionalInfo: "",
    identification: "",
    website: "", // honeypot - see the hidden field below
    consent: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/request-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(
          "Your request has been submitted successfully. We will process it within 30 days as required by UK GDPR.",
        );
        setFormData({
          name: "",
          email: "",
          phone: "",
          requestType: "",
          additionalInfo: "",
          identification: "",
          consent: false,
        });
      } else {
        alert("There was an error submitting your request. Please try again.");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      alert("There was an error submitting your request. Please try again.");
    }
  };

  return (
    <>
      <PageHero
        title="Request Personal Data"
        subtitle="Your rights under UK GDPR"
        image="/images/Staffing Page/Quality Personnel Service.jpg"
        small
      />

      <section className="section">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Information Section */}
              <div className="content prose prose-lg">
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-primary mb-6">
                    Your Data Rights
                  </h2>

                  <p className="mb-6">
                    Under the UK General Data Protection Regulation (UK GDPR),
                    you have several rights regarding your personal information
                    held by Kare Plus Rugby.
                  </p>

                  <h3 className="text-xl font-semibold text-primary-800 mb-4">
                    Right of Access
                  </h3>
                  <p className="mb-4">
                    You have the right to request a copy of all personal
                    information we hold about you. This is commonly known as a
                    &quot;Subject Access Request&quot; (SAR).
                  </p>

                  <h3 className="text-xl font-semibold text-primary-800 mb-4">
                    Right to Rectification
                  </h3>
                  <p className="mb-4">
                    You can request that we correct any inaccurate or incomplete
                    personal information.
                  </p>

                  <h3 className="text-xl font-semibold text-primary-800 mb-4">
                    Right to Erasure
                  </h3>
                  <p className="mb-4">
                    You can request that we delete your personal information in
                    certain circumstances.
                  </p>

                  <h3 className="text-xl font-semibold text-primary-800 mb-4">
                    Right to Portability
                  </h3>
                  <p className="mb-4">
                    You can request that we provide your data in a structured,
                    machine-readable format.
                  </p>

                  <div className="bg-primary-50 p-6 rounded-lg mt-8">
                    <h4 className="font-semibold text-primary-900 mb-3">
                      Important Information
                    </h4>
                    <ul className="text-base text-primary-900 space-y-2">
                      <li>• We must respond to your request within 30 days</li>
                      <li>
                        • We may extend this period by up to 2 months for
                        complex requests
                      </li>
                      <li>
                        • We may charge a reasonable fee for excessive or
                        repetitive requests
                      </li>
                      <li>
                        • We may require proof of identity before processing
                        your request
                      </li>
                    </ul>
                  </div>

                  <div className="bg-warningBg p-6 rounded-lg mt-6">
                    <h4 className="font-semibold text-warning mb-3">
                      Healthcare Records
                    </h4>
                    <p className="text-base text-warning">
                      Please note that healthcare records are subject to
                      specific retention periods under NHS guidelines and may
                      not be deleted even if requested.
                    </p>
                  </div>
                </div>
              </div>

              {/* Request Form */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-primary mb-6">
                  Submit Your Request
                </h2>

                <form onSubmit={handleSubmit} className="relative space-y-6">
                  {/* Honeypot. Off-screen, aria-hidden and out of the tab
                      order, so no person ever reaches it; /api/request-data
                      discards any submission that fills it in. */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-[-9999px] h-px w-px overflow-hidden"
                  >
                    <label htmlFor="dsr-website">Leave this field empty</label>
                    <input
                      id="dsr-website"
                      name="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={formData.website}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Name */}
                  <div>
                    <label htmlFor="dsr-name" className="mb-2 block text-base font-semibold text-primary-950">
                      Full name
                      {" "}<span aria-hidden="true" className="text-danger">*</span>
                      <span className="sr-only">(required)</span>
                    </label>
                    <input
                      type="text"
                      id="dsr-name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border border-borderStrong px-4 py-3 text-base text-text focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="dsr-email" className="mb-2 block text-base font-semibold text-primary-950">
                      Email address
                      {" "}<span aria-hidden="true" className="text-danger">*</span>
                      <span className="sr-only">(required)</span>
                    </label>
                    <input
                      type="email"
                      id="dsr-email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border border-borderStrong px-4 py-3 text-base text-text focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="dsr-phone" className="mb-2 block text-base font-semibold text-primary-950">
                      Phone number
                      {" "}
                    </label>
                    <input
                      type="tel"
                      id="dsr-phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full rounded-md border border-borderStrong px-4 py-3 text-base text-text focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600"
                    />
                  </div>

                  {/* Request Type */}
                  <div>
                    <label htmlFor="dsr-requestType" className="mb-2 block text-base font-semibold text-primary-950">
                      Type of request
                      {" "}<span aria-hidden="true" className="text-danger">*</span>
                      <span className="sr-only">(required)</span>
                    </label>
                    <select
                      id="dsr-requestType"
                      name="requestType"
                      value={formData.requestType}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border border-borderStrong px-4 py-3 text-base text-text focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600"
                    >
                      <option value="">Select request type</option>
                      <option value="access">Access to personal data</option>
                      <option value="rectification">
                        Rectification of data
                      </option>
                      <option value="erasure">Erasure of data</option>
                      <option value="portability">Data portability</option>
                      <option value="restriction">
                        Restriction of processing
                      </option>
                      <option value="objection">Objection to processing</option>
                    </select>
                  </div>

                  {/* Additional Information */}
                  <div>
                    <label htmlFor="dsr-additionalInfo" className="mb-2 block text-base font-semibold text-primary-950">
                      Additional information
                      {" "}
                    </label>
                    <textarea
                      id="dsr-additionalInfo"
                      name="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Please provide any additional details about your request..."
                      className="w-full rounded-md border border-borderStrong px-4 py-3 text-base text-text focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600"
                    />
                  </div>

                  {/* Identification */}
                  <div>
                    <label htmlFor="dsr-identification" className="mb-2 block text-base font-semibold text-primary-950">
                      Proof of identity
                      {" "}
                    </label>
                    <textarea
                      id="dsr-identification"
                      name="identification"
                      value={formData.identification}
                      onChange={handleChange}
                      rows="3"
                      placeholder="For example: I can bring photo ID to your office, or send a copy by post."
                      className="w-full rounded-md border border-borderStrong px-4 py-3 text-base text-text focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600"
                    />
                  </div>

                  {/* Consent */}
                  <div className="flex items-start space-x-3">
                    <input
                      id="dsr-consent"
                      type="checkbox"
                      name="consent"
                      checked={formData.consent}
                      onChange={handleChange}
                      required
                      className="mt-1 h-5 w-5 rounded border-borderStrong text-primary-700 focus:ring-2 focus:ring-primary-600"
                    />
                    {/* "Kare Plus Rugby" was not a real entity name.
                        The trading name is Kare Plus Rugby; the registered
                        company is Divergent Healthcare Limited. */}
                    <label htmlFor="dsr-consent" className="text-base leading-relaxed text-text">
                      I confirm that I am the data subject or have legal
                      authority to make this request on their behalf. I
                      understand that Kare Plus Rugby may need to verify my
                      identity before processing this request.{" "}
                      <span aria-hidden="true" className="text-danger">*</span>
                      <span className="sr-only">(required)</span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="text-center">
                    <button type="submit" className="btn btn-primary w-full">
                      Submit Request
                    </button>
                  </div>
                </form>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-base text-gray-600">
                    <strong>Contact:</strong> For urgent requests or questions,
                    please contact our Data Protection Officer at
                    kp.rugby@kareplus.co.uk or call 01788 422422.
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

export default RequestPersonalDataPage;
