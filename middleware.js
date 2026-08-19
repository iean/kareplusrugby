import { NextResponse } from "next/server";

/**
 * Protects the admin area and the endpoints that expose personal data.
 *
 * Everything here was publicly readable before: anyone who knew the URL could
 * list every contact enquiry, Get Started submission and GDPR data request,
 * complete with names, emails and phone numbers.
 *
 * Auth is HTTP Basic against ADMIN_USER / ADMIN_PASSWORD. Those must be set as
 * environment variables in Netlify. If they are missing we deny everything
 * rather than fall back to a default password — an unset variable should never
 * silently reopen the door.
 */

// Public form submissions post here; only reading them is restricted.
const READ_PROTECTED = [
  "/api/messages",
  "/api/get-started",
  "/api/request-data",
];

// Public job listings read this; only writing is restricted.
const WRITE_PROTECTED = ["/api/jobs"];

function needsAuth(pathname, method) {
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
  const user = process.env.ADMIN_USER;
  const password = process.env.ADMIN_PASSWORD;

  // Fail closed: no credentials configured means nobody gets in.
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
    "/api/messages",
    "/api/jobs",
    "/api/get-started",
    "/api/request-data",
  ],
};
