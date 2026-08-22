/**
 * The WhatsApp "doorbell".
 *
 * RECRUITMENT-SPEC.md Phase 5:
 *   - it requires Meta Cloud API or Twilio with a pre-approved template
 *   - "Implement it behind a feature flag, default off, so the rest works
 *     without it"
 *   - "TODO: — ask me which provider before writing any of it"
 *   - "The message contains no personal data. It is a doorbell, not a report."
 *
 * So this is the flag and the message shape ONLY. No provider integration is
 * written, because the spec says to ask first and Alif has not said which.
 * With WHATSAPP_ENABLED unset or not "true" this is a no-op that returns
 * immediately, and the rest of the submission pipeline neither knows nor cares.
 *
 * TODO (Alif): which provider — Meta Cloud API, or Twilio? Both need a
 * business account, a verified sender, and a template approved by Meta before
 * anything can be sent. Once chosen, the send goes in sendWhatsApp() below and
 * the credentials come from the environment, never from the repository.
 *
 * NOTE ON CONTENT. buildMessage() deliberately takes only a role and a
 * location. It has no parameter for a name, a phone number or a reference,
 * because WhatsApp messages land on personal phones, are backed up to personal
 * cloud accounts, and are read on lock screens. Sending an applicant's name
 * that way would be a disclosure nobody agreed to. If someone later wants
 * "more detail" in the notification, that is a data protection decision, not a
 * formatting one.
 */

export const isWhatsAppEnabled = () => process.env.WHATSAPP_ENABLED === "true";

/**
 * The doorbell text. No personal data — see the note above.
 */
export function buildMessage({ role, location }) {
  const where = location ? ` in ${location}` : "";
  return `New job application received${where}${role ? ` for ${role}` : ""}. Open the recruitment inbox to review it.`;
}

async function sendWhatsApp(message) {
  // Intentionally unimplemented. See the TODO above.
  throw new Error(
    "WhatsApp is enabled but no provider is implemented. Choose Meta Cloud API or Twilio first.",
  );
}

/**
 * Called after an application is saved. Never throws in the disabled case, so
 * the submission pipeline is unaffected by it.
 */
export async function notifyNewApplication({ role, location }) {
  if (!isWhatsAppEnabled()) return { sent: false, reason: "disabled" };
  const message = buildMessage({ role, location });
  await sendWhatsApp(message);
  return { sent: true };
}
