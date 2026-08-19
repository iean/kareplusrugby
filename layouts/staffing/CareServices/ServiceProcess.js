"use client";

const steps = [
  {
    title: "Tell Us Your Needs",
    text: "Contact our team and outline the roles and skills you're looking for.",
  },
  {
    title: "We Source Candidates",
    text: "Our extensive network allows us to quickly match the best professionals to your requirements.",
  },
  {
    title: "Start Working",
    text: "We arrange introductions and handle compliance checks so staff can begin without delay.",
  },
];

const ServiceProcess = () => (
  <section className="py-16">
    <div className="container">
      <h2 className="text-center text-3xl font-bold text-primary mb-12">How It Works</h2>
      <div className="grid gap-8 md:grid-cols-3">
        {steps.map((step, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-md hover:shadow-lg transition"
          >
            <div className="w-12 h-12 mx-auto mb-4 text-lg font-bold flex items-center justify-center rounded-full bg-accent text-white">
              {i + 1}
            </div>
            <h3 className="font-semibold text-primary-800 mb-2">{step.title}</h3>
            <p className="text-sm text-gray-600">{step.text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ServiceProcess;
