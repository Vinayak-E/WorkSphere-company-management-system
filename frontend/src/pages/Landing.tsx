import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <img
              className="h-10 w-auto"
              src="/path-to-logo.png" // Replace with your logo path
              alt="WorkSphere Logo"
            />
          </div>

          {/* Menu Items */}
          <div className="hidden md:flex space-x-8">
            <a href="#home" className="hover:text-gray-300">
              Home
            </a>
            <a href="#pricing" className="hover:text-gray-300">
              Pricing
            </a>
            <a href="#contact" className="hover:text-gray-300">
              Contact
            </a>
            <a href="#about" className="hover:text-gray-300">
              About
            </a>
          </div>

          {/* Buttons Section */}
          <div className="hidden md:flex space-x-4">
            <button className="bg-transparent hover:bg-gray-700 text-white font-semibold py-2 px-4 border border-gray-700 rounded">
              Login
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger Icon */}
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden" id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <a
            href="#home"
            className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
          >
            Home
          </a>
          <a
            href="#pricing"
            className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
          >
            Pricing
          </a>
          <a
            href="#contact"
            className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
          >
            Contact
          </a>
          <a
            href="#about"
            className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
          >
            About
          </a>
          <button className="block w-full px-3 py-2 text-center text-white bg-blue-600 hover:bg-blue-700 rounded-md">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
