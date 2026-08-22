"use client";
import Link from "next/link";

const jobs = [
  { title: "Care Assistant", location: "London", type: "Full-time" },
  { title: "Support Worker", location: "Birmingham", type: "Part-time" },
  { title: "Registered Nurse", location: "Manchester", type: "Temporary" },
];

const JobList = () => (
  <section className="py-12 bg-gray-50">
    <div className="container">
      <h2 className="text-2xl font-semibold text-brandText mb-6 text-center">
        Available Jobs
      </h2>
      <div className="space-y-4">
        {jobs.map((job, index) => (
          <div
            key={index}
            className="p-5 bg-white border rounded-lg flex flex-col md:flex-row md:justify-between md:items-center"
          >
            <div>
              <h3 className="text-xl font-semibold text-primary">{job.title}</h3>
              <p className="text-base text-gray-600">
                {job.location} &middot; {job.type}
              </p>
            </div>
            <Link
              href="/domiciliary/contact-us"
              className="mt-3 md:mt-0 inline-block bg-primary text-white px-5 py-2 rounded-full text-sm font-medium"
            >
              Apply Now
            </Link>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default JobList;
