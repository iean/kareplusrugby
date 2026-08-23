import { NextResponse } from "next/server";
import siteConfig from "@config/config.json";

// Single source of truth for the business inbox (kp.rugby@kareplus.co.uk).
const ADMIN_EMAIL = siteConfig.params.contact_email;

/**
 * Protects the admin area and the endpoints that expose personal data.
 *
 * Everything here was publicly readable before: anyone who knew the URL could
 * list every contact enquiry, Get Started submission and GDPR data request,
 * complete with names, emails and phone numbers.
 *
 * Auth is HTTP Basic. The username defaults to the business inbox; the
 * password must be set as ADMIN_PASSWORD in the Vercel project's environment
 * variables. If it is missing we deny everyone rather than fall back to a
 * default — an unset secret should never silently reopen the door.
 */

// Nothing here any more. /api/messages, /api/get-started and /api/request-data
// used to expose stored submissions over GET; none of them stores anything now
// and all three return 405 to a GET, so there is no personal data left behind
// them to protect. Add a path here if a route ever reads personal data again.
const READ_PROTECTED = [];

// Public job listings read this; only writing is restricted.
const WRITE_PROTECTED = ["/api/jobs"];

/**
 * The recruitment status page lists applicant names alongside safeguarding
 * flags, so it needs its own password — separate from the site admin one, and
 * separate again from CRON_SECRET. Fails closed when unset.
 */
const RECRUITMENT_PROTECTED = ["/careers/status"];

function recruitmentAuthorised(req) {
  const password = process.env.RECRUITMENT_ADMIN_PASSWORD;
  if (!password) return false;

  const header = req.headers.get("authorization") || "";
  if (!header.startsWith("Basic ")) return false;
  let decoded;
  try {
    decoded = atob(header.slice(6));
  } catch {
    return false;
  }
  const supplied = decoded.slice(decoded.indexOf(":") + 1);
  return safeEqual(supplied, password);
}

function needsAuth(pathname, method) {
  if (RECRUITMENT_PROTECTED.includes(pathname)) return true;
  if (pathname.startsWith("/admin")) return true;
  if (READ_PROTECTED.includes(pathname)) return method !== "POST";
  if (WRITE_PROTECTED.includes(pathname)) return method !== "GET";
  return false;
}

// Constant-time string compare. Edge runtime has no crypto.timingSafeEqual,
// so compare every character and accumulate rather than returning early.
function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function isAuthorised(req) {
  // The admin username is the business inbox, so there is only one credential
  // left to configure. It is not a secret, so defaulting it is safe.
  const user = process.env.ADMIN_USER || ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  // Fail closed on the password: an unset secret must never open the door.
  if (!user || !password) return false;

  const header = req.headers.get("authorization") || "";
  if (!header.startsWith("Basic ")) return false;

  let decoded;
  try {
    decoded = atob(header.slice(6));
  } catch {
    return false;
  }

  // Split on the first colon only — passwords may contain colons.
  const separator = decoded.indexOf(":");
  if (separator === -1) return false;

  const suppliedUser = decoded.slice(0, separator);
  const suppliedPassword = decoded.slice(separator + 1);

  // Evaluate both halves every time so the response time does not reveal
  // whether it was the username or the password that was wrong.
  const userOk = safeEqual(suppliedUser, user);
  const passwordOk = safeEqual(suppliedPassword, password);
  return userOk && passwordOk;
}

export function middleware(req) {
  const { pathname } = req.nextUrl;

  if (!needsAuth(pathname, req.method)) {
    return NextResponse.next();
  }

  // The recruitment status page has its own credential.
  if (RECRUITMENT_PROTECTED.includes(pathname)) {
    if (recruitmentAuthorised(req)) return NextResponse.next();
    return new NextResponse("Authentication required.", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Kare Plus Rugby recruitment", charset="UTF-8"',
        "Cache-Control": "no-store",
      },
    });
  }

  if (isAuthorised(req)) {
    return NextResponse.next();
  }

  // Browsers show a login prompt on a 401 carrying WWW-Authenticate.
  // API clients just get the 401.
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Kare Plus Rugby admin", charset="UTF-8"',
      // Never let a protected response sit in a shared cache.
      "Cache-Control": "no-store",
    },
  });
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/admin",
    "/api/jobs",
    "/careers/status",
  ],
};
