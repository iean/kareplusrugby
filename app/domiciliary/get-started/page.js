import GetStartedForm from "@layouts/partials/GetStartedForm";

const GetStartedPage = async () => {
  return (
    <>
      {/* Hero Section with Background Image and Steps */}
      <section
        className="h-[70vh] bg-gradient-to-br from-primary-950 via-primary-900 to-primary-700 flex items-center relative"
        style={{
          backgroundImage: `url('/images/services/social-companionship.PNG')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            Get Started
          </h1>
          <p className="text-xl text-white text-center mb-12">
            Let us know how we can help
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Provide us with the requested information and we&apos;ll be in
            touch.
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-lg p-8 shadow-lg text-center">
              <div className="flex justify-center mb-4">
                <svg
                  className="w-12 h-12 text-primary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Leave your information
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Leave your information and we&apos;ll contact you to answer your
                questions.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg text-center">
              <div className="flex justify-center mb-4">
                <svg
                  className="w-12 h-12 text-primary-800"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                We&apos;ll get in touch
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We&apos;ll get in touch to get to know you a bit better.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg text-center">
              <div className="flex justify-center mb-4">
                <svg
                  className="w-12 h-12 text-primary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Schedule assessment
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We&apos;ll then schedule your care assessment at your
                convenience.
              </p>
            </div>
          </div>
        </div>
      </section>

      <GetStartedForm />
    </>
  );
};

export default GetStartedPage;
