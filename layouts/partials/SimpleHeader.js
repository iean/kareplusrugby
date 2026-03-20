"use client";

import BrandLogo from "@components/BrandLogo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  FaPhoneAlt,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import config from "@config/config.json";
import menu from "@config/menu.json";
import social from "@config/social.json";

const SimpleHeader = () => {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);
  const { main } = menu;
  const { base_url } = config.site;

  const serviceName = pathname.startsWith("/domiciliary")
    ? "Domiciliary Care"
    : pathname.startsWith("/staffing")
      ? "Temporary Staffing"
      : pathname.startsWith("/supported-living")
        ? "Supported Living"
        : "";

  return (
    <header className="bg-white shadow border-b border-[#e5e5f7]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Left: Logo */}
          <Link href={base_url} className="flex items-center gap-3">
            <BrandLogo
              linked={false}
              className="shrink-0"
              imageClassName="h-12 w-auto sm:h-14"
              priority
            />
            {serviceName && (
              <span className="rounded-full bg-[#eef2ff] px-3 py-1 text-sm font-semibold text-[#5e3ea1] sm:text-base">
                {serviceName}
              </span>
            )}
          </Link>

          {/* Center: Navigation */}
          <nav className="hidden md:flex flex-1 justify-center">
            <ul className="flex space-x-6 font-semibold text-[#c69c6d] uppercase tracking-wide text-sm">
              {main
                .filter((item) => item.name !== "Home")
                .map((item, i) => (
                  <li key={i}>
                    <Link
                      href={item.url}
                      className={`px-4 py-2 rounded-full transition duration-200 ${
                        pathname === item.url
                          ? "bg-[#5e3ea1] text-white"
                          : "hover:text-[#5e3ea1]"
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-[#5e3ea1]"
            onClick={() => setNavOpen(!navOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor">
              {navOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Right: Contact + Social */}
          <div className="hidden md:flex items-center space-x-6 border-l pl-6 border-[#ccc]">
            {/* Contact */}
            <div className="flex items-center space-x-2">
              <FaPhoneAlt className="text-[#218b61]" />
              <div className="text-sm leading-tight">
                <span className="text-xs font-semibold text-[#5e3ea1] uppercase block">
                  Contact Us
                </span>
                <span className="font-bold text-[#333] whitespace-nowrap">
                  01788 422422
                </span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center space-x-3 text-[#218b61] text-base">
              <Link
                href={social.facebook}
                target="_blank"
                aria-label="Facebook"
              >
                <FaFacebookF className="hover:text-[#5e3ea1] transition" />
              </Link>
              <Link
                href={social.instagram}
                target="_blank"
                aria-label="Instagram"
              >
                <FaInstagram className="hover:text-[#5e3ea1] transition" />
              </Link>
              <Link
                href={social.linkedin}
                target="_blank"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn className="hover:text-[#5e3ea1] transition" />
              </Link>
            </div>
          </div>
        </div>
        {navOpen && (
          <div className="md:hidden pb-4">
            <ul className="space-y-2 font-medium text-gray-700">
              {main
                .filter((item) => item.name !== "Home")
                .map((item, i) => (
                  <li key={i}>
                    <Link
                      href={item.url}
                      onClick={() => setNavOpen(false)}
                      className={`block px-3 py-2 rounded-md transition ${
                        pathname === item.url
                          ? "bg-[#5e3ea1] text-white"
                          : "hover:text-[#5e3ea1]"
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default SimpleHeader;
