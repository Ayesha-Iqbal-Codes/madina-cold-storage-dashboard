import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Storage = () => {
  const { user, isAuthenticated } = useAuth0();
  const [dashboard, setDashboard] = useState({
    totalRooms: 0,
    totalFloors: 0,
    totalRacks: 0,
    emptyRacks: 0,
    halfFullRacks: 0,
    fullRacks: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const allowedEmails = ["ash.ayesha365@gmail.com", "ayesha.iqbal2105@gmail.com"];
  const isAuthorized = isAuthenticated && user && allowedEmails.includes(user.email);

  useEffect(() => {
    if (!isAuthorized) return;

    const updateStorage = () => {
      const totalRooms = 3;
      const totalFloorsPerRoom = 5;
      const totalRacksPerFloor = 84;
      const totalRacks = totalRooms * totalFloorsPerRoom * totalRacksPerFloor;

      const items = JSON.parse(localStorage.getItem('items')) || [];
      let emptyRacks = totalRacks;
      let halfFullRacks = 0;
      let fullRacks = 0;
      const rackUsage = {};

      items.forEach(({ roomNo, floorNo, rackNo }) => {
        const rackKey = `${roomNo}-${floorNo}-${rackNo}`;
        if (!rackUsage[rackKey]) rackUsage[rackKey] = 0;
        rackUsage[rackKey]++;

        if (rackUsage[rackKey] === 1) {
          halfFullRacks++;
          emptyRacks--;
        } else if (rackUsage[rackKey] === 2) {
          fullRacks++;
          halfFullRacks--;
        }
      });

      setDashboard({
        totalRooms,
        totalFloors: totalRooms * totalFloorsPerRoom,
        totalRacks,
        emptyRacks,
        halfFullRacks,
        fullRacks,
      });
      setIsLoading(false);
    };

    updateStorage();
    window.addEventListener('storage', updateStorage);
    return () => window.removeEventListener('storage', updateStorage);
  }, [isAuthorized]);

  const pieData = [
    { name: 'Empty Racks', value: dashboard.emptyRacks, color: '#22c55e' },
    { name: 'Half-Full Racks', value: dashboard.halfFullRacks, color: '#3b82f6' },
    { name: 'Full Racks', value: dashboard.fullRacks, color: '#ef4444' },
  ];

  const summaryData = [
    { name: 'Total Rooms', value: dashboard.totalRooms, color: '#1e3a8a' },
    { name: 'Total Floors', value: dashboard.totalFloors, color: '#6366f1' },
    { name: 'Total Racks', value: dashboard.totalRacks, color: '#9333ea' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 py-10 px-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">Cold Storage Dashboard</h2>

      {!isAuthenticated ? (
        <div className="w-full max-w-6xl bg-red-100 text-red-700 text-center p-4 mb-6 rounded-lg">
          Please <strong>login</strong> to access the dashboard.
        </div>
      ) : !isAuthorized ? (
        <div className="w-full max-w-6xl bg-red-100 text-red-700 text-center p-4 mb-6 rounded-lg">
          You are <strong>not authorized</strong> to view this dashboard. Please contact the admin for access.
        </div>
      ) : (
        <>
          <div className="w-full max-w-6xl bg-white shadow-md rounded-lg p-6 text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Welcome back, {user.name}!</h2>
          </div>

          {isLoading ? (
            <div className="text-gray-500 text-lg">Loading storage data...</div>
          ) : (
            <div className="w-full max-w-6xl bg-white shadow-lg rounded-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-medium mb-4 text-gray-900">Rack Status</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} label>
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-medium mb-4 text-gray-900">Storage Summary</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart layout="vertical" data={summaryData}>
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Bar dataKey="value" barSize={30}>
                        {summaryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Storage;
