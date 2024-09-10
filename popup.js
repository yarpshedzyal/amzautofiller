document.getElementById('copyBtn').addEventListener('click', async () => {
  console.log("Copy button clicked");  // Log when the button is clicked
  // Send a message to content.js to get order info
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: copyOrderInfo
    }, (result) => {
      if (chrome.runtime.lastError) {
        console.error("Error executing content script:", chrome.runtime.lastError);
      } else {
        console.log("Content script executed successfully");
      }
    });
  });
});

document.getElementById('pasteBtn').addEventListener('click', async () => {
  console.log("Paste button clicked");  // Log when the button is clicked
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
  try {
    let orderInfo = {
      order_id: document.querySelector('#MYO-app > div > div.a-row.a-spacing-medium > div.a-column.a-span10 > div > div:nth-child(1) > div.a-row.a-spacing-mini > div > span.a-text-bold').innerText,
      asin: document.querySelector('#MYO-app > div > div.a-row.a-spacing-medium > div.a-column.a-span10 > div > div.a-row.a-spacing-large > div > table > tbody > tr > td:nth-child(3) > div > div:nth-child(2) > div > b').innerText,
      price: document.querySelector('#MYO-app > div > div.a-row.a-spacing-medium > div.a-column.a-span10 > div > div.a-row.a-spacing-large > div > table > tbody > tr > td:nth-child(7) > div > table.a-normal.a-spacing-none > tbody > div:nth-child(3) > div.a-column.a-span6.a-text-right.no-right-margin > span').innerText,
      qty: document.querySelector('#MYO-app > div > div.a-row.a-spacing-medium > div.a-column.a-span10 > div > div.a-row.a-spacing-large > div > table > tbody > tr > td:nth-child(5)').innerText,
      phone: document.querySelector('#MYO-app > div > div.a-row.a-spacing-medium > div.a-column.a-span10 > div > div:nth-child(2) > div.a-column.a-span5.a-span-last > div > div > div > div > div:nth-child(2) > div > table > tbody > div > tr > td.a-text-left.a-align-bottom').innerText
    };

    // Log the copied order info
    console.log("Order info copied:", orderInfo);
    
    // Store the order info in local storage
    chrome.storage.local.set({ orderInfo });
  } catch (error) {
    console.error("Error copying order info:", error);
  }
}

// Function to paste the order info to Google Sheets
function pasteOrderInfoToSheet() {
  chrome.storage.local.get('orderInfo', (result) => {
    const orderInfo = result.orderInfo;
    if (orderInfo) {
      console.log("Pasting order info:", orderInfo);
      // Example of pasting the info to Google Sheets (adjust according to actual page structure)
      document.querySelector('[name="order_id"]').value = orderInfo.order_id;
      document.querySelector('[name="asin"]').value = orderInfo.asin;
      document.querySelector('[name="price"]').value = orderInfo.price;
      document.querySelector('[name="qty"]').value = orderInfo.qty;
      document.querySelector('[name="phone"]').value = orderInfo.phone;
    } else {
      console.log("No order info found in storage");
    }
  });
}
