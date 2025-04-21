import React from 'react';

const PopupModal = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-gray-100 rounded-lg shadow-lg p-8 w-1/2">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold mb-6">Item Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-4xl font-bold"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            &times;
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
          <div>
            <p><strong>Serial No:</strong> {item.serialNo}</p>
            <p><strong>Date:</strong> {item.date}</p>
            <p><strong>Company Name:</strong> {item.companyName}</p>
            <p><strong>Item Name:</strong> {item.itemName}</p>
            <p><strong>Quantity:</strong> {item.quantity}</p>
            <p><strong>Packaging:</strong> {item.packaging}</p>
          </div>
          <div>
            <p><strong>Vehicle No:</strong> {item.vehicleNo}</p>
            <p><strong>Room No:</strong> {item.roomNo}</p>
            <p><strong>Floor No:</strong> {item.floorNo}</p>
            <p><strong>Rack No:</strong> {item.rackNo}</p>
            <p><strong>Worker’s Name:</strong> {item.workerName}</p>
            <p><strong>Receiver Name:</strong> {item.receiverName}</p>
          </div>
          <div className="col-span-2">
            <p><strong>Extra Description:</strong></p>
            <p>{item.extraDescription}</p>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupModal;
