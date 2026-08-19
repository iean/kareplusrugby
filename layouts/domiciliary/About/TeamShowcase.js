"use client";

const team = [
  { name: "Emily Carter", role: "Registered Manager" },
  { name: "Daniel Green", role: "Care Coordinator" },
  { name: "Lucy Smith", role: "Client Support" },
];

const TeamShowcase = () => (
  <section className="py-16">
    <div className="container">
      <h2 className="text-center text-3xl font-bold text-primary mb-8">Our Leadership Team</h2>
      <div className="grid gap-8 md:grid-cols-3">
        {team.map((member, i) => (
          <div key={i} className="bg-white border rounded-xl p-6 shadow text-center">
            <h3 className="text-lg font-semibold text-primary-800 mb-1">{member.name}</h3>
            <p className="text-sm text-gray-600">{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TeamShowcase;
