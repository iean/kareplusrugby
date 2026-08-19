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
                    held by Kare Plus Rugby Healthcare.
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

                  <div className="bg-blue-50 p-6 rounded-lg mt-8">
                    <h4 className="font-semibold text-blue-800 mb-3">
                      Important Information
                    </h4>
                    <ul className="text-sm text-blue-700 space-y-2">
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

                  <div className="bg-yellow-50 p-6 rounded-lg mt-6">
                    <h4 className="font-semibold text-yellow-800 mb-3">
                      Healthcare Records
                    </h4>
                    <p className="text-sm text-yellow-700">
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

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  {/* Request Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type of Request *
                    </label>
                    <select
                      name="requestType"
                      value={formData.requestType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Information
                    </label>
                    <textarea
                      name="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Please provide any additional details about your request..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  {/* Identification */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Proof of Identity
                    </label>
                    <textarea
                      name="identification"
                      value={formData.identification}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Please describe how you can prove your identity (e.g., passport number, driving licence, etc.)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  {/* Consent */}
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      name="consent"
                      checked={formData.consent}
                      onChange={handleChange}
                      required
                      className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label className="text-sm text-gray-600">
                      I confirm that I am the data subject or have legal
                      authority to make this request on their behalf. I
                      understand that Kare Plus Rugby Healthcare may need to
                      verify my identity before processing this request. *
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
                  <p className="text-sm text-gray-600">
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
