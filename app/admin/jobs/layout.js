/**
 * The jobs admin page is a client component and cannot export `metadata`
 * itself, so this layout carries it. Noindex, like the rest of /admin.
 */
export const metadata = {
  title: "Manage Jobs",
  description: "Internal job management for Kare Plus Rugby.",
  robots: { index: false, follow: true },
};

export default function AdminJobsLayout({ children }) {
  return children;
}
