// CONFIG
webhook = 'https://discord.com/api/webhooks/1101902713547141140/8ofBEgSJqeXIrUGq4DT9aru4JncPePu-AQk2crwSwE94MR2tHXm4rU1NVGYfieClkezG'
do_not_send_message = []

chrome.storage.sync.get('depoAutoaccept', function(result) {
    depoAutoAccept = result.depoAutoaccept;
    console.log('WITH DEPOAUTOACCEPT setting:', depoAutoAccept);
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (namespace === 'sync' && changes.depoAutoaccept) {
        depoAutoAccept = changes.depoAutoaccept.newValue;
        console.log('DEPO AUTOACCEPT setting changed to:', depoAutoAccept);
    }
});

chrome.storage.sync.get('depoAutoacceptMessage', function(result) {
    depoAutoAcceptNotify = result.depoAutoacceptMessage;
    console.log('WITH DEPOAUTOACCEPT setting:', depoAutoAcceptNotify);
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (namespace === 'sync' && changes.depoAutoacceptMessage) {
        depoAutoAcceptNotify = changes.depoAutoacceptMessage.newValue;
        console.log('DEPO AUTOACCEPT setting changed to:', depoAutoAcceptNotify);
    }
});

chrome.storage.sync.get('depoAutoacceptSuccesMessage', function(result) {
    transactionCompleteNotify = result.depoAutoacceptSuccesMessage;
    console.log('WITH depoAutoacceptSuccesMessage setting:', transactionCompleteNotify);
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (namespace === 'sync' && changes.depoAutoacceptSuccesMessage) {
        transactionCompleteNotify = changes.depoAutoacceptSuccesMessage.newValue;
        console.log('DEPO AUTOACCEPT setting changed to:', transactionCompleteNotify);
    }
});

chrome.storage.sync.get('userName', function(result) {
    username_message = result.userName;
    console.log('WITH depoAutoacceptSuccesMessage setting:', username_message);
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (namespace === 'sync' && changes.userName) {
        username_message = changes.userName.newValue;
        console.log('DEPO AUTOACCEPT setting changed to:', username_message);
    }
});

//-----------------------------------

const itemInfo = {};
var pricesList = {};

var sendWebHookDiscord = (webhookType, urlDiscordWebhook = webhook, scrapedData = {} ,embeds = []) => {
    const url = urlDiscordWebhook
    const templateWebhook = {
        "areYouReady": {
            "username": `DEPOSIT`,
            "avatar_url": 'https://pbs.twimg.com/profile_images/1610084878720049154/n0j4nld9_400x400.png',
            "content": ``,
            "embeds": [
                {
                    "title": `Ready to deliver!`,
                    "description": `Account: ` + username_message + `, Send the item!
                    <@302836382970413056>`,
                    "color": 0,
                    "fields": [
                        {
                            "name": "ITEM: ",
                            "value": scrapedData.weapon
                        }
                    ]
                }
            ]
        },
        "IncommingTrade": {
            "username": `WITHDRAW`,
            "avatar_url": 'https://pbs.twimg.com/profile_images/1610084878720049154/n0j4nld9_400x400.png',
            "content": ``,
            "embeds": [
                {
                    "title": `Item Withdrawn!`,
                    "description": `Account: ` + username_message + `, Accept the item!
                    <@302836382970413056>`,
                    "color": 0,
                    "fields": [
                        {
                            "name": "ITEM: ",
                            "value": scrapedData.weapon
                        }
                    ],
                    "image": {
                        "url": ''
                    }
                }
            ]
        },
        "CompletedTrade": {
            "username": `DEPOSIT_complete`,
            "avatar_url": 'https://pbs.twimg.com/profile_images/1610084878720049154/n0j4nld9_400x400.png',
            "content": ``,
            "embeds": [
                {
                    "title": `Trade completed!`,
                    "description": `Account: ` + username_message + `, item has been accepted
                    <@302836382970413056>`,
                    "color": 0,
                    "fields": [
                        {
                            "name": "coins: ",
                            "value": scrapedData.coin_value
                        }
                    ],
                    "image": {
                        "url": ''
                    }
                }
            ]
        }
    }
    let params = templateWebhook[webhookType]

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': "application/json",
        },
        body: JSON.stringify(params)
    })
}

// BUTTONS
const createButtonLoadMore = () => {
    const button = document.createElement('button')
    button.classList.add("loadMoreButton")
    button.style.fontFamily = "Flama,Roboto,Helvetica Neue,sans-serif;"
    button.style.color = "#000000"
    button.style.background = "#e0cf4c"
    button.style.margin = "6px"
    button.style.padding = "0 20px"
    button.style.lineHeight = "42px"
    button.style.fontWeight = "bold"
    button.style.border = "solid #21252b 3px"
    button.style.borderRadius = "10px"
    const buttonText = document.createTextNode('LOAD MORE')
    button.appendChild(buttonText)

    return button
}

const createButtonRearrange = () => {
    const button = document.createElement('button')
    button.classList.add("rearrangeButton")
    button.style.fontFamily = "Flama,Roboto,Helvetica Neue,sans-serif;"
    button.style.color = "#000000"
    button.style.background = "#e0cf4c"
    button.style.margin = "6px"
    button.style.padding = "0 20px"
    button.style.lineHeight = "42px"
    button.style.fontWeight = "bold"
    button.style.border = "solid #21252b 3px"
    button.style.borderRadius = "10px"
    const buttonText = document.createTextNode('REARRANGE')
    button.appendChild(buttonText)

    return button
}

// CREATE BUTTONS
const loadMoreButton = createButtonLoadMore()
const rearrangeButton = createButtonRearrange()

// PLACE BUTTONS INTO THE MAIN HEADER
const intFindPlaceForButtons = setInterval(async function() {
    const mainHeader = document.querySelector("div#nav-1")

    if (mainHeader) {
        clearInterval(intFindPlaceForButtons)
        mainHeader.appendChild(loadMoreButton)
        mainHeader.appendChild(rearrangeButton)
    }
}, 50)


// ADD EVENT LISTENERS FOR BUTTONS
const intAddEventListeners = setInterval(async function(){

    let loadMoreBtn = document.getElementsByClassName('loadMoreButton')[0]
    let rearrangeBtn = document.getElementsByClassName('rearrangeButton')[0]

    if (loadMoreBtn && rearrangeBtn){
        clearInterval(intAddEventListeners)

        // Event listener for cancel depo button
        loadMoreBtn.addEventListener("click", function() {
            // de-list script
            console.log('click')
            var button = document.querySelector("button.btn-primary.pop.flex.rounded.text-dark-5.mb-lg > span > div > span")
            console.log(button)

            button.click()
        })

        // Event listener for rearrange button
        rearrangeBtn.addEventListener('click', async function() {
            let marketItems = []
            marketItems = document.getElementsByClassName("selectable")
            
            let marketItemsArray = Array.from(marketItems);

            console.log(marketItemsArray)

            // Function to extract the numeric discount value
            function getNumericDiscount(element) {
                let discountElement = element.querySelector(".discount");
                if (discountElement) {
                    // Extract the numeric part of the discount text
                    let rawText = discountElement.textContent.trim();
                    let numericText = rawText.match(/-?\d+(\.\d+)?/g);
                    return numericText ? parseFloat(numericText[0]) : Infinity; // Default to Infinity if no valid number
                }
                return Infinity; // Default to Infinity if no discount class
            }
            
            // Sort market items based on the numeric discount
            marketItemsArray.sort((a, b) => getNumericDiscount(a) - getNumericDiscount(b));

            // Output the sorted items and the extracted discount values for verification
            marketItemsArray.forEach((item, index) => {
                let discountElement = item.querySelector(".discount");
                let discountText = discountElement ? discountElement.textContent.trim() : "No Discount";
                console.log(`Item ${index + 1}: Discount ${discountText}`);
            });
            console.log(marketItemsArray)

            // Step 1: Select the grid container
            let grid = document.querySelector("div.items-grid");

            // Step 2: Clear existing children from the grid
            while (grid.firstChild) {
                grid.removeChild(grid.firstChild);
            }

            // Step 3: Append the ordered elements to the grid
            marketItemsArray.forEach(item => {
                grid.appendChild(item);
            });

            // Optionally, verify that the children have been replaced correctly
            console.log("New grid children:", grid.children.length); // Should match the length of marketItemsArray
        })
    }
},50)

// Helper function to get an element from the DOM
function querySelector(selector) {
    return document.querySelector(selector);
}

// Function to handle deposit auto-accept and DC notification
function handleDepositAutoAccept(popup) {
    let depoReadyBtn = popup.querySelector("cw-deposit-joined-dialog button");
    if (depoReadyBtn && depoAutoAccept) {
        depoReadyBtn.click();
        
        if (depoAutoAcceptNotify) {
            const intLookForScrape = setInterval(() => {
                let weaponName = querySelector("cw-csgo-market-item-card > div > div > div.flex-1 > label");
                console.log('weaponName', weaponName)
                if (weaponName) {
                    clearInterval(intLookForScrape);
                    itemInfo.weapon = weaponName.innerText;
                    sendWebHookDiscord('areYouReady', webhook, itemInfo);
                }
            }, 1000);
        }
    }
}

// Function to handle incoming trade notifications
function handleIncomingTradeNotification(popup) {
    let offersBtnIncomming = querySelector("cw-withdraw-processing-dialog > mat-dialog-actions > a > span.mat-button-wrapper > span");
    if (offersBtnIncomming && withdrawNotify) {
        let tradeInfo = querySelector("cw-withdraw-processing-dialog > mat-dialog-content > cw-item");
        itemInfo.weapon = tradeInfo.innerText;
        sendWebHookDiscord('IncommingTrade', webhook, itemInfo);
    }
}

// Function to handle completed trade notifications
function handleCompletedTradeNotification(popup) {
    let offersBtnComplete = querySelector("cw-deposit-complete-dialog > mat-dialog-actions > button");
    if (offersBtnComplete && transactionCompleteNotify) {
        offersBtnComplete.click();
        let coin_value = querySelector("cw-deposit-complete-dialog > mat-dialog-content > p > cw-pretty-balance > span").innerText;
        itemInfo.coin_value = coin_value;
        sendWebHookDiscord('CompletedTrade', webhook, itemInfo);
    }
}

// Main interval function to look for popups
const intLookForPopup = setInterval(() => {
    let popup = querySelector("body > div.cdk-overlay-container");
    if (popup) {
        handleDepositAutoAccept(popup);
        handleIncomingTradeNotification(popup);
        handleCompletedTradeNotification(popup);
    }
}, 15000);
