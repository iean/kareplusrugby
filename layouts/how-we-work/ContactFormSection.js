import config from "@config/config.json";
import { markdownify } from "@lib/utils/textConverter";
import Image from "next/image";

const ContactFormSection = ({ data }) => {
  const { frontmatter } = data;
  const { title, info } = frontmatter;
  const { contact_form_action } = config.params;

  return (
    <section className="section bg-primary-50">
      <div className="container">
        {markdownify(title, "h2", "text-center font-normal mb-8")}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <form
              className="space-y-4"
              method="POST"
              action={contact_form_action}
            >
              <input
                className="form-input w-full rounded"
                name="name"
                type="text"
                placeholder="Name"
                required
              />
              <input
                className="form-input w-full rounded"
                name="email"
                type="email"
                placeholder="Your email"
                required
              />
              <input
                className="form-input w-full rounded"
                name="subject"
                type="text"
                placeholder="Subject"
                required
              />
              <textarea
                className="form-textarea w-full rounded-md"
                name="message"
                rows="5"
                placeholder="Your message"
                required
              />
              <button type="submit" className="btn btn-primary w-full">
                Send Now
              </button>
            </form>
          </div>
          <div className="text-center">
            <Image
              src="/images/banner-caregiving/care-help-2.jpg"
              alt="Contact"
              width={600}
              height={450}
              className="rounded-xl border"
            />
            <div className="mt-6 text-left">
              {markdownify(info.title, "h4", "text-primary-800")}
              {markdownify(info.description, "p", "mt-2 text-gray-700")}
              <ul className="mt-4 space-y-1">
                {info.contacts.map((contact, index) => (
                  <li key={index} className="text-sm text-gray-800">
                    {markdownify(contact, "strong", "text-dark")}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;
