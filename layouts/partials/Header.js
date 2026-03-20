"use client";

import BrandLogo from "@components/BrandLogo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaArrowLeft,
} from "react-icons/fa";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import menu from "@config/menu.json";
import social from "@config/social.json";

const Header = ({ menuItems }) => {
  const pathname = usePathname();
  const main = menuItems || menu.main;

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
            className="border border-[#431c52] text-[#431c52] text-xs font-bold px-5 py-2 rounded-full hover:bg-[#431c52] hover:text-white transition flex items-center space-x-2"
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
            className="text-[#431c52] text-2xl"
          >
            {navOpen ? <HiX /> : <HiMenuAlt3 />}
          </button>
        </div>

        {/* Center Logo */}
        <BrandLogo
          className="flex items-center justify-center"
          imageClassName="h-12 w-auto sm:h-14 lg:h-16"
          priority
        />

        {/* Right: Social (hidden on mobile) */}
        <div className="hidden sm:flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-white">
            <a
              href={social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="bg-[#3bb273] p-2 rounded-full"
            >
              <FaFacebookF />
            </a>
            <a
              href={social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="bg-[#3bb273] p-2 rounded-full"
            >
              <FaInstagram />
            </a>
            <a
              href={social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="bg-[#3bb273] p-2 rounded-full"
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
                      ? "bg-[#431c52] text-white"
                      : "hover:text-[#431c52]"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="h-1 bg-gradient-to-r from-[#a3d9c3] via-[#b2d0df] to-[#8b90b3]" />
      </nav>

      {/* Mobile Dropdown Nav */}
      {navOpen && (
        <div className="lg:hidden px-4 pt-2 pb-4 border-t bg-white shadow-inner">
          <ul className="flex flex-col space-y-3 text-base font-semibold text-[#431c52]">
            {main.map((item, i) => (
              <li key={i}>
                <Link
                  href={item.url}
                  onClick={() => setNavOpen(false)}
                  className={`block px-3 py-2 rounded-full ${
                    pathname === item.url
                      ? "bg-[#431c52] text-white"
                      : "hover:bg-[#eee]"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
            <li className="pt-3">
              <Link
                href="/"
                className="block text-center border border-[#431c52] text-[#431c52] rounded-full px-4 py-2 text-sm hover:bg-[#431c52] hover:text-white flex items-center justify-center space-x-2"
              >
                <FaArrowLeft className="text-sm" />
                <span>OTHER SERVICES</span>
              </Link>
            </li>

            <li className="pt-3 flex items-center justify-center space-x-3">
              <a
                href={social.facebook}
                className="bg-[#3bb273] p-2 rounded-full text-white"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebookF />
              </a>
              <a
                href={social.instagram}
                className="bg-[#3bb273] p-2 rounded-full text-white"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>
              <a
                href={social.linkedin}
                className="bg-[#3bb273] p-2 rounded-full text-white"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
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
