import config from "@config/config.json";
import social from "@config/social.json";
import { markdownify } from "@lib/utils/textConverter";

const Contact = ({ data, requestType }) => {
  const { frontmatter } = data;
  const { title, info } = frontmatter;
  const { contact_form_action } = config.params;
  const { phone, address, email } = social;

  const defaultContacts = [
    `**\uD83D\uDCCD Address**  \nKare Plus Rugby Healthcare  \n${address}`,
    `**\uD83D\uDCDE Phone**  \n${phone}`,
    `**\uD83D\uDCE7 Email**  \n[${email}](mailto:${email})`,
    `**\uD83D\uDD50 Office Hours**  \nMonday – Friday: 9:00 AM – 6:00 PM  \nWeekend appointments available by request.`,
  ];
  const contacts =
    info.contacts && info.contacts.length > 0 ? info.contacts : defaultContacts;

  return (
    <section className="section">
      <div className="container">
        {markdownify(title, "h1", "text-center font-normal mb-8")}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 content">
            {markdownify(info.title, "h4")}
            {markdownify(info.description, "p", "mt-4")}
            <ul className="contact-list mt-5 space-y-2">
              {contacts.map((contact, index) => (
                <li key={index}>{markdownify(contact, "div", "text-dark")}</li>
              ))}
            </ul>
          </div>
          <div className="order-1 md:order-2 w-full">
            <form
              className="space-y-4"
              method="POST"
              action={contact_form_action}
            >
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  className="form-input w-full rounded-md"
                  name="name"
                  type="text"
                  placeholder="Name"
                  required
                />
                <input
                  className="form-input w-full rounded-md"
                  name="phone"
                  type="text"
                  placeholder="Phone"
                />
              </div>
              <input
                className="form-input w-full rounded-md"
                name="email"
                type="email"
                placeholder="Email"
                required
              />
              <input
                className="form-input w-full rounded-md"
                name="subject"
                type="text"
                placeholder="Subject"
              />
              <textarea
                className="form-textarea w-full rounded-md"
                name="message"
                rows="6"
                placeholder="Message"
                required
              />
              {requestType && (
                <input type="hidden" name="type" value={requestType} />
              )}
              <button type="submit" className="btn btn-primary w-full">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
