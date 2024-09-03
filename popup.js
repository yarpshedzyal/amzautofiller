document.getElementById('copyBtn').addEventListener('click', async () => {
    // Send a message to content.js to get order info
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: copyOrderInfo
      });
    });
  });
  
  document.getElementById('pasteBtn').addEventListener('click', async () => {
    // Paste the buffer into Google Sheets
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: pasteOrderInfoToSheet
      });
    });
  });
  
  // Function to copy order info from the Amazon page
  function copyOrderInfo() {
    let orderInfo = {
      customerName: document.querySelector('#customerName').innerText, // adjust selectors
      address: document.querySelector('#shippingAddress').innerText
    };
    
    chrome.storage.local.set({ orderInfo });
  }
  
  // Function to paste the order info to Google Sheets
  function pasteOrderInfoToSheet() {
    chrome.storage.local.get('orderInfo', (result) => {
      const orderInfo = result.orderInfo;
      if (orderInfo) {
        // Paste into Google Sheets cells (adapt according to page structure)
        document.querySelector('[name="customerNameCell"]').value = orderInfo.customerName;
        document.querySelector('[name="addressCell"]').value = orderInfo.address;
      }
    });
  }
  