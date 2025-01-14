import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Menu, X } from 'lucide-react';
import IMAGES from '@/assets/images/image';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const navRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  useEffect(() => {
    const timeline = gsap.timeline();
    
    timeline.fromTo(
      navRef.current,
      { y: -100, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 1, 
        ease: "power3.out" 
      }
    );

   
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach((item, index) => {
      gsap.fromTo(
        item,
        { y: -20, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.5,
          delay: 0.2 * index,
          ease: "power2.out"
        }
      );
    });
  }, []);

  return (
    <nav ref={navRef} className="bg-[#FFFFFF] shadow-md fixed w-full z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <img
              className="h-14 w-auto mt-1 transition-transform duration-300 hover:scale-105"
              src={IMAGES.navBarLogoDark}
              alt="WorkSphere Logo"
            />
          </div>

          <div className="hidden md:flex space-x-8">
            {['Home', 'Pricing', 'Contact', 'About'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="menu-item text-[#2C3E50] hover:text-[#4A90E2] transition-colors duration-300 font-medium"
              >
                {item}
              </a>
            ))}
          </div>

      
            <div className="hidden md:flex space-x-4">
                <Link
                    to="/login" 
                    className="menu-item bg-[#6C7A89] hover:bg-[#5B6770] text-white font-semibold py-2 px-4 rounded transition-colors duration-300"
                >
                    Login
                </Link>
                <Link 
                    to="/register" 
                    className="menu-item bg-[#4A90E2] hover:bg-[#3D7EBD] text-white font-semibold py-2 px-4 rounded transition-all duration-300 transform hover:scale-105"
                >
                    Get Started
                </Link>
                </div>
        
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[#2C3E50] hover:text-[#4A90E2] transition-colors duration-300"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>


      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="px-4 pt-2 pb-3 space-y-1 bg-white">
          {['Home', 'Pricing', 'Contact', 'About'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="block px-3 py-2 text-[#2C3E50] hover:text-[#4A90E2] hover:bg-gray-50 rounded-md transition-colors duration-300"
            >
              {item}
            </a>
          ))}
          <button className="w-full mt-2 bg-[#4A90E2] hover:bg-[#3D7EBD] text-white font-semibold py-2 px-4 rounded transition-colors duration-300">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;