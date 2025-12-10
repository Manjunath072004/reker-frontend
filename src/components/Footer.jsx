import React from "react";
import rekerPayLogo from "../assets/Reker-logo.png";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 py-12 px-6 md:px-16 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* PRODUCT */}
        <div>
          <h4 className="text-white font-semibold mb-4">PRODUCT</h4>
          <ul className="space-y-2">
            <li>Payment Gateway</li>
            <li>Payouts</li>
            <li>Invoices</li>
            <li>Buttons</li>
            <li>Payment Links</li>
            <li>Payment Website/Store</li>
            <li>Excel Plugins</li>
            <li>QR Code</li>
            <li>Enterprise Solutions</li>
          </ul>
        </div>

        {/* COMPANY */}
        <div>
          <h4 className="text-white font-semibold mb-4">COMPANY</h4>
          <ul className="space-y-2">
            <li>About Us</li>
            <li>Careers</li>
            <li>Blog</li>
            <li>Help & Support</li>
            <li>India Privacy Statement</li>
            <li>Privacy Portal</li>
            <li>Cyber Security</li>
            <li>Terms & Conditions</li>
            <li>Contact Us</li>
          </ul>
        </div>

        {/* DEVELOPER */}
        <div>
          <h4 className="text-white font-semibold mb-4">DEVELOPER</h4>
          <ul className="space-y-2">
            <li>Docs</li>
            <li>API Playground</li>
            <li>Partners</li>
          </ul>
        </div>

        {/* LOGO + DESCRIPTION + SOCIAL */}
        <div>
          <img src={rekerPayLogo} alt="RekerPay Logo" className="h-12 mb-4" />
          <p className="text-gray-400 mb-4 text-sm">
            RekerPay is a leading financial services provider helping merchants buy and sell online securely.
          </p>
          <div className="flex gap-4 mt-2">
            <FaFacebookF className="cursor-pointer hover:text-white" />
            <FaTwitter className="cursor-pointer hover:text-white" />
            <FaInstagram className="cursor-pointer hover:text-white" />
            <FaLinkedinIn className="cursor-pointer hover:text-white" />
            <FaYoutube className="cursor-pointer hover:text-white" />
          </div>
        </div>
      </div>

      <p className="text-center text-gray-500 text-sm mt-10">
        © {new Date().getFullYear()} RekerPay — All Rights Reserved
      </p>
    </footer>
  );
}
