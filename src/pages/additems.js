import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import PopupModal from '../components/popmodel'; // Adjust the path as needed
import logo from '../assets/Logo.webp';



// Utility function to get current date in dd/mm/yyyy format
const getCurrentDate = () => {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const AddItems = () => {
  const [formData, setFormData] = useState({
    serialNo: '',
    date: getCurrentDate(),
    companyName: '',
    itemName: '',
    quantity: '',
    packaging: '', // Changed from identity to packaging
    vehicleNo: '',
    roomNo: '',
    floorNo: '',
    rackNo: '',
    workerName: '',
    receiverName: '',
    extraDescription: '',
    otherPackaging: '', // Changed from otherIdentity to otherPackaging
  });

  const [items, setItems] = useState([]);
  const [editingSerialNo, setEditingSerialNo] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem('items')) || [];
    setItems(savedItems);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const resetSerialNumberCounter = () => {
    localStorage.setItem('lastSerialNo', '0'); // Reset the counter to 0
  };
  
  const getLastSerialNo = () => {
    const lastSerialNo = localStorage.getItem('lastSerialNo');
    return lastSerialNo ? parseInt(lastSerialNo, 10) : 0;
  };
  
  const updateLastSerialNo = (newSerialNo) => {
    localStorage.setItem('lastSerialNo', newSerialNo);
  };
  
  
  

  const getPackagingLabel = (value, otherPackaging) => {
    const packagingLabels = {
      packaging1: 'Box Crate',
      packaging2: 'Cardboard',
      packaging3: otherPackaging.trim() || 'Not Specified'
    };
    return value === 'packaging3' ? packagingLabels.packaging3 : packagingLabels[value] || 'Unknown';
  };
  
  const getHighestSerialNo = () => {
    const savedItems = JSON.parse(localStorage.getItem('items')) || [];
    
    // Extract serial numbers and find the highest one
    const serialNumbers = savedItems.map(item => parseInt(item.serialNo.match(/\d+/)[0]));
    const highestSerial = serialNumbers.length > 0 ? Math.max(...serialNumbers) : 0;
    
    return highestSerial;
  };
  
  const getNextSerialNo = () => {
    const highestSerialNo = getHighestSerialNo();
    const nextSerialNo = (highestSerialNo + 1).toString().padStart(5, '0'); // Pad to ensure 5 digits
    return nextSerialNo;
  };
  
  // Function to be used on item creation
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Retrieve and update the serial number
    const newSerialNo = getNextSerialNo();
    
    // Convert packaging value to its display name
    const packagingDisplay = getPackagingLabel(formData.packaging, formData.otherPackaging);
    const newItem = { ...formData, serialNo: editingSerialNo || newSerialNo, packaging: packagingDisplay };
    
    const updatedItems = editingSerialNo
      ? items.map(item => item.serialNo === editingSerialNo ? newItem : item)
      : [...items, newItem];
    
    setItems(updatedItems);
    localStorage.setItem('items', JSON.stringify(updatedItems));
    
    // Reset form and editing state
    setFormData({
      serialNo: '',
      date: getCurrentDate(),
      companyName: '',
      itemName: '',
      quantity: '',
      packaging: '',
      vehicleNo: '',
      roomNo: '',
      floorNo: '',
      rackNo: '',
      workerName: '',
      receiverName: '',
      extraDescription: '',
      otherPackaging: '',
    });
    setEditingSerialNo(null);
  };
  
  // Remove the resetSerialNumberCounter function if not needed
  
  

 const handleDelete = (serialNo) => {
  // Filter out the item with the specified serialNo
  const updatedItems = items.filter(item => item.serialNo !== serialNo);
  
  // Update the state and local storage
  setItems(updatedItems);
  localStorage.setItem('items', JSON.stringify(updatedItems));

  // If there are no more items, reset the serial number counter
  if (updatedItems.length === 0) {
    resetSerialNumberCounter();
  }
};

  

  const handleEdit = (serialNo) => {
    const item = items.find(item => item.serialNo === serialNo);
    setFormData(item);
    setEditingSerialNo(serialNo);
  };

  

  const handleViewDetails = (serialNo) => {
    const item = items.find(item => item.serialNo === serialNo);
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  const handlePrintPDF = () => {
    const doc = new jsPDF();
    const companyName = 'Madina Cold Storage';
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const logoWidth = 20; // Width of the logo
    const logoMarginLeft = 14; // Margin from the left edge
    const lineHeight = 10; // Consistent line height for text
    const headerMarginTop = 10; // Margin from the top for the header
    const sectionMarginTop = 20; // Margin above each section
    const lineY = pageHeight / 2; // Original Y position for the dividing line
    let currentY = headerMarginTop; // Initial Y position for the text
  
    const packagingLabels = {
      packaging1: 'Box Crate',
      packaging2: 'Cardboard',
      packaging3: 'Other'
    };
  
    const addHeader = () => {
      // Add logo
      doc.setFontSize(20);
      doc.addImage(logo, 'WEBP', logoMarginLeft, currentY, logoWidth, logoWidth, '', 'FAST'); // Logo on the left
  
      // Calculate text width and position for company name
      const textWidth = doc.getTextWidth(companyName);
      const totalWidth = logoWidth + 50 + textWidth; // 50 is the margin between logo and text
      const textX = (pageWidth - totalWidth) / 2 + logoWidth + 20;
      doc.text(companyName, textX, currentY + 15);
  
      // Add a horizontal line below the company name
      doc.setLineWidth(0.5);
      doc.line(10, currentY + 25, pageWidth - 10, currentY + 25);
  
      // Add space below the header
      currentY += 20; // Space for the header and line
    };
  
    const addSection = (title) => {
      // Add section title
      doc.setFontSize(18);
      doc.text(title, pageWidth / 2, currentY + sectionMarginTop, { align: 'center' }); // Adjusted Y position
      currentY += lineHeight + sectionMarginTop; // Adjust position for the section title
  
      // Add item details in a table format
      doc.setFontSize(14);
      const leftColumnX = 20;
      const rightColumnX = pageWidth / 2 + 10;
  
      // Left Column
      doc.text(`Serial No: ${formData.serialNo}`, leftColumnX, currentY);
      doc.text(`Date: ${formData.date}`, leftColumnX, currentY + lineHeight);
      doc.text(`Company’s Name: ${formData.companyName}`, leftColumnX, currentY + lineHeight * 2);
      doc.text(`Item Name: ${formData.itemName}`, leftColumnX, currentY + lineHeight * 3);
      doc.text(`Quantity: ${formData.quantity}`, leftColumnX, currentY + lineHeight * 4);
  
      // Determine the packaging text
      let packagingText;
      if (formData.packaging === 'packaging3') { // If "Other" is selected
        packagingText = formData.otherPackaging.trim() || 'Not Specified';
      } else {
        packagingText = packagingLabels[formData.packaging] || 'Unknown';
      }
  
      doc.text(`Packaging: ${packagingText}`, leftColumnX, currentY + lineHeight * 5);
  
      // Right Column
    doc.text(`Vehicle No: ${formData.vehicleNo}`, rightColumnX, currentY);
    doc.text(`Rack No: ${formData.rackNo}`, rightColumnX, currentY + lineHeight *3 );
    doc.text(`Room No: ${formData.roomNo}`, rightColumnX, currentY + lineHeight);
    doc.text(`Floor No: ${formData.floorNo}`, rightColumnX, currentY + lineHeight * 2);
    doc.text(`Worker’s Name: ${formData.workerName}`, rightColumnX, currentY + lineHeight * 4);
    doc.text(`Receiver Name: ${formData.receiverName}`, rightColumnX, currentY + lineHeight * 5);
  
      // Extra Description (spanning across both columns)
      currentY += lineHeight * 6; // Move below the columns
      doc.text('Extra Description:', leftColumnX, currentY);
      doc.setFontSize(15);
      const descriptionLines = doc.splitTextToSize(formData.extraDescription, pageWidth - 2 * leftColumnX - 20);
      doc.text(descriptionLines, leftColumnX, currentY + lineHeight);
  
      currentY += lineHeight * (descriptionLines.length + 2); // Move below the extra description
    };
  
    // Add first section
    addHeader();
    addSection('Office Use');
  
    // Draw the dotted dividing line
    doc.setLineWidth(1);
    doc.setDrawColor(0, 0, 0); // Black color
    doc.setLineDash([1, 2]); // Dotted line
    doc.line(10, lineY, pageWidth - 10, lineY);
    doc.setLineDash([]); // Reset line dash
  
    // Adjust current Y position to start after the dotted line for the second section
    currentY = lineY - 30 + 30; // Move up by 30 units from the dotted line
    addHeader(); // Call addHeader again to add the logo and company name in the second section
    addSection('Customer Receipt');
  
    // Add a footer
    const footerMarginBottom = 10; // Adjust as needed
    currentY = pageHeight - footerMarginBottom; // Move to near the bottom of the page
    doc.setFontSize(10);
    doc.text('Thank you for your business!', pageWidth / 2, currentY, { align: 'center' });
  
    // Save the PDF
    doc.save('item-receipt.pdf');
  };
  

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{editingSerialNo ? 'Edit Item' : 'Add Item'}</h1>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6 bg-gray-100 p-4 rounded shadow-md">
  <div className="flex flex-col space-y-2">
    <label className="text-sm font-semibold">Serial No (سیریل نمبر)</label>
    <input
      type="text"
      name="serialNo"
      value={formData.serialNo}
      onChange={handleInputChange}
      placeholder="Serial No"
      className="p-1 border rounded text-sm"
      disabled
    />
    <label className="text-sm font-semibold">Date (تاریخ)</label>
    <input
      type="text"
      name="date"
      value={formData.date}
      onChange={handleInputChange}
      placeholder="Date"
      className="p-1 border rounded text-sm"
      disabled
    />
    <label className="text-sm font-semibold">Company’s Name (کمپنی کا نام)</label>
    <input
      type="text"
      name="companyName"
      value={formData.companyName}
      onChange={handleInputChange}
      placeholder="Company’s Name"
      className="p-1 border rounded text-sm"
    />
    <label className="text-sm font-semibold">Item Name (آئٹم کا نام)</label>
    <input
      type="text"
      name="itemName"
      value={formData.itemName}
      onChange={handleInputChange}
      placeholder="Item Name"
      className="p-1 border rounded text-sm"
    />
    <label className="text-sm font-semibold">Quantity (مقدار)</label>
    <input
      type="number"
      name="quantity"
      value={formData.quantity}
      onChange={handleInputChange}
      placeholder="Quantity"
      className="p-1 border rounded text-sm"
    />
    <label className="text-sm font-semibold">Packaging (پیکیجنگ)</label>
    <select
      name="packaging" 
      value={formData.packaging}
      onChange={handleInputChange}
      className="p-1 border rounded text-sm"
    >
      <option value="">Select Packaging</option>
      <option value="packaging1">Box Crate</option>
      <option value="packaging2">Cardboard</option>
      <option value="packaging3">Other</option>
      {/* Add more options as needed */}
    </select>
    {formData.packaging === 'packaging3' && (
      <>
        <label className="text-sm font-semibold">Other Packaging  (دیگر پیکیجنگ)</label>

        <input
          type="text"
          name="otherPackaging"
          value={formData.otherPackaging}
          onChange={handleInputChange}
          placeholder="Specify Packaging"
          className="p-1 border rounded text-sm"
        />
      </>
    )}
    <label className="text-sm font-semibold">Extra Description  (اضافی وضاحت)</label>

    <textarea
      name="extraDescription"
      value={formData.extraDescription}
      onChange={handleInputChange}
      placeholder="Additional details..."
      className="p-1 border rounded text-sm w-full" // Added w-full for full width
      rows="3"
    />
  </div>
  <div className="flex flex-col space-y-2">
    <label className="text-sm font-semibold">Vehicle No (گاڑی کا نمبر)</label>
    <input
      type="text"
      name="vehicleNo"
      value={formData.vehicleNo}
      onChange={handleInputChange}
      placeholder="Vehicle No"
      className="p-1 border rounded text-sm"
    />
    <label className="text-sm font-semibold">Room No  (کمرہ نمبر)</label>

    <input
      type="text"
      name="roomNo"
      value={formData.roomNo}
      onChange={handleInputChange}
      placeholder="Room No"
      className="p-1 border rounded text-sm"
    />
    <label className="text-sm font-semibold">Floor No (منزل نمبر)</label>
    <input
      type="text"
      name="floorNo"
      value={formData.floorNo}
      onChange={handleInputChange}
      placeholder="Floor No"
      className="p-1 border rounded text-sm"
    />
    <label className="text-sm font-semibold">Rack No  (ریک نمبر)</label>

    <input
      type="text"
      name="rackNo"
      value={formData.rackNo}
      onChange={handleInputChange}
      placeholder="Rack No"
      className="p-1 border rounded text-sm"
    />
    <label className="text-sm font-semibold">Worker’s Name (مزدور کا نام)</label>

    <input
      type="text"
      name="workerName"
      value={formData.workerName}
      onChange={handleInputChange}
      placeholder="Worker’s Name"
      className="p-1 border rounded text-sm"
    />
    <label className="text-sm font-semibold">Receiver Name (وصول کرنے والے کا نام) </label>
    <input
      type="text"
      name="receiverName"
      value={formData.receiverName}
      onChange={handleInputChange}
      placeholder="Receiver Name"
      className="p-1 border rounded text-sm"
    />
  </div>
  <div className="col-span-full flex justify-center p-4">
    <button
      type="submit"
      onClick={handleSubmit}
      className="bg-blue-500 text-white p-2 rounded text-sm w-80"
    >
      {editingSerialNo ? 'Update Item' : 'Add Item'}
    </button>
  </div>
</form>


      {/* Print PDF Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handlePrintPDF}
          className="bg-green-500 text-white p-2 rounded text-sm w-60"
        >
          Print PDF
        </button>
      </div>

      <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
        <thead className="bg-blue-950 text-white">
          <tr>
          <th className="border border-gray-300 p-1">Serial No (سیریل نمبر)</th>
<th className="border border-gray-300 p-1">Date (تاریخ)</th>

            <th className="border border-gray-300 p-1">Company Name (کمپنی کا نام)</th>
            <th className="border border-gray-300 p-1">Item Name (آئٹم کا نام)</th>
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
                  onClick={() => handleEdit(item.serialNo)}
                  className="bg-[#00003f] text-white p-1 rounded w-16"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.serialNo)}
                  className="bg-red-500 text-white p-1 rounded w-16"
                >
                  Delete
                </button>
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
  );
};

export default AddItems;
