"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaArrowLeft,
} from "react-icons/fa";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import config from "@config/config.json";
import menu from "@config/menu.json";

const Header = ({ menuItems }) => {
  const pathname = usePathname();
  const { base_url, logo, title } = config.site;
  const main = menuItems || menu.main;
  const { enable, label, link } = config.nav_button;

  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "shadow-md bg-white/95 backdrop-blur" : "bg-white"
      }`}
    >
      {/* Top Row */}
      <div className="max-w-screen-2xl mx-auto px-4 md:px-10 py-3 flex items-center justify-between lg:justify-around">
        {/* Left: Other Services (hidden on mobile) */}
        <div className="hidden sm:flex">
          <Link
            href="/"
            className="border border-primary-900 text-primary-900 text-xs font-bold px-5 py-2 rounded-full hover:bg-primary-900 hover:text-white transition flex items-center space-x-2"
          >
            <FaArrowLeft className="text-sm" />
            <span>OTHER SERVICES</span>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="sm:hidden flex items-center">
          <button
            onClick={() => setNavOpen(!navOpen)}
            aria-label="Toggle Menu"
            className="text-primary-900 text-2xl"
          >
            {navOpen ? <HiX /> : <HiMenuAlt3 />}
          </button>
        </div>

        {/* Center Logo */}
        <Link href={base_url} className="flex items-center justify-center">
          <Image
            src={logo}
            alt={title}
            width={220}
            height={130}
            className="object-contain max-h-[110px] w-auto"
            priority
          />
        </Link>

        {/* Right: Social (hidden on mobile) */}
        <div className="hidden sm:flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-white">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="bg-success p-2 rounded-full"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="bg-success p-2 rounded-full"
            >
              <FaTwitter />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="bg-success p-2 rounded-full"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      {/* Desktop Bottom Navigation */}
      <nav className="hidden lg:block border-t border-gray-200">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-10">
          <ul className="flex items-center justify-center space-x-6 py-2 text-sm font-semibold text-gray-800 my-4">
            {main.map((item, i) => (
              <li key={i}>
                <Link
                  href={item.url}
                  className={`px-4 py-2 rounded-full transition ${
                    pathname === item.url
                      ? "bg-primary-900 text-white"
                      : "hover:text-primary-900"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="h-1 bg-gradient-to-r from-successBg via-primary-200 to-textMuted" />
      </nav>

      {/* Mobile Dropdown Nav */}
      {navOpen && (
        <div className="lg:hidden px-4 pt-2 pb-4 border-t bg-white shadow-inner">
          <ul className="flex flex-col space-y-3 text-base font-semibold text-primary-900">
            {main.map((item, i) => (
              <li key={i}>
                <Link
                  href={item.url}
                  onClick={() => setNavOpen(false)}
                  className={`block px-3 py-2 rounded-full ${
                    pathname === item.url
                      ? "bg-primary-900 text-white"
                      : "hover:bg-border"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
            <li className="pt-3">
              <Link
                href="/"
                className="block text-center border border-primary-900 text-primary-900 rounded-full px-4 py-2 text-sm hover:bg-primary-900 hover:text-white flex items-center justify-center space-x-2"
              >
                <FaArrowLeft className="text-sm" />
                <span>OTHER SERVICES</span>
              </Link>
            </li>

            <li className="pt-3 flex items-center justify-center space-x-3">
              <a
                href="https://facebook.com"
                className="bg-success p-2 rounded-full text-white"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://twitter.com"
                className="bg-success p-2 rounded-full text-white"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a
                href="https://linkedin.com"
                className="bg-success p-2 rounded-full text-white"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn />
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
