import React from "react";

const Careers = () => {
  const jobs = [
    {
      title: "Frontend Developer",
      location: "Remote",
      type: "Full Time",
    },
    {
      title: "Backend Developer",
      location: "Remote",
      type: "Full Time",
    },
    {
      title: "UI/UX Designer",
      location: "Remote",
      type: "Internship",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black">

      {/* Hero Section */}
      <section className="text-center py-20 border-b">
        <h1 className="text-4xl font-bold mb-4">
          Careers at Traxo
        </h1>
        <p className="text-gray-700">
          Build the future with us.
        </p>
      </section>

      {/* About */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-semibold mb-6">
          Why Join Traxo?
        </h2>

        <p className="text-gray-600 leading-relaxed">
          At Traxo we believe in innovation, teamwork, and growth.
          Our mission is to build products that help people and
          businesses grow faster. Join our team and create something
          meaningful.
        </p>
      </section>

      {/* Job Section */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-semibold text-center mb-12">
          Open Positions
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {jobs.map((job, index) => (
            <div
              key={index}
              className="border p-6 rounded-lg hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold mb-2">
                {job.title}
              </h3>

              <p className="text-gray-600">{job.location}</p>
              <p className="text-gray-600 mb-4">{job.type}</p>

              <button className="border border-black px-4 py-2 hover:bg-black hover:text-white transition">
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Careers;