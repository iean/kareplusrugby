"use client";

import { useState } from "react";
import { MapPin, ExternalLink } from "lucide-react";
import site from "@config/site.json";

/**
 * Office location, with a click-to-load Google Map.
 *
 * The iframe is NOT loaded on page load, for two reasons:
 *
 *  1. Performance. Embedded on the contact page it was the largest contentful
 *     paint at 5.6s and pulled that page's Lighthouse performance down to 79.
 *     Deferring it removes the third-party frame from the critical path
 *     entirely.
 *  2. Privacy. Google sets cookies the moment the frame loads. Loading it
 *     unprompted would set third-party cookies before the visitor has agreed
 *     to anything, which contradicts both our cookie banner and the cookie
 *     policy. Requiring a click makes that an informed choice.
 *
 * The address and a directions link are always present as real text, so the
 * information is never trapped inside the map for anyone who does not, or
 * cannot, load it.
 */
const LocationMap = ({ className = "", height = "380", tone = "light" }) => {
  const [loaded, setLoaded] = useState(false);

  const addressCls = tone === "dark" ? "text-white/90" : "text-textMuted";
  const linkCls =
    tone === "dark"
      ? "text-white underline underline-offset-4 hover:no-underline focus-visible:ring-white focus-visible:ring-offset-primary-950"
      : "text-primary-700 underline underline-offset-4 hover:no-underline focus-visible:ring-primary-600 focus-visible:ring-offset-2";
  const shellCls =
    tone === "dark"
      ? "border-white/20 bg-white/5"
      : "border-border bg-surface";

  const q = encodeURIComponent(site.business.map_embed_query);
  const src = `https://www.google.com/maps?q=${q}&output=embed`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${q}`;

  return (
    <div className={className}>
      <div
        className={`overflow-hidden rounded-card border shadow-card ${shellCls}`}
        style={{ minHeight: `${height}px` }}
      >
        {loaded ? (
          <iframe
            title={`Map showing ${site.business.trading_name}, ${site.business.address.full}`}
            src={src}
            width="100%"
            height={height}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            style={{ border: 0, display: "block" }}
          />
        ) : (
          <div
            className="flex flex-col items-center justify-center gap-4 px-6 text-center"
            style={{ height: `${height}px` }}
          >
            <span
              aria-hidden="true"
              className={`flex h-14 w-14 items-center justify-center rounded-full ${
                tone === "dark" ? "bg-white/10 text-primary-200" : "bg-primary-50 text-primary-700"
              }`}
            >
              <MapPin className="h-6 w-6" />
            </span>

            <p className={`max-w-sm text-[15px] leading-relaxed ${addressCls}`}>
              The map is loaded from Google, which sets its own cookies. Choose
              below to load it.
            </p>

            <button
              type="button"
              onClick={() => setLoaded(true)}
              className={`min-h-[44px] rounded-btn px-5 py-2.5 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                tone === "dark"
                  ? "bg-white text-primary-800 hover:bg-primary-50 focus-visible:ring-white focus-visible:ring-offset-primary-950"
                  : "bg-primary-700 text-white hover:bg-primary-800 focus-visible:ring-primary-600"
              }`}
            >
              Show map
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <address className={`not-italic leading-relaxed ${addressCls}`}>
          {site.business.address.full}
        </address>
        <a
          href={directions}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex shrink-0 items-center gap-1.5 font-semibold focus-visible:outline-none focus-visible:ring-2 ${linkCls}`}
        >
          Get directions
          <ExternalLink aria-hidden="true" className="h-4 w-4" />
          <span className="sr-only"> (opens Google Maps in a new tab)</span>
        </a>
      </div>
    </div>
  );
};

export default LocationMap;
