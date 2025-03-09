import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Function to handle scroll events
  const handleScroll = () => {
    setIsScrolled(window.scrollY > 10); // Trigger after scrolling 10px
  };

  useEffect(() => {
    // Attach scroll listener
    window.addEventListener("scroll", handleScroll);

    // Initial scroll position check
    handleScroll();

    // Cleanup event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-gradient-to-r from-[#0b1129] to-[#1a2c50] shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-[#b4e61d] text-2xl font-extrabold tracking-wide hover:text-[#a4d519] transition-all duration-300 cursor-pointer">
              FitTrack
            </h1>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/features" label="Features" />
            <NavLink to="/about" label="About Us" />
            <NavLink to="/faq" label="FAQs" />
            <NavLink to="/contact" label="Contact" />
            <Link
              to="/login"
              className="text-white px-5 py-2 text-sm font-medium bg-[#1a2c50] border border-[#4a90e2] rounded-full hover:bg-[#4a90e2] hover:text-[#0b1129] transition-all duration-300 shadow-md"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-white px-5 py-2 text-sm font-medium bg-[#4a90e2] border border-[#1a2c50] rounded-full hover:bg-[#b4e61d] hover:text-[#0b1129] transition-all duration-300 shadow-md"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white focus:outline-none"
            >
              <span className="text-2xl">☰</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`${
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden transition-all duration-500 md:hidden bg-[#1a2c50] rounded-lg shadow-md mt-2`}
        >
          <MobileNavLink to="/features" label="Features" />
          <MobileNavLink to="/about" label="About Us" />
          <MobileNavLink to="/faq" label="FAQs" />
          <MobileNavLink to="/contact" label="Contact" />
          <MobileNavLink to="/login" label="Login" />
          <MobileNavLink to="/register" label="Sign Up" />
        </div>
      </div>
    </nav>
  );
};

/* Reusable Desktop Navigation Link Component */
const NavLink = ({ to, label }) => (
  <Link
    to={to}
    className="text-white text-sm font-medium hover:text-[#4a90e2] transition-all duration-300"
  >
    {label}
  </Link>
);

/* Reusable Mobile Navigation Link Component */
const MobileNavLink = ({ to, label }) => (
  <Link
    to={to}
    className="block text-white px-5 py-2 text-sm font-medium border-b border-[#4a90e2] hover:bg-[#4a90e2] hover:text-[#0b1129] transition-all duration-300"
  >
    {label}
  </Link>
);

export default Navbar;
