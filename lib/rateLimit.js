/**
 * Minimal in-memory rate limiter for the public form endpoints.
 *
 * Deliberately simple, and deliberately honest about its limits:
 *
 *  - It is per-instance. Serverless functions scale out, so a determined
 *    attacker spread across instances gets more than the nominal allowance.
 *    It stops casual form spam and accidental double-submits, which is what it
 *    is for. It is NOT a defence against a distributed attack.
 *  - It holds only a hashed IP and a list of timestamps. No form contents, no
 *    personal data, and entries are evicted once they age out.
 *
 * The work plan rules out a third-party CAPTCHA without asking first, so this
 * plus a honeypot is the spam protection.
 */

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 5;

const hits = new Map();

// Cheap non-cryptographic hash. The point is not to store a raw IP, and never
// to be able to reverse one - only to tell two requesters apart.
function keyFor(ip) {
  let h = 0;
  for (let i = 0; i < ip.length; i++) {
    h = (h * 31 + ip.charCodeAt(i)) | 0;
  }
  return String(h);
}

/**
 * Best-effort client IP. Vercel sets x-forwarded-for; the left-most entry is
 * the original client. Falls back to a single shared bucket when absent, which
 * fails closed-ish rather than handing every caller its own allowance.
 */
export function clientIp(req) {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

/**
 * Returns { allowed, retryAfter } - retryAfter is in seconds.
 *
 * `subject` lets a caller rate-limit by something other than IP — the
 * recruitment system limits per email address as well, because a household or
 * an office behind one NAT shares an IP, and because someone determined to
 * spam applications will change IP long before they change address.
 */
export function rateLimit(
  req,
  { max = MAX_REQUESTS, windowMs = WINDOW_MS, subject = null, bucket = "default" } = {},
) {
  const now = Date.now();
  /**
   * The bucket namespaces the counter.
   *
   * Without it every route shares one counter per IP, so a generous limit and
   * a strict one interfere: saving a long form 60 times would exhaust the
   * five-submissions-per-hour allowance before the applicant ever pressed
   * submit. Each caller passes its own bucket so the limits are independent.
   */
  const key = keyFor(`${bucket}:${subject ? `s:${subject}` : clientIp(req)}`);

  // Evict expired buckets so the map cannot grow without bound.
  for (const [k, times] of hits) {
    const live = times.filter((t) => now - t < windowMs);
    if (live.length === 0) hits.delete(k);
    else hits.set(k, live);
  }

  const times = (hits.get(key) || []).filter((t) => now - t < windowMs);

  if (times.length >= max) {
    const retryAfter = Math.ceil((windowMs - (now - times[0])) / 1000);
    return { allowed: false, retryAfter };
  }

  times.push(now);
  hits.set(key, times);
  return { allowed: true, retryAfter: 0 };
}
