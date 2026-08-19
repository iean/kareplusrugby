"use client";

import Image from "next/image";
import Link from "next/link";
import Social from "@components/Social";
import config from "@config/config.json";
import social from "@config/social.json";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-primary-950 via-primary-900 to-primary-700 text-white pt-2">
      {/* Card Container */}
      <div className="relative z-10 bg-primary-50 text-black rounded-t-[2rem] shadow-2xl px-6 py-12 max-w-7xl mx-auto mt-1 border border-primary-100">
        <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-10">
          {/* Logo & Contact */}
          <div className="space-y-3">
            <Image
              src={config.site.logo}
              alt="Kare Plus Rugby"
              width={140}
              height={60}
            />
            <div className="text-sm text-text">
              <p>
                <strong>T:</strong> 01788 422422
              </p>
              <p>
                <strong>E:</strong>{" "}
                <a
                  href="mailto:kp.rugby@kareplus.co.uk"
                  className="text-primary-700 hover:underline"
                >
                  kp.rugby@kareplus.co.uk
                </a>
              </p>
              <p>
                <strong>E:</strong>{" "}
                <a
                  href="mailto:support@kareplus.co.uk"
                  className="text-primary-700 hover:underline"
                >
                  support@kareplus.co.uk
                </a>
              </p>
            </div>
          </div>

          {/* Address */}
          <div>
            <h4 className="font-semibold text-primary-900 text-lg mb-2">
              Address
            </h4>
            <p className="text-sm text-text">
              6A Davy Court, <br />
              Mound Way, Central Park, <br />
              Rugby, CV23 0UZ
            </p>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="font-semibold text-primary-900 text-lg mb-2">
              Opening Hours
            </h4>
            <p className="text-sm text-text">
              Monday–Friday: 9:00am – 5:00pm <br />
              Saturday & Sunday: Closed <br />
              24/7 On Call Support
            </p>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-primary-900 text-lg mb-2">
              Follow Us
            </h4>
            <Social
              source={social}
              className="flex space-x-4 mt-2 text-primary-900"
            />
          </div>
        </div>
      </div>

      {/* CQC Info Section */}
      <div className="bg-surface text-black py-6 shadow-inner max-w-7xl mx-auto px-6 rounded-b-[1rem] border-t border-border">
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
                CQC regulates Divergent Healthcare Limited to provide care at{" "}
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
            href="https://www.cqc.org.uk/provider/1-18444576596"
            target="_blank"
            rel="noopener noreferrer"
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
