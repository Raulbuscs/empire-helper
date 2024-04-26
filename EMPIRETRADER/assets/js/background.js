chrome.runtime.onInstalled.addListener(function() {
    // Master
    chrome.storage.sync.set({ masterSwitch: true });
    chrome.storage.sync.set({ userName: 'User' });

    // Pricing
    chrome.storage.sync.set({ pricingList64: true });
    chrome.storage.sync.set({ pricingList62: false });

    // Deposit
    chrome.storage.sync.set({ depoAutoaccept: true });
    chrome.storage.sync.set({ depoAutoacceptMessage: true });
    chrome.storage.sync.set({ depoAutoacceptSuccesMessage: true });

    // Withdraw
    chrome.storage.sync.set({ withAutotrade: false });
    chrome.storage.sync.set({ tradeCustomFilter: false });
    chrome.storage.sync.set({ tradeBuyListFilter: true });
    chrome.storage.sync.set({ maxRoll: 7 });
    chrome.storage.sync.set({ maxMarkt: 0 });
    chrome.storage.sync.set({ fixDelay: 200 });
    chrome.storage.sync.set({ randomDelay: 150 });
    chrome.storage.sync.set({ withAutobuy: false });
    chrome.storage.sync.set({ fixBuyButtonDelay: 200 });
    chrome.storage.sync.set({ randomButtonDelay: 150 });
});
  
let cache = {
    data: null,
    timestamp: Date.now()
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "priceProvider") {
        const json_url = 'https://butrosgroot.com/rolltrader/api/skins_prices';
        const now = Date.now();
        const oneHour = 60 * 60 * 1000; // in milliseconds

        if (cache.data && (now - cache.timestamp < oneHour)) {
            sendResponse(cache.data);
        } else {
            fetch(json_url)
                .then(response => response.json())
                .then(data => {
                    cache.data = data;
                    cache.timestamp = now;
                    sendResponse(data);
                })
                .catch(error => console.log(error));
        }
        return true; // keeps the message channel open until sendResponse is called
    } else if (request.action === "getSetting") {
        chrome.storage.sync.get(request.key, function(result) {
            sendResponse(result);
        });
        return true;
    } else if (request.action === "setSetting") {
        var data = {};
        data[request.key] = request.value;
        chrome.storage.sync.set(data, function() {
            sendResponse();
        });
        return true;
    }
});