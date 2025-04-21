import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Auth0Provider } from "@auth0/auth0-react";
import Sidebar from './components/sidebar';
import Dashboard from './pages/dashboard';
import AddItem from './pages/additems';
import SendItem from './pages/senditems';
import Storage from './pages/storageroom';
import AllRecords from './pages/allrecords';
import SplashScreen from './components/splash';
import './App.css';

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer); 
  }, []);

  if (loading) return <SplashScreen />;

  return (
    <Auth0Provider
      domain="dev-k4l0iqeap0j6kdwr.us.auth0.com"
      clientId="JJsrqhkDDQXfFHjlCpQgMeQ25hnZfwpg"
      authorizationParams={{ redirect_uri: window.location.origin }}
    >
      <Router>
        <div className="flex">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <div className="ml-64 p-4 flex-1">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/add-items" element={<AddItem />} />
                <Route path="/send-items" element={<SendItem />} />
                <Route path="/storage-room" element={<Storage />} />
                <Route path="/all-records" element={<AllRecords />} />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </Auth0Provider>
  );
};

export default App;