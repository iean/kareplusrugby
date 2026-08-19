const steps = [
  {
    title: "Initial Consultation",
    description:
      "We discuss your needs and preferences to understand the level of support required.",
  },
  {
    title: "Care Plan Proposal",
    description:
      "Our team designs a personalised care plan outlining recommended services and schedules.",
  },
  {
    title: "Caregiver Matching",
    description:
      "We match you with experienced carers best suited to your situation and lifestyle.",
  },
  {
    title: "Ongoing Support",
    description:
      "Regular check-ins and feedback ensure the care provided remains flexible and effective.",
  },
];

const WorkSteps = () => {
  return (
    <section className="py-16 bg-primary-50">
      <div className="container px-4 mx-auto">
        <h2 className="text-3xl font-bold text-center text-primary-800 mb-12">Our Process</h2>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white border border-primary-100 rounded-xl p-6 text-center shadow-md hover:shadow-lg transition"
            >
              <div className="w-12 h-12 mx-auto mb-4 text-lg font-bold flex items-center justify-center rounded-full bg-primary-100 text-primary-700">
                {index + 1}
              </div>
              <h3 className="font-semibold text-primary-800 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkSteps;
