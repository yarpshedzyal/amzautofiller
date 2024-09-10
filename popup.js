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
    order_id: document.querySelector('#MYO-app > div > div.a-row.a-spacing-medium > div.a-column.a-span10 > div > div:nth-child(1) > div.a-row.a-spacing-mini > div > span.a-text-bold').innerText,
    asin: document.querySelector('#MYO-app > div > div.a-row.a-spacing-medium > div.a-column.a-span10 > div > div.a-row.a-spacing-large > div > table > tbody > tr > td:nth-child(3) > div > div:nth-child(2) > div > b').innerText,
    price: document.querySelector('#MYO-app > div > div.a-row.a-spacing-medium > div.a-column.a-span10 > div > div.a-row.a-spacing-large > div > table > tbody > tr > td.a-text-right > span').innerText,
    qty: document.querySelector('#MYO-app > div > div.a-row.a-spacing-medium > div.a-column.a-span10 > div > div.a-row.a-spacing-large > div > table > tbody > tr > td:nth-child(5)').innerText,
    phone: document.querySelector('#MYO-app > div > div.a-row.a-spacing-medium > div.a-column.a-span10 > div > div:nth-child(2) > div.a-column.a-span5.a-span-last > div > div > div > div > div:nth-child(2) > div > table > tbody > div > tr > td.a-text-left.a-align-bottom').innerText
  };
  
  chrome.storage.local.set({ orderInfo });
}

// Function to paste the order info to Google Sheets
function pasteOrderInfoToSheet() {
  chrome.storage.local.get('orderInfo', (result) => {
    const orderInfo = result.orderInfo;
    if (orderInfo) {
      // Example of pasting the info to Google Sheets
      // Note: You need to adapt these selectors to match the specific Google Sheets structure
      document.querySelector('[name="AMZ ID [order_id]"]').value = orderInfo.order_id;
      document.querySelector('[name="ASIN [asin]"]').value = orderInfo.asin;
      document.querySelector('[name="AMZ Order Price [price]"]').value = orderInfo.price;
      document.querySelector('[name="Quantity [qty]"]').value = orderInfo.qty;
      document.querySelector('[name="Phone AMZ [phone]"]').value = orderInfo.phone;
    }
  });
}
