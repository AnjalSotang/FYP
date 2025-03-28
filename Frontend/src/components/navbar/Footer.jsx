import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const FooterSection = () => (
  <footer className="bg-[#0b1129] text-gray-300 py-10 px-6 md:px-16">
    <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
      {/* Logo and About */}
      <div className="text-center md:text-left">
        <h1 className="text-2xl font-extrabold text-[#b4e61d]">FitTrack</h1>
        <p className="mt-4 text-sm">
          FitTrack is your trusted companion on your fitness journey. Track your progress, set goals, and achieve more with us.
        </p>
      </div>

      {/* Quick Links */}
      <div className="flex flex-col text-center md:text-left">
        <h3 className="font-bold text-lg mb-4">Quick Links</h3>
        <ul className="space-y-2">
          <li><Link to="" className="hover:text-white transition">Features</Link></li>
          <li><Link to="" className="hover:text-white transition">About Us</Link></li>
          <li><Link to="" className="hover:text-white transition">FAQs</Link></li>
          <li><Link to="" className="hover:text-white transition">Contact</Link></li>
        </ul>
      </div>

      {/* Social Media Links */}
      <div className="flex flex-col text-center md:text-left">
        <h3 className="font-bold text-lg mb-4">Follow Us</h3>
        <div className="flex justify-center md:justify-start space-x-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#4a90e2] transition">
            <FaFacebookF size={20} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#4a90e2] transition">
            <FaTwitter size={20} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#4a90e2] transition">
            <FaInstagram size={20} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#4a90e2] transition">
            <FaLinkedinIn size={20} />
          </a>
        </div>
      </div>
    </div>

    {/* Bottom Footer */}
    <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm">
      <p>&copy; {new Date().getFullYear()} FitTrack. All rights reserved.</p>
    </div>
  </footer>
);

export default FooterSection;
