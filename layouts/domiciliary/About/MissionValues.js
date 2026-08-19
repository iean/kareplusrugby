"use client";

const MissionValues = () => (
  <section className="py-16 bg-theme-light">
    <div className="container grid md:grid-cols-2 gap-10 items-center">
      <div>
        <h2 className="text-3xl font-bold text-primary mb-4">Our Mission</h2>
        <p className="text-gray-700 mb-4">
          To help people live independently at home by providing compassionate and professional care services.
        </p>
        <p className="text-gray-700">Respect, dignity and quality underpin every aspect of our support.</p>
      </div>
      <div className="space-y-4">
        <div className="p-6 bg-white border rounded-xl shadow">
          <h3 className="font-semibold text-primary-800 mb-1">Personalised Care</h3>
          <p className="text-sm text-gray-600">We tailor care plans around each individual's needs.</p>
        </div>
        <div className="p-6 bg-white border rounded-xl shadow">
          <h3 className="font-semibold text-primary-800 mb-1">Trusted Carers</h3>
          <p className="text-sm text-gray-600">All staff are fully trained and background checked.</p>
        </div>
        <div className="p-6 bg-white border rounded-xl shadow">
          <h3 className="font-semibold text-primary-800 mb-1">Ongoing Support</h3>
          <p className="text-sm text-gray-600">We communicate regularly to ensure happiness and wellbeing.</p>
        </div>
      </div>
    </div>
  </section>
);

export default MissionValues;
