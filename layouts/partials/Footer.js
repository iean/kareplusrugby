"use client";

import BrandLogo from "@components/BrandLogo";
import Image from "next/image";
import Link from "next/link";
import Social from "@components/Social";
import social from "@config/social.json";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-[#431c63] via-[#6e296d] to-[#ec9e57] text-white pt-2">
      {/* Card Container */}
      <div className="relative z-10 bg-[#fdfbff] text-black rounded-t-[2rem] shadow-2xl px-6 py-12 max-w-7xl mx-auto mt-1 border border-[#ece4f4]">
        <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-10">
          {/* Logo & Contact */}
          <div className="space-y-3">
            <BrandLogo
              className="inline-flex"
              imageClassName="h-14 w-auto sm:h-16"
            />
            <div className="text-sm text-[#333]">
              <p>
                <strong>T:</strong> 01788 422422
              </p>
              <p>
                <strong>E:</strong>{" "}
                <a
                  href="mailto:taimur.sadat@kareplus.co.uk"
                  className="text-[#5e3ea1] hover:underline"
                >
                  taimur.sadat@kareplus.co.uk
                </a>
              </p>
              <p>
                <strong>E:</strong>{" "}
                <a
                  href="mailto:Rugby@kareplus.co.uk"
                  className="text-[#5e3ea1] hover:underline"
                >
                  Rugby@kareplus.co.uk
                </a>
              </p>
            </div>
          </div>

          {/* Address */}
          <div>
            <h4 className="font-semibold text-[#431c63] text-lg mb-2">
              Address
            </h4>
            <p className="text-sm text-[#333]">
              6A Davy Court, <br />
              Castle Mound Way, Central Park, <br />
              Rugby, CV23 0UZ
            </p>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="font-semibold text-[#431c63] text-lg mb-2">
              Opening Hours
            </h4>
            <p className="text-sm text-[#333]">
              Monday–Friday: 9:00am – 5:00pm <br />
              Saturday & Sunday: Closed <br />
              24/7 On Call Support
            </p>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-[#431c63] text-lg mb-2">
              Follow Us
            </h4>
            <Social
              source={social}
              className="flex space-x-4 mt-2 text-[#431c63]"
            />
          </div>
        </div>
      </div>

      {/* CQC Info Section */}
      <div className="bg-[#fff9f4] text-black py-6 shadow-inner max-w-7xl mx-auto px-6 rounded-b-[1rem] border-t border-[#f1d0af]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <Image
              src="/images/cqc-logo.png"
              alt="CQC"
              width={60}
              height={60}
            />
            <div className="text-sm">
              <p>
                CQC regulates Kare Plus Rugby Ltd to provide care at{" "}
                <strong>Kare Plus Rugby - Main Office</strong>
              </p>
              <p className="text-red-600 font-semibold">
                We haven't inspected this service yet
              </p>
              <p className="text-green-600">
                ✓ We checked this service was likely to be safe, effective,
                caring, responsive and well-led during registration.
              </p>
            </div>
          </div>
          <Link
            href="/registration-details"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold text-sm"
          >
            See registration details
          </Link>
        </div>
      </div>

      {/* Bottom Strip */}
      <div className="border-t border-white/20 py-4 text-sm text-center bg-[#00000020] mt-4">
        <Link href="/privacy-policy" className="mx-2 hover:underline">
          Privacy Policy
        </Link>
        |
        <Link href="/terms-and-conditions" className="mx-2 hover:underline">
          Terms and Conditions
        </Link>
        |
        <Link href="/request-personal-data" className="mx-2 hover:underline">
          Request Personal Data
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
