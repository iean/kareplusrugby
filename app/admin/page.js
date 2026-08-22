import Link from "next/link";

/**
 * Admin index.
 *
 * "View Messages" was removed along with the stored-message feature: contact
 * submissions are emailed and never retained, so there is nothing to view.
 * See app/api/messages/route.js.
 */
const AdminHome = () => (
  <section className="section">
    <div className="container space-y-4">
      <h1 className="text-3xl font-bold">Admin</h1>
      <ul className="ml-5 list-disc">
        <li>
          <Link href="/admin/jobs" className="text-primary underline">
            Manage jobs
          </Link>
        </li>
      </ul>
      <p className="max-w-prose text-textMuted">
        Contact and enquiry submissions are emailed to{" "}
        <strong>kp.rugby@kareplus.co.uk</strong> and are not stored on this
        site. There is no message list to read here.
      </p>
    </div>
  </section>
);

export default AdminHome;
