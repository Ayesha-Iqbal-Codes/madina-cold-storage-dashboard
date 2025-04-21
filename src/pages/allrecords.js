import React, { useState, useEffect } from 'react';
import PopupModal from '../components/popmodel'; // Adjust the path as needed
import PopupSendModal from '../components/popssend'; // Adjust the path as needed

const AllRecords = () => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [modalData, setModalData] = useState(null); // To handle modal data
  const [showModal, setShowModal] = useState(false); // To handle modal visibility
  const [activeTab, setActiveTab] = useState('records'); // To handle tab switching

  useEffect(() => {
    const loadItems = () => {
      const savedItems = JSON.parse(localStorage.getItem('items')) || [];
      setItems(savedItems);
    };

    const fetchTableData = () => {
      const storedTableData = JSON.parse(localStorage.getItem('tableData')) || [];

      // Sort table data by serial number
      storedTableData.sort((a, b) => a.serialNo.localeCompare(b.serialNo));

      setTableData(storedTableData);
    };

    loadItems();
    fetchTableData();

    const handleStorageChange = () => {
      loadItems();
      fetchTableData();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleViewDetails = (serialNo) => {
    const item = items.find(item => item.serialNo === serialNo);
    setSelectedItem(item);
  };

  const handleViewInfo = (data) => {
    setModalData(data);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    setShowModal(false);
    setModalData(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">All Records</h1>

      <div className="mb-4">
        <button
          onClick={() => setActiveTab('records')}
          className={`p-2 ${activeTab === 'records' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Add Items Table
        </button>
        <button
          onClick={() => setActiveTab('viewItems')}
          className={`p-2 ${activeTab === 'viewItems' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Sent Items Table
        </button>
      </div>

      {activeTab === 'records' && (
        <div>
          <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
            <thead className="bg-blue-950 text-white">
              <tr>
                <th className="border border-gray-300 p-1">Serial No (سیریل نمبر)</th>
                <th className="border border-gray-300 p-1">Date  (تاریخ)</th>
                <th className="border border-gray-300 p-1">Company Name  (کمیٹی کا نام)</th>
                <th className="border border-gray-300 p-1">Item Name   (آئٹم کا نام)</th>
                <th className="border border-gray-300 p-1">Quantity  (مقدار)</th>
                <th className="border border-gray-300 p-1">Actions (عمل)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.serialNo}>
                  <td className="border border-gray-300 p-1 text-center">{item.serialNo}</td>
                  <td className="border border-gray-300 p-1">{item.date}</td>
                  <td className="border border-gray-300 p-1">{item.companyName}</td>
                  <td className="border border-gray-300 p-1">{item.itemName}</td>
                  <td className="border border-gray-300 p-1">{item.quantity}</td>
                  <td className="border border-gray-300 p-1 space-x-1 flex justify-center text-xs">
                    <button
                      onClick={() => handleViewDetails(item.serialNo)}
                      className="bg-blue-500 text-white p-1 rounded w-16"
                    >
                      View Info
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {selectedItem && (
            <PopupModal item={selectedItem} onClose={handleCloseModal} />
          )}
        </div>
      )}

      {activeTab === 'viewItems' && (
        <div>
          {tableData.length > 0 ? (
            <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
              <thead className="bg-blue-950 text-white">
                <tr>
                  <th className="p-1 border border-gray-300">Serial No (سیریل نمبر)</th>
                  <th className="p-1 border border-gray-300">Date  (تاریخ)</th>
                  <th className="p-1 border border-gray-300">Company Name  (کمیٹی کا نام)</th>
                  <th className="p-1 border border-gray-300">Quantity Sent (جتنا سامان بھیجا ہے) </th>
                  <th className="p-1 border border-gray-300">Vehicle No   (ویہیکل نمبر)</th>
                  <th className="p-1 border border-gray-300">Action (عمل)</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="p-1 border border-gray-300">{item.serialNo}</td>
                    <td className="p-1 border border-gray-300">{item.date}</td>
                    <td className="p-1 border border-gray-300">{item.newCompanyName}</td>
                    <td className="p-1 border border-gray-300">{item.newQuantity}</td>
                    <td className="p-1 border border-gray-300">{item.newVehicleNo}</td>
                    <td className="p-1 border border-gray-300">
                      <button
                        onClick={() => handleViewInfo(item)}
                        className="bg-blue-500 text-white p-1 rounded text-xs"
                      >
                        View Info
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No items available.</p>
          )}

          {showModal && modalData && (
            <PopupSendModal
              data={modalData}
              onClose={handleCloseModal}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AllRecords;
