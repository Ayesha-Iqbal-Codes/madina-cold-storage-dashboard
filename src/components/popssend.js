import React from 'react';

const PopupModal = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="relative bg-gray-100 p-8 rounded shadow-lg w-3/4 max-w-4xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
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
        <h2 className="text-3xl font-bold mb-6">Item Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
          <div>
            <p><strong>Serial No:</strong> {data.newSerialNo}</p>
            <p><strong>Company Name:</strong> {data.newCompanyName}</p>
            <p><strong>Quantity:</strong> {data.newQuantity}</p>
            <p><strong>Vehicle No:</strong> {data.newVehicleNo}</p>
            <p><strong>Receiver Name:</strong> {data.newReceiverName}</p>
            <p><strong>Delivery Contact:</strong> {data.deliveryContact}</p>
          </div>
          <div>
            <p><strong>Worker Name:</strong> {data.newWorkerName}</p>
            <p><strong>Worker Wage:</strong> {data.workerWage}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupModal;
