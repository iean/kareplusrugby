import crypto from "crypto";

/**
 * Upload validation for certificates and CVs.
 *
 * RECRUITMENT-SPEC.md is explicit: "Validate the actual file type by magic
 * bytes, not just extension." An extension is a claim by the uploader and
 * nothing more. A file called cv.pdf can be anything at all, and a recruiter
 * opening it is the person who finds out.
 *
 * So each file is checked three ways and must pass all three:
 *   1. the extension is on the allow list
 *   2. the declared MIME type is on the allow list
 *   3. the first bytes of the file actually match that type
 *
 * The stored filename is generated here and never derived from what the
 * uploader called it — a user-supplied filename is a path traversal waiting to
 * happen, and it can also carry a second extension ("cv.pdf.exe").
 */

export const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB per file
export const MAX_TOTAL_BYTES = 25 * 1024 * 1024; // 25 MB across the application
export const MAX_FILES = 10;

export const ACCEPT_ATTR = ".pdf,.jpg,.jpeg,.png,.doc,.docx";

const TYPES = [
  {
    ext: ["pdf"],
    mime: ["application/pdf"],
    label: "PDF",
    // %PDF-
    magic: [[0x25, 0x50, 0x44, 0x46, 0x2d]],
  },
  {
    ext: ["jpg", "jpeg"],
    mime: ["image/jpeg"],
    label: "JPEG image",
    magic: [[0xff, 0xd8, 0xff]],
  },
  {
    ext: ["png"],
    mime: ["image/png"],
    label: "PNG image",
    magic: [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
  },
  {
    ext: ["docx"],
    mime: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    label: "Word document",
    // DOCX is a ZIP container: PK\x03\x04 (or an empty/spanned archive variant).
    magic: [
      [0x50, 0x4b, 0x03, 0x04],
      [0x50, 0x4b, 0x05, 0x06],
      [0x50, 0x4b, 0x07, 0x08],
    ],
  },
  {
    ext: ["doc"],
    mime: ["application/msword"],
    label: "Word document",
    // Legacy OLE compound file.
    magic: [[0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]],
  },
];

const startsWith = (buf, sig) => sig.every((b, i) => buf[i] === b);

/**
 * Check one file. Returns { ok, error, type, storedKey }.
 *
 * `buf` is the first few hundred bytes; the caller need not read the whole
 * file to validate it.
 */
export function validateUpload({ name, mime, size, head }) {
  const ext = String(name || "").split(".").pop()?.toLowerCase() || "";

  const byExt = TYPES.find((t) => t.ext.includes(ext));
  if (!byExt) {
    return {
      ok: false,
      error: `We cannot accept ".${ext}" files. Please upload a PDF, JPG, PNG or Word document.`,
    };
  }

  if (size > MAX_FILE_BYTES) {
    return {
      ok: false,
      error: `${name} is ${(size / 1024 / 1024).toFixed(1)} MB. Each file has to be under 5 MB.`,
    };
  }
  if (size === 0) {
    return { ok: false, error: `${name} is empty.` };
  }

  // The declared MIME must agree with the extension. Browsers sometimes send
  // an empty type, which is not itself suspicious, so that is allowed through
  // to the magic-byte check rather than rejected here.
  if (mime && !byExt.mime.includes(mime)) {
    const byMime = TYPES.find((t) => t.mime.includes(mime));
    if (byMime !== byExt) {
      return {
        ok: false,
        error: `${name} says it is a ${ext.toUpperCase()} file but its type does not match. Please re-save it and try again.`,
      };
    }
  }

  // The bytes are the authority.
  const buf = Buffer.isBuffer(head) ? head : Buffer.from(head || []);
  const matches = byExt.magic.some((sig) => startsWith(buf, sig));
  if (!matches) {
    return {
      ok: false,
      error: `${name} does not appear to be a real ${byExt.label}. Please check the file and try again.`,
    };
  }

  return {
    ok: true,
    type: byExt.label,
    // Random, server-generated. Never the uploader's filename.
    storedKey: `${crypto.randomUUID()}.${ext}`,
  };
}

/** Check a whole batch against the count and total-size limits. */
export function validateBatch(files) {
  if (files.length > MAX_FILES) {
    return { ok: false, error: `Please upload no more than ${MAX_FILES} files.` };
  }
  const total = files.reduce((n, f) => n + (f.size || 0), 0);
  if (total > MAX_TOTAL_BYTES) {
    return {
      ok: false,
      error: `Those files come to ${(total / 1024 / 1024).toFixed(1)} MB in total. The limit is 25 MB.`,
    };
  }
  return { ok: true };
}
