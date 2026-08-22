"use client";

import { useState } from "react";

const GetStartedForm = () => {
  const [formData, setFormData] = useState({
    whoNeedsCare: "",
    careType: "",
    name: "",
    email: "",
    phone: "",
    needs: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/get-started", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(
          "Thank you! Your request has been submitted successfully. We will contact you soon.",
        );
        // Reset form
        setFormData({
          whoNeedsCare: "",
          careType: "",
          name: "",
          email: "",
          phone: "",
          needs: "",
        });
      } else {
        const errorData = await response.json();
        alert("There was an error submitting your request. Please try again.");
        console.error("Form submission error:", errorData);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      alert("There was an error submitting your request. Please try again.");
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Get Started with Your Care Journey
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Who needs the care */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Who needs the care? *
                </label>
                <select
                  name="whoNeedsCare"
                  value={formData.whoNeedsCare}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">- please select -</option>
                  <option value="Mother">Mother</option>
                  <option value="Father">Father</option>
                  <option value="Grand Mother">Grand Mother</option>
                  <option value="Grand Father">Grand Father</option>
                  <option value="Wife">Wife</option>
                  <option value="Husband">Husband</option>
                  <option value="Daughter">Daughter</option>
                  <option value="Son">Son</option>
                  <option value="Myself">Myself</option>
                  <option value="Relative">Relative</option>
                  <option value="Friend">Friend</option>
                  <option value="Patient">Patient</option>
                  <option value="Client">Client</option>
                </select>
              </div>

              {/* What kind of care */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What kind of care do you require? *
                </label>
                <select
                  name="careType"
                  value={formData.careType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">- please select -</option>
                  <option value="Hourly Visiting Care">
                    Hourly Visiting Care
                  </option>
                  <option value="Respite Care">Respite Care</option>
                  <option value="Nursing Care">Nursing Care</option>
                  <option value="Dementia Care">Dementia Care</option>
                  <option value="Live-in Care">Live-in Care</option>
                  <option value="Daytime Care">Daytime Care</option>
                  <option value="I'm Not Sure">I&apos;m Not Sure</option>
                </select>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name Surname"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Email and Phone */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* What are your needs */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What are your needs?
              </label>
              <textarea
                name="needs"
                value={formData.needs}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Please tell us more about your specific care requirements..."
              />
            </div>

            {/* Privacy Policy */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                required
                className="mt-1 h-5 w-5 text-primary-700 focus:ring-2 focus:ring-primary-600 border-borderStrong rounded"
              />
              <label className="text-sm text-gray-600">
                By using this form you agree with the storage and handling of
                your data by this website as defined in our Privacy Policy. *
              </label>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button type="submit" className="btn btn-primary w-full">
                Submit Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default GetStartedForm;
