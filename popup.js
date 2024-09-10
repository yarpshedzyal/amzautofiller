document.getElementById('copyBtn').addEventListener('click', async () => {
  console.log("Copy button clicked");

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: copyOrderInfo
    }, (result) => {
      if (chrome.runtime.lastError) {
        console.error("Error executing content script:", chrome.runtime.lastError);
      } else {
        console.log("Order info copied successfully");
      }
    });
  });
});

document.getElementById('pasteBtn').addEventListener('click', async () => {
  console.log("Paste button clicked");

  chrome.storage.local.get('orderInfo', (data) => {
    if (data.orderInfo) {
      console.log("Pasting order info:", data.orderInfo);

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: pasteOrderInfoToSheet,
          args: [data.orderInfo]
        }, () => {
          if (chrome.runtime.lastError) {
            console.error("Error pasting to Google Sheets:", chrome.runtime.lastError);
          } else {
            console.log("Order info pasted successfully");
          }
        });
      });
    } else {
      console.error("No order info found in storage");
    }
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

    chrome.storage.local.set({ orderInfo });
    console.log("Order info stored:", orderInfo);

    return orderInfo;
  } catch (error) {
    console.error("Error copying order info:", error);
  }
}

// Function to simulate pasting order info into Google Sheets
function pasteOrderInfoToSheet(orderInfo) {
  try {
    console.log("Pasting the following info:", orderInfo);

    // Create a string with tab-separated values to simulate row insertion in Google Sheets
    const infoToPaste = `${orderInfo.order_id}\t${orderInfo.asin}\t${orderInfo.price}\t${orderInfo.qty}\t${orderInfo.phone}`;

    // Create a temporary textarea element to hold the text for clipboard operations
    const tempTextArea = document.createElement('textarea');
    document.body.appendChild(tempTextArea);
    tempTextArea.value = infoToPaste;
    tempTextArea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextArea);

    console.log("Order info copied to clipboard");

    // Simulate pasting the content in Google Sheets using keyboard shortcuts
    document.execCommand('paste');
    console.log("Order info pasted successfully into Google Sheets");

  } catch (error) {
    console.error("Error pasting order info into Google Sheets:", error);
  }
}
