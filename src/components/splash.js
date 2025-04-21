// src/components/SplashScreen.js
import React, { useEffect, useState } from 'react';
import '../components/splash.css'; // Ensure this is the correct path
import logo from '../assets/Logo.webp'; // Adjust the path as needed

const SplashScreen = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading time (e.g., 3 seconds)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer); // Cleanup on component unmount
  }, []);

  if (!loading) return null;

  return (
    <div className="splash-screen">
      <div className="splash-content">
        <img src={logo} alt="Logo" className="logo" />
        <h1 style={{ fontSize: '50px', fontWeight: 'bold', margin: '0', lineHeight: '1.1' }}>
          Welcome to Madina Cold Storage
        </h1>
      </div>
    </div>
  );
};

export default SplashScreen;
