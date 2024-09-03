chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "copyOrderInfo") {
      let orderInfo = {
        customerName: document.querySelector('#customerName').innerText,
        address: document.querySelector('#shippingAddress').innerText
      };
      chrome.storage.local.set({ orderInfo });
      sendResponse({ success: true });
    }
  });
  