import React from 'react';

const PopupModal = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="relative bg-gray-100 p-6 rounded shadow-lg w-1/2">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-2xl font-bold mb-4">Sent Item Details</h2>
        <p><strong>Serial No:</strong> {item.serialNo}</p>
        <p><strong>Date:</strong> {item.date}</p>
        <p><strong>Item Name:</strong> {item.itemName}</p>
        <p><strong>Quantity:</strong> {item.quantity}</p>
        <p><strong>Identity:</strong> {item.identity}</p>
        <p><strong>Room No:</strong> {item.roomNo}</p>
        <p><strong>Rack No:</strong> {item.rackNo}</p>
        <p><strong>Floor No:</strong> {item.floorNo}</p>
        <p><strong>Vehicle No:</strong> {item.vehicleNo}</p>
        <p><strong>Worker’s Name:</strong> {item.workerName}</p>
        <p><strong>Worker’s Wage:</strong> {item.workerWage}</p>
        <p><strong>Sender’s Company:</strong> {item.senderCompany}</p>
        <p><strong>Admin’s Name:</strong> {item.adminName}</p>
        <p><strong>Description:</strong> {item.description}</p>
      </div>
    </div>
  );
};

export default PopupModal;
