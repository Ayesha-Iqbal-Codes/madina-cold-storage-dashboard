import React, { useState, useEffect } from 'react';

const Storage = () => {
  const [storage, setStorage] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedRack, setSelectedRack] = useState(null);

  useEffect(() => {
    const initStorage = {};
    for (let room = 1; room <= 3; room++) {
      initStorage[`room${room}`] = {};
      for (let floor = 1; floor <= 5; floor++) {
        initStorage[`room${room}`][`floor${floor}`] = {};
        for (let rack = 1; rack <= 84; rack++) {
          initStorage[`room${room}`][`floor${floor}`][`rack${rack}`] = {
            id: `${room}R-${floor}F-${rack}RK`,
            items: []
          };
        }
      }
    }
    setStorage(initStorage);

    const items = JSON.parse(localStorage.getItem('items')) || [];
    const updatedStorage = { ...initStorage };

    items.forEach(item => {
      const { roomNo, floorNo, rackNo } = item;
      if (
        roomNo &&
        floorNo &&
        rackNo &&
        updatedStorage[`room${roomNo}`] &&
        updatedStorage[`room${roomNo}`][`floor${floorNo}`] &&
        updatedStorage[`room${roomNo}`][`floor${floorNo}`][`rack${rackNo}`]
      ) {
        if (updatedStorage[`room${roomNo}`][`floor${floorNo}`][`rack${rackNo}`].items.length < 2) {
          updatedStorage[`room${roomNo}`][`floor${floorNo}`][`rack${rackNo}`].items.push(item);
        }
      }
    });

    setStorage(updatedStorage);
    setIsLoading(false);
  }, []);

  const handleRoomClick = (room) => {
    setSelectedRoom(selectedRoom === room ? null : room);
  };

  const handleBackToRooms = () => {
    setSelectedRoom(null);
  };

  const handleRackClick = (rackData) => {
    setSelectedRack(rackData);
  };

  const closeRackModal = () => {
    setSelectedRack(null);
  };

  const renderRack = (rack, rackData) => {
    let bgColor;
    const itemCount = rackData.items.length;

    if (itemCount === 0) {
      bgColor = 'bg-green-200';
    } else if (itemCount === 1) {
      bgColor = 'bg-yellow-200';
    } else {
      bgColor = 'bg-red-200';
    }

    return (
      <div
        key={rackData.id}
        className={`rack p-1 border border-gray-300 rounded shadow-sm ${bgColor} w-[70px] h-[40px] cursor-pointer`}
        onClick={() => handleRackClick(rackData)}
      >
        <h3 className="text-xs font-semibold">Rack {rackData.id}</h3>
      </div>
    );
  };

  const renderFloor = (floorKey, racks) => {
    const floorNumber = floorKey.replace('floor', '');
    return (
      <div key={floorKey} className="floor p-4 border-t border-gray-300 bg-gray-50 w-full max-w-screen-xl mx-auto">
        <h2 className="text-lg font-semibold mb-4">Floor {floorNumber}</h2>
        <div className="racks grid grid-cols-10 gap-3">
          {Object.keys(racks).map(rack => renderRack(rack, racks[rack]))}
        </div>
      </div>
    );
  };

  const renderRoom = (roomKey, floors) => {
    const roomNumber = roomKey.replace('room', '');
    return (
      <div key={roomKey} className="room p-4 border-b border-gray-300 bg-gray-100 w-full max-w-screen-xl mx-auto">
        <button onClick={handleBackToRooms} className="back-button mb-4 p-2 text-blue-600 hover:text-blue-800">
          &larr; Back to Rooms
        </button>
        <h1 className="text-xl font-bold mb-4">Room {roomNumber}</h1>
        <div>{Object.keys(floors).map(floorKey => renderFloor(floorKey, floors[floorKey]))}</div>
      </div>
    );
  };

  const renderRackModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4">Rack {selectedRack.id}</h2>
        <ul className="list-disc list-inside mb-4">
          {selectedRack.items.length > 0 ? (
            selectedRack.items.map((item, index) => (
              <li key={index} className="text-gray-700 text-sm">
                <strong>Item Name:</strong> {item.itemName}<br />
                <strong>Quantity:</strong> {item.quantity}<br />
                <strong>Company Name:</strong> {item.companyName || 'N/A'}<br />
              </li>
            ))
          ) : (
            <li className="text-gray-500">No items stored in this rack.</li>
          )}
        </ul>
        <button
          onClick={closeRackModal}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800"
        >
          Close
        </button>
      </div>
    </div>
  );

  return (
    <div className="storage-container flex flex-col min-h-screen w-full px-2 sm:px-4">
      <header className="flex-none">
        <h1 className="text-3xl font-bold mb-4 text-center">Storage Room Overview</h1>
      </header>
      <main className="flex flex-grow items-start justify-center w-full">
        {isLoading ? (
          <p className="text-gray-500">Loading storage data...</p>
        ) : (
          <div className="flex flex-col items-center w-full">
            {selectedRoom ? (
              renderRoom(selectedRoom, storage[selectedRoom])
            ) : (
              <div className="rooms flex flex-wrap gap-4 justify-center max-w-screen-xl mx-auto">
                {Object.keys(storage).map(room => (
                  <button
                    key={room}
                    onClick={() => handleRoomClick(room)}
                    className={`room-button p-8 text-2xl font-bold border rounded transition-transform transform hover:scale-105 hover:bg-blue-950 hover:text-white ${selectedRoom === room ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}
                    style={{ width: '300px', height: '300px' }}
                  >
                    ROOM {room.slice(-1)}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
      {selectedRack && renderRackModal()}
    </div>
  );
};

export default Storage;
