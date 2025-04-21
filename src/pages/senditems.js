import React, { useState, useEffect } from 'react';
import PopupModal from '../components/popssend';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from '../assets/Logo.webp';


const SendItems = () => {
  const [serialNo, setSerialNo] = useState('');
  const [formData, setFormData] = useState({
    serialNo: '',
    date: '',
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
  });
  const [showNewForm, setShowNewForm] = useState(false);
  const [newFormData, setNewFormData] = useState({
    newSerialNo: '',
    newCompanyName: '',
    newQuantity: '',
    newVehicleNo: '',
    newReceiverName: '',
    deliveryContact: '',
    newWorkerName: '',
    workerWage: '',
  });
  const [tableData, setTableData] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [modalData, setModalData] = useState(null); // To handle modal data
  const [showModal, setShowModal] = useState(false); // To handle modal visibility

  const generatePDF = (item) => {
    const doc = new jsPDF();
    const companyName = 'Madina Cold Storage';
    const officeUseText = 'Office Use';
    const customerReceiptText = 'Customer Receipt';
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const logoWidth = 20; // Width of the logo
    const logoMarginLeft = 14; // Margin from the left edge
    const lineHeight = 10; // Consistent line height for text
    const headerMarginTop = 10; // Margin from the top for the header
    const sectionMarginTop = 20; // Margin above each section
    const footerMarginBottom = 10; // Margin for the footer
    const splitPageHeight = pageHeight / 2;
    let currentY = headerMarginTop; // Initial Y position for the text

    // Add Header
    const addHeader = () => {
        doc.setFontSize(20);
        doc.addImage(logo, 'WEBP', logoMarginLeft, currentY, logoWidth, logoWidth, '', 'FAST'); // Logo on the left

        const textWidth = doc.getTextWidth(companyName);
        const totalWidth = logoWidth + 50 + textWidth; // 50 is the margin between logo and text
        const textX = (pageWidth - totalWidth) / 2 + logoWidth + 20;
        doc.text(companyName, textX, currentY + 15);

        doc.setLineWidth(0.5);
        doc.line(10, currentY + 25, pageWidth - 10, currentY + 25);

        currentY += 30; // Space for the header and line
    };

    // Add Section Title
    const addSectionTitle = (title) => {
        doc.setFontSize(16);
        doc.text(title, pageWidth / 2, currentY, { align: 'center' });
        currentY += 10; // Space after the section title
    };

    // Add Data
    const addData = () => {
        doc.setFontSize(12);
        doc.text(`Serial No: ${item.serialNo}`, 10, currentY);
        currentY += lineHeight;
        doc.text(`Date: ${item.date}`, 10, currentY);
        currentY += lineHeight;
        doc.text(`Company Name: ${item.newCompanyName}`, 10, currentY);
        currentY += lineHeight;
        doc.text(`Quantity Sent: ${item.newQuantity}`, 10, currentY);
        currentY += lineHeight;
        doc.text(`Vehicle No: ${item.newVehicleNo}`, 10, currentY);
        currentY += lineHeight;
        doc.text(`Receiver Name: ${item.newReceiverName}`, 10, currentY);
        currentY += lineHeight;
        doc.text(`Delivery Contact: ${item.deliveryContact}`, 10, currentY);
        currentY += lineHeight;
        doc.text(`Worker’s Name: ${item.newWorkerName}`, 10, currentY);
        currentY += lineHeight;
        doc.text(`Worker’s Wage: ${item.workerWage}`, 10, currentY);
        currentY += lineHeight;
    };

    // Add Footer
    const addFooter = () => {
        doc.setFontSize(10);
        doc.text('Thank you for your business!', pageWidth / 2, pageHeight - footerMarginBottom, { align: 'center' });
    };

    // Add Dotted Line
    const addDottedLine = (y) => {
        doc.setLineWidth(1); // Set line width to 1 for the dotted line
        doc.setDrawColor(0, 0, 0); // Set line color to black
        doc.setLineDashPattern([1, 2]); // Set pattern for dotted line (1px dash, 2px space)
        doc.line(10, y, pageWidth - 10, y); // Draw the dotted line
        doc.setLineDashPattern([]); // Reset to solid lines for subsequent lines
    };

    // Generate PDF
    // Office Use Section
    currentY = headerMarginTop;
    addHeader();
    addSectionTitle(officeUseText);
    addData();
    
    // Add Dotted Line for separation
    addDottedLine(splitPageHeight);

    // Move to the bottom half for the Customer Receipt Section
    currentY = splitPageHeight + 10; // Adjust as needed to ensure spacing
    
    // Customer Receipt Section
    addHeader();
    addSectionTitle(customerReceiptText);
    addData();
    addFooter();

    doc.save('sentitems.pdf');
};




  const handleDelete = (serialNo) => {
    // Retrieve 'items' from local storage
    const items = JSON.parse(localStorage.getItem('items')) || [];
    
    // Retrieve 'tableData' from local storage
    const tableData = JSON.parse(localStorage.getItem('tableData')) || [];
    
    // Find the item to be deleted from 'tableData'
    const itemToDelete = tableData.find(item => item.serialNo === serialNo);
  
    if (itemToDelete) {
      console.log('Item to delete:', itemToDelete);
      
      // Extract the base serial number (before the hyphen)
      const baseSerialNo = serialNo.split('-')[0];
      
      // Find the original item to update its quantity
      const updatedItems = items.map(item => {
        if (item.serialNo === baseSerialNo) {
          // Add quantity back to the original item's quantity
          return {
            ...item,
            quantity: (parseFloat(item.quantity) + parseFloat(itemToDelete.newQuantity)).toString(),
          };
        }
        return item;
      });
  
      console.log('Updated items:', updatedItems);
  
      // Update local storage with the restored item
      localStorage.setItem('items', JSON.stringify(updatedItems));
      
      // Remove the deleted item from 'tableData'
      const updatedTableData = tableData.filter(item => item.serialNo !== serialNo);
  
      console.log('Updated table data:', updatedTableData);
  
      // Update local storage with the new table data
      localStorage.setItem('tableData', JSON.stringify(updatedTableData));
      
      // Update local state
      setTableData(updatedTableData);
    } else {
      console.log('Item not found in tableData');
    }
  };
  


  useEffect(() => {
    if (serialNo) {
      const items = JSON.parse(localStorage.getItem('items')) || [];
      const item = items.find(item => item.serialNo === serialNo);
      if (item) {
        setFormData(item);
        console.log('Form Data:', item); // Debugging line
      } else {
        setFormData({
          serialNo: '',
          date: '',
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
        });
      }
    }
  }, [serialNo]);
  
  console.log('Packaging Value:', formData.packaging); // Debugging line
  

  useEffect(() => {
    const storedTableData = JSON.parse(localStorage.getItem('tableData')) || [];
    
    // Sort table data by serial number
    storedTableData.sort((a, b) => a.serialNo.localeCompare(b.serialNo));
    
    setTableData(storedTableData);
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSerialNoChange = (e) => {
    setSerialNo(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowNewForm(true);
    setIsSubmitted(true);
    console.log('Submitted:', formData);
  };

  const handleNewFormInputChange = (e) => {
    const { name, value } = e.target;
    setNewFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateSerialNo = (serialNo, originalSerialNo) => {
    const regex = new RegExp(`^${originalSerialNo}-\\d{2}$`);
    return regex.test(serialNo);
  };

  const handleNewFormSubmit = (e) => {
    e.preventDefault();
    const totalQuantity = parseFloat(formData.quantity);
    const newQuantity = parseFloat(newFormData.newQuantity);
    
    if (isNaN(totalQuantity) || isNaN(newQuantity)) {
      alert('Invalid quantity values.');
      return;
    }
    
    if (newQuantity > totalQuantity) {
      alert('Quantity cannot exceed the total quantity.');
      return;
    }
    
    const originalSerialNo = formData.serialNo;
    if (!validateSerialNo(newFormData.newSerialNo, originalSerialNo)) {
      setError(`Serial number must start with '${originalSerialNo}' followed by '-01', '-02', etc. (exactly two digits after hyphen).`);
      return;
    } else {
      setError('');
    }
    
    // Generate serial number and date
    const newSerialNo = newFormData.newSerialNo || `SN-${Date.now()}`;
    const currentDate = new Date().toLocaleDateString();
    
    // Update local storage
    const items = JSON.parse(localStorage.getItem('items')) || [];
    const updatedItems = items.map(item =>
      item.serialNo === serialNo
        ? { ...item, quantity: (totalQuantity - newQuantity).toString() }
        : item
    );
    localStorage.setItem('items', JSON.stringify(updatedItems));
    
    // Check for duplicate serial numbers
    const storedTableData = JSON.parse(localStorage.getItem('tableData')) || [];
    if (storedTableData.some(item => item.serialNo === newSerialNo)) {
      alert('Serial number already exists.');
      return;
    }
    
    // Add new form data to table
    const newTableData = [
      ...storedTableData,
      {
        ...newFormData,
        serialNo: newSerialNo,
        date: currentDate
      }
    ];
    
    // Sort table data by serial number
    newTableData.sort((a, b) => a.serialNo.localeCompare(b.serialNo));
    
    // Update state and local storage
    setTableData(newTableData);
    localStorage.setItem('tableData', JSON.stringify(newTableData));
  
    // Reset form states
    setShowNewForm(false); // Hide the new form
    setSerialNo(''); // Clear the serial number input
    setFormData({
      serialNo: '',
      date: '',
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
    });
    setNewFormData({
      newSerialNo: '',
      newCompanyName: '',
      newQuantity: '',
      newVehicleNo: '',
      newReceiverName: '',
      deliveryContact: '',
      newWorkerName: '',
      workerWage: '',
    });
  };
  


  const handleViewInfo = (data) => {
    setModalData(data);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalData(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Send Items</h1>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-gray-100 p-4 rounded shadow-md" onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-semibold">Serial No (سیریل نمبر)</label>
          <input
            type="text"
            value={serialNo}
            onChange={handleSerialNoChange}
            placeholder="Enter Serial No"
            className="p-1 border rounded text-sm"
          />
        </div>

        <div className="col-span-full flex flex-col md:grid md:grid-cols-2 md:gap-4">
          <div className="flex flex-col space-y-2">
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
            <label className="text-sm font-semibold">Company’s Name  (کمیٹی کا نام)</label>

            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              placeholder="Company’s Name"
              className="p-1 border rounded text-sm"
              disabled
            />
            <label className="text-sm font-semibold">Item Name  (سامان کا نام)</label>

            <input
              type="text"
              name="itemName"
              value={formData.itemName}
              onChange={handleInputChange}
              placeholder="Item Name"
              className="p-1 border rounded text-sm"
              disabled
            />
            <label className="text-sm font-semibold">Quantity  (مقدار)</label>

            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              placeholder="Quantity"
              className="p-1 border rounded text-sm"
              disabled
            />
            <label className="text-sm font-semibold">Packaging (پیکنگ)</label>

            <input
              type="text"
              name="packaging"
              value={formData.packaging}
              onChange={handleInputChange}
              placeholder="Packaging"
              className="p-1 border rounded text-sm"
              disabled
            />

             <label className="text-sm font-semibold">Extra Description  (اضافی تفصیل)</label>

            <textarea
              name="extraDescription"
              value={formData.extraDescription}
              onChange={handleInputChange}
              placeholder="Additional details..."
              className="p-1 border rounded text-sm"
              rows="3"
              disabled
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
              disabled
            />
            <label className="text-sm font-semibold">Room No  (کمرہ کا نمبر)</label>

            <input
              type="text"
              name="roomNo"
              value={formData.roomNo}
              onChange={handleInputChange}
              placeholder="Room No"
              className="p-1 border rounded text-sm"
              disabled
            />
            <label className="text-sm font-semibold">Floor No (منزل نمبر)</label>
            <input
              type="text"
              name="floorNo"
              value={formData.floorNo}
              onChange={handleInputChange}
              placeholder="Floor No"
              className="p-1 border rounded text-sm"
              disabled
            />
            <label className="text-sm font-semibold">Rack No  (ریک نمبر)</label>
            <input
              type="text"
              name="rackNo"
              value={formData.rackNo}
              onChange={handleInputChange}
              placeholder="Rack No"
              className="p-1 border rounded text-sm"
              disabled
            />
            <label className="text-sm font-semibold">Worker’s Name (مزدور کا نام)</label>
            <input
              type="text"
              name="workerName"
              value={formData.workerName}
              onChange={handleInputChange}
              placeholder="Worker’s Name"
              className="p-1 border rounded text-sm"
              disabled
            />
            <label className="text-sm font-semibold">Receiver Name (جس کو سامان بھیج رہے)</label>
            <input
              type="text"
              name="receiverName"
              value={formData.receiverName}
              onChange={handleInputChange}
              placeholder="Receiver Name"
              className="p-1 border rounded text-sm"
              disabled
            />
           
          </div>
        </div>

        <div className="col-span-full flex justify-center p-4">
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded text-sm w-80"
          >
            Show New Form
          </button>
        </div>
      </form>

      {showNewForm && (
        <>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-gray-100 p-4 rounded shadow-md" onSubmit={handleNewFormSubmit}>
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-semibold">New Serial No (Format: {formData.serialNo}-XX) (نیا سیریل نمبر (فارمیٹ: {formData.serialNo}-XX))</label>
              <input
                type="text"
                name="newSerialNo"
                value={newFormData.newSerialNo}
                onChange={handleNewFormInputChange}
                placeholder="New Serial No"
                className="p-1 border rounded text-sm"
              />
              <label className="text-sm font-semibold">Company’s Name (کمپنی کا نام) </label>
              <input
                type="text"
                name="newCompanyName"
                value={newFormData.newCompanyName}
                onChange={handleNewFormInputChange}
                placeholder="Company’s Name"
                className="p-1 border rounded text-sm"
              />
              <label className="text-sm font-semibold">Quantity (Total: {formData.quantity})  (مقدار (مجموع: {formData.quantity}))</label>

              <input
                type="number"
                name="newQuantity"
                value={newFormData.newQuantity}
                onChange={handleNewFormInputChange}
                placeholder="Quantity"
                className="p-1 border rounded text-sm"
              />
              {newFormData.newQuantity && parseFloat(newFormData.newQuantity) > parseFloat(formData.quantity) && (
                <p className="text-red-500 text-sm">Quantity cannot exceed the total quantity.</p>
              )}
              <label className="text-sm font-semibold">Vehicle No (گاڑی  نمبر)  </label>

              <input
                type="text"
                name="newVehicleNo"
                value={newFormData.newVehicleNo}
                onChange={handleNewFormInputChange}
                placeholder="Vehicle No"
                className="p-1 border rounded text-sm"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-semibold">Receiver Name (جس کو سامان بھیجنا ہے)</label>
              <input
                type="text"
                name="newReceiverName"
                value={newFormData.newReceiverName}
                onChange={handleNewFormInputChange}
                placeholder="Receiver Name"
                className="p-1 border rounded text-sm"
              />
              <label className="text-sm font-semibold">Delivery Contact (موبائل نمبر)</label>
              <input
                type="text"
                name="deliveryContact"
                value={newFormData.deliveryContact}
                onChange={handleNewFormInputChange}
                placeholder="Delivery Contact"
                className="p-1 border rounded text-sm"
              />
              <label className="text-sm font-semibold">Worker’s Name (مزدور کا نام)</label>
              <input
                type="text"
                name="newWorkerName"
                value={newFormData.newWorkerName}
                onChange={handleNewFormInputChange}
                placeholder="Worker’s Name"
                className="p-1 border rounded text-sm"
              />
              <label className="text-sm font-semibold">Worker’s Wage  (مزدور کا تنخواہ)</label>

              <input
                type="number"
                name="workerWage"
                value={newFormData.workerWage}
                onChange={handleNewFormInputChange}
                placeholder="Worker’s Wage"
                className="p-1 border rounded text-sm"
              />
            </div>
            <div className="col-span-full flex justify-center p-4">
              <button
                type="submit"
                className="bg-green-500 text-white p-2 rounded text-sm w-80"
              >
                Send Item
              </button>
            </div>
          </form>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {tableData.length > 0 && (
            <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
              <thead className="bg-blue-950 text-white">
                <tr>
                  <th className="p-1 border border-gray-300">Serial No (سیریل نمبر) </th>
                  <th className="p-1 border border-gray-300">Date  (تاریخ)</th>
                  <th className="p-1 border border-gray-300">Company Name  (کمیپنی کا نام)</th>
                  <th className="p-1 border border-gray-300">Quantity Sent (جتنا سامان بھیجا ہے) </th>
                  <th className="p-1 border border-gray-300">Vehicle No  (گاڑی نمبر)</th>
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
                    <td className="border border-gray-300 p-1 space-x-1 flex justify-center text-xs">
                      <button
                        onClick={() => handleViewInfo(item)}
                        className="bg-blue-500 text-white p-1 rounded text-xs mr-2"
                      >
                        View Info
                      </button>
                      <button
                        onClick={() => handleDelete(item.serialNo)}
                        className="bg-red-500 text-white p-1 rounded text-xs mr-2"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => generatePDF(item)}
                        className="bg-green-500 text-white p-1 rounded text-xs ml-2"
                      >
                        Print PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
)}


        </>
      )}

      {showModal && modalData && (
        <PopupModal
          data={modalData}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default SendItems;
