"use client";

const MissionValues = () => (
  <section className="py-16 bg-theme-light">
    <div className="container grid md:grid-cols-2 gap-10 items-center">
      <div>
        <h2 className="text-3xl font-bold text-primary mb-4">Our Mission</h2>
        <p className="text-gray-700 mb-4">
          We provide reliable and compassionate healthcare professionals wherever they are needed.
        </p>
        <p className="text-gray-700">
          Integrity, respect and quality are at the heart of everything we do.
        </p>
      </div>
      <div className="space-y-4">
        <div className="p-6 bg-white border rounded-xl shadow">
          <h3 className="font-semibold text-primary-800 mb-1">Quality Recruitment</h3>
          <p className="text-sm text-gray-600">All candidates undergo comprehensive vetting.</p>
        </div>
        <div className="p-6 bg-white border rounded-xl shadow">
          <h3 className="font-semibold text-primary-800 mb-1">Responsive Support</h3>
          <p className="text-sm text-gray-600">Our team is available 24/7 for urgent requests.</p>
        </div>
        <div className="p-6 bg-white border rounded-xl shadow">
          <h3 className="font-semibold text-primary-800 mb-1">Nationwide Cover</h3>
          <p className="text-sm text-gray-600">We place professionals across the UK.</p>
        </div>
      </div>
    </div>
  </section>
);

export default MissionValues;
