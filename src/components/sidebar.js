import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import logo from '../assets/Logo.webp';

const Sidebar = () => {
  const location = useLocation();
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

  const allowedEmails = ["ash.ayesha365@gmail.com", "ayesha.iqbal2105@gmail.com"];
  const isAuthorized = isAuthenticated && user && allowedEmails.includes(user.email);

  const getActiveClass = (path) => {
    return location.pathname === path ? 'bg-blue-600 text-white' : 'hover:bg-gray-600 text-gray-300';
  };

  return (
    <div className="bg-navy text-white w-64 h-screen p-6 fixed top-0 left-0 z-10 flex flex-col justify-between">
      <div>
        <div className="flex items-center mb-6">
          <img src={logo} alt="Logo" className="w-16 h-16 rounded-full mr-4" />
          <span className="text-xl font-bold">Madina Cold Storage</span>
        </div>

        <ul className="space-y-4">
          <li className={`rounded-lg transition-colors duration-300 ${getActiveClass('/')}`}> 
            <Link to="/" className="text-xl font-bold block py-3 px-4">Dashboard</Link>
          </li>

          {isAuthenticated && !isAuthorized && (
            <p className="text-red-500 text-lg font-bold p-4 bg-gray-800 rounded-lg">
              You are not authorized! Please contact the admin for access.
            </p>
          )}

          {isAuthorized && (
            <>
              <li className={`rounded-lg transition-colors duration-300 ${getActiveClass('/add-items')}`}> 
                <Link to="/add-items" className="text-xl font-bold block py-3 px-4">Add Items</Link>
              </li>
              <li className={`rounded-lg transition-colors duration-300 ${getActiveClass('/send-items')}`}> 
                <Link to="/send-items" className="text-xl font-bold block py-3 px-4">Send Items</Link>
              </li>
              <li className={`rounded-lg transition-colors duration-300 ${getActiveClass('/storage-room')}`}> 
                <Link to="/storage-room" className="text-xl font-bold block py-3 px-4">Storage Room</Link>
              </li>
              <li className={`rounded-lg transition-colors duration-300 ${getActiveClass('/all-records')}`}> 
                <Link to="/all-records" className="text-xl font-bold block py-3 px-4">All Records</Link>
              </li>
            </>
          )}
        </ul>
      </div>

      <div className="mb-6">
        {isAuthenticated ? (
          <button 
            onClick={() => logout({ returnTo: window.location.origin })} 
            className="w-full rounded-lg text-xl font-bold block py-3 px-4 bg-red-600 hover:bg-red-700 text-white text-center transition"
          >
            Logout
          </button>
        ) : (
          <button 
            onClick={() => loginWithRedirect()} 
            className="w-full rounded-lg text-xl font-bold block py-3 px-4 bg-green-600 hover:bg-green-700 text-white text-center transition"
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
