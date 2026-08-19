import PageHero from "@layouts/partials/PageHero";

const AboutUs = () => (
  <>
    {/* Hero Section with Background Image and Gradient */}
    <section
      className="h-[70vh] bg-gradient-to-br from-primary-950 via-primary-900 to-primary-700 flex items-center relative"
      style={{
        backgroundImage: `url('/images/domiciliary/Bannerdomiciliary.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay",
      }}
    >
      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-700"></div>

      <div className="container mx-auto px-4 relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
          Quality, Efficient & Person-centred Service
        </h1>
        <p className="text-xl text-white text-center mb-8 max-w-4xl mx-auto">
          Kare Plus Rugby Healthcare is a specialist employment business,
          supplying highly trained healthcare professionals to care homes,
          hospitals, and healthcare clients across the UK.
        </p>
        <div className="text-center">
          <a href="#contact" className="btn btn-primary inline-block">
            Get In Touch
          </a>
        </div>
      </div>
    </section>

    {/* About Us Section */}
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-primary mb-6">About Us</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Kare Plus Rugby Healthcare is a specialist employment business,
              which supplies to care homes, hospitals and other healthcare
              clients across the UK with highly trained nurses, social workers,
              care assistants, support workers and more.
            </p>
            <p className="text-gray-700 mb-6 leading-relaxed">
              We are often in need of new recruits to fill various positions
              across our service areas. We pride ourselves on ensuring our staff
              enjoy diverse and rewarding roles assisting others while also
              flexibly selecting the hours they want to work.
            </p>
          </div>
          <div className="bg-gradient-to-br from-primary-900 to-primary-800 p-8 rounded-lg text-white">
            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p className="mb-4">
              To provide exceptional healthcare staffing solutions that connect
              qualified professionals with healthcare organisations, ensuring
              the highest standards of care and service delivery.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-800">500+</div>
                <div className="text-sm">Healthcare Professionals</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-800">100+</div>
                <div className="text-sm">Healthcare Clients</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Professional, Efficient and Personable Section */}
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">
            Professional, Efficient and Personable
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Everything about Kare Plus Rugby Healthcare stands for quality,
            whether that&apos;s the services we provide or the staff we employ.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-primary mb-3">
              Quality Assurance
            </h3>
            <p className="text-gray-600">
              We look at every single detail and make sure we perform it to the
              highest calibre, from assisting with cleaning and cooking to more
              sensitive roles working with dementia patients.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-primary mb-3">
              Professional Staff
            </h3>
            <p className="text-gray-600">
              Our staff are consistently professional, friendly and efficient,
              ensuring the very best service in their work, no matter how small
              the task.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-primary mb-3">
              Person-centred Care
            </h3>
            <p className="text-gray-600">
              We match up our recruits to roles that allow them to thrive and
              make a real difference in the lives of those they care for.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Service Standards Section */}
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-primary mb-6">
              Our Service Standards
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              We are a specialist recruiter for jobs within the health and
              social care industry. This means we strive to hire only people who
              have the perfect amount and sort of experience to make sure our
              clients get the very best standard of staff.
            </p>
            <p className="text-gray-700 mb-6 leading-relaxed">
              In particular, Kare Plus Rugby Healthcare aims to recruit
              individuals who have a great track record of working with diverse
              clients. We always provide an extensive and outstanding level of
              care and service to each one of our clients.
            </p>
            <div className="bg-accent/10 p-6 rounded-lg border-l-4 border-accent">
              <h4 className="font-semibold text-primary-800 mb-2">
                Quality Personal Service
              </h4>
              <p className="text-gray-700 text-sm">
                We do this by matching up our recruits to roles that allow them
                to thrive and make a real difference in the healthcare sector.
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-primary-900 to-primary-800 p-8 rounded-lg text-white">
            <h3 className="text-2xl font-bold mb-4">Our Specialities</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-primary-800 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Registered Nurses
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-primary-800 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Support Workers
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-primary-800 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Social Workers
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-primary-800 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Care Assistants
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-primary-800 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Allied Healthcare Professionals
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-primary-800 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Cleaners
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    {/* Get In Touch Section */}
    <section
      id="contact"
      className="py-16 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-700 text-white"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
          <p className="text-xl max-w-3xl mx-auto">
            Our friendly staff are always available to help you with your needs.
            If you need help, or you have questions please by all means get in
            touch with us for more information.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Phone</h3>
            <p className="mb-2">01788 422422</p>
            <p className="text-sm opacity-90">Main Office</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Email</h3>
            <p className="mb-2">kp.rugby@kareplus.co.uk</p>
            <p className="text-sm opacity-90">General Inquiries</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Address</h3>
            <p className="mb-2">6a Davy Court, Castle Mound Way</p>
            <p className="text-sm opacity-90">Rugby, CV23 0UZ</p>
          </div>
        </div>

        <div className="text-center mt-12">
          <a
            href="/staffing/contact-us"
            className="btn btn-primary bg-white text-primary hover:bg-gray-100"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  </>
);

export default AboutUs;
