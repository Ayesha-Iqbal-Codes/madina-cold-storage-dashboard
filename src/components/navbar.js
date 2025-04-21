import React from 'react';
import logo from '../assets/Logo.webp'; // Adjust the path as needed

const Navbar = () => {
  return (
    <div className="bg-navy text-white w-full h-16 p-4 fixed top-0 left-0 z-10 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {/* Logo */}
        <img 
          src={logo} 
          alt="Logo" 
          className="w-12 h-12 rounded-full" // Adjust size as needed
        />
        
      </div>
      <div className="flex items-center space-x-4">
        <input 
          type="text" 
          placeholder="Search..." 
          className="bg-gray-800 text-white p-2 rounded-lg w-64 focus:outline-none"
        />
      </div>
    </div>
  );
};

export default Navbar;
