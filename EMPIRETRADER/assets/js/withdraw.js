let excludedItemsFrom62 = ['Knife','Daggers','Gloves','Wraps','Doppler','CS:GO','Battle-Scarred','Well-Worn'];
var pricesList;
var do_not_withdraw = [];
var do_not_withdraw_short = [];
var elements = [];
var conditions = [];
var withdraw_list = [];
var withdraw_list_st = [];
var excludeItems = [];
var master_switch;
var auto_trader;

let blue = '\x1b[36m%s\x1b[0m';
let yellow = '\x1b[33m%s\x1b[0m';

chrome.storage.sync.get('masterSwitch', function(result) {
    master_switch = result.masterSwitch;
    console.log('MASTERSWITCH setting:', master_switch);

    if (master_switch) {
        setTimeout(() => {
            getPriceProvider();
            itemScannerStarter();
            itemScannerTradeBarStarter()
        }, 100);
    }
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (namespace === 'sync' && changes.masterSwitch) {
        master_switch = changes.masterSwitch.newValue;
        console.log('MASTERSWITCH setting changed to:', master_switch);

        if (master_switch) {
            getPriceProvider();
            itemScannerStarter();
            itemScannerTradeBarStarter()
        }
    }
});

function log(c,str){
    console.log(c,str)
}

// send msg for price provider response
function getPriceProvider() {
    chrome.runtime.sendMessage({ type: 'priceProvider' }, response => {
        pricesList = response;
    });
}

function waitForValue(variable, callback, node) {
    if (variable) {
        callback(node);
    } else {
        setTimeout(function() {
            waitForValue(variable, callback, node);
        }, 50); // wait for 10 milliseconds before checking again
    }
}

function waitForItemGrid(callback) {
    const itemsGrid = document.querySelector("div.items-grid");
    console.log(itemsGrid);

    if (itemsGrid != null) {
        callback(itemsGrid);
    } else {
        setTimeout(function() {
            waitForItemGrid(callback);
        }, 50); // wait for 10 milliseconds before checking again
    }
}

function itemScannerStarter() {
    // add an event listener for changes to the DOM
    waitForItemGrid(function(itemsGrid) {
        itemScanner(itemsGrid);
    });
}

function itemScanner(itemsGrid) {
    console.log("running itemScanner(): ", itemsGrid);

    if (itemsGrid) {
        try {
            new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    try {
                        mutation.addedNodes.forEach(function (node) {
                            if (node.tagName === 'DIV' && !node.classList.contains('selectable')) {
                                node.classList.add('selectable');
                                console.log(node);

                                waitForValue(pricesList, function(node) {
                                    console.log(node)
                                    setBuffValue(node);
                                }, node);
                            }
                        });
                    } catch (error) {
                        console.error('Error processing mutation:', error);
                    }
                });
            }).observe(itemsGrid, {childList: true});
        } catch (error) {
            console.error('Error creating MutationObserver:', error);
        }
    }
}

function itemScannerTradeBarStarter() {
    const waitForItemGrid = async () => {
        let itemsGrid;
        while (!itemsGrid) {
            itemsGrid = document.querySelector("cw-trade-sidebar > cw-selected-sidebar-items, cw-trade-sidebar");
            await new Promise((resolve) => setTimeout(resolve, 200));
        }
        return itemsGrid;
    };

    const tradeGridScanner = (tradeGrid) => {
        console.log("running tradeGridScanner()");
        console.log("tradeGrid real itemgrid: ", tradeGrid);

        if (!tradeGrid) return;

        tradeGridBasic = tradeGrid.querySelector("cw-selected-sidebar-items");

        console.log("tradeGridBasic real itemgrid: ", tradeGridBasic);

        if (tradeGridBasic) {
            tradeGrid = tradeGridBasic
        };

        try {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        console.log("running tradeGridScanner new item");
                        console.log("node: ", node);
                        if (node.tagName === "DIV" || node.tagName === "CW-DEPOSIT-LISTED" || node.tagName === "CW-DEPOSIT-PROCESSING" || node.tagName === "CW-WITHDRAW-PROCESSING" || node.tagName === "CW-WITHDRAW-JOINED") {
                            console.log(node);
                            setBuffValueTradeBar(node);

                            if (tradeGridBasic) {
                                let withdrawList = tradeGridBasic.querySelector("cw-scroll > div > div")
                                itemScannerTradeBar(withdrawList);
                            }
                        }
                    });
                });
            });

            observer.observe(tradeGrid, { childList: true });
        } catch (error) {
            console.error("Error creating MutationObserver: ", error);
        }
    };

    const itemScannerTradeBar = (itemsGrid) => {
        console.log("running itemScannerTradeBar()");
        console.log("itemsGrid: ", itemsGrid);
  
        if (!itemsGrid) return;
  
        try {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        console.log("running itemScannerTradeBar new item");
        
                        if (node.tagName === "DIV") {
                            console.log(node);
                            setBuffValueTradeBar(node);
                        }
                    });
                });
            });
    
            observer.observe(itemsGrid, { childList: true });
        } catch (error) {
            console.error("Error creating MutationObserver: ", error);
        }
    };

    waitForItemGrid().then((itemsGrid) => {
        tradeGridScanner(itemsGrid);

        const tradeSidebar = document.querySelector("cw-trade-sidebar");
        if (tradeSidebar) {
            const tradeGrid = tradeSidebar.querySelector("cw-scroll > div");
            const items = tradeGrid?.querySelectorAll("cw-item");
            if (items) {
                items.forEach((item) => {
                    console.log("node: ", item);
                    setBuffValueTradeBar(item);
                });
            }
        }
    
        console.log("tradeSidebar: ", tradeSidebar);
        const observer = new MutationObserver(() => {
            console.log("Change detected in cw-trade-sidebar. Rerunning itemScannerTradeBarStarter...");
            const skinTradeList = document.querySelector("cw-trade-sidebar > cw-selected-sidebar-items, cw-trade-sidebar");
            if (skinTradeList) {

                const tradeGrid = skinTradeList.querySelector("cw-scroll > div > div");
                if (tradeGrid) {
                    tradeGridScanner(tradeGrid);
                }

                const tradeGrid2 = skinTradeList.querySelector("cw-scroll > div");
                if (tradeGrid2) {
                    tradeGridScanner(tradeGrid2);

                    const items = tradeGrid2.querySelectorAll("cw-deposit-listed");
                    if (items) {
                        items.forEach((item) => {
                            console.log("node: ", item);
                            setBuffValueTradeBar(item);
                        });
                    }
                }
            }
        });
        observer.observe(document.querySelector("cw-trade-sidebar"), { childList: true });
    });
}

function drawCustomForm(calcRes, calc, buffVal) {
    const grandForm = document.createElement("div");
    const searchItem = document.createElement("div");

    grandForm.classList.add("custom-search-grid");
    searchItem.classList.add("custom-search-grid-items");
    grandForm.appendChild(searchItem);

    var price = document.createElement("div");
    price.classList.add("buff-price")
    price.innerHTML += buffVal

    var n = document.createElement("div");
    n.classList.add("price-detail-info");
    n.appendChild(price)

    var a = document.createElement("div");
    a.classList.add("square-info");
    a.classList.add("red-square");

    var r = document.createElement("div");
    r.classList.add("price-detail-info");
    r.classList.add("discount");
    r.appendChild(a);
    r.style.color = "#cd0a0a";
    r.innerHTML += "🔴 " + calc + " %";

    var o = document.createElement("div");
    o.classList.add("price-detail-info");
    o.classList.add("discount");

    var i = document.createElement("div");
    i.classList.add("square-info");
    i.classList.add("green-square");

    o.appendChild(i);
    o.style.color = '#00C74D';
    o.innerHTML += "🟢 " + calc + " %";

    var c = document.createElement("div");
    c.classList.add("price-detail-info");
    c.classList.add("discount");

    var s = document.createElement("div");
    s.classList.add("square-info");
    s.classList.add("red-square");

    c.appendChild(s);
    c.style.color = "#0078D7";
    c.innerHTML += "🔵 " + calc + " %";

    if (calcRes == 'Overpriced')  n.appendChild(r);
    if (calcRes == 'Goodpriced')  n.appendChild(o);
    if (calcRes == 'Underpriced') n.appendChild(c);

    grandForm.appendChild(n);
    return grandForm;
}


function setBuffValue(item) {
    var itemInfo = {};
    let itemName = '';
    let isun66, is066 = false;
    let isSticker = false;

    //  weapon type
    itemInfo.skinWeapon = item.querySelector("div.my-sm.flex.h-full > div.relative.mb-sm.flex > div > p.size-small.font-bold").innerHTML.trim()
    console.log('skinWeapon: ', itemInfo.skinWeapon)
    if(itemInfo.skinWeapon === 'Sticker'){
        isSticker = true;
        itemName += 'Sticker | ';
    }
    else itemName += itemInfo.skinWeapon;

    // skin name
    if (item.querySelector("div.my-sm.flex.h-full > div.relative.mb-sm.flex > div > p.size-medium.font-bold.text-light-1")) {

        if (isSticker){
            let skin = item.querySelector("cw-csgo-market-item-card > div > div > label").innerHTML.trim()
            itemName += skin;
        }

        else {
            let skin = item.querySelector("div.my-sm.flex.h-full > div.relative.mb-sm.flex > div > p.size-medium.font-bold.text-light-1").innerHTML.trim()
            let nameArr = skin.split(' ')
            let f = nameArr[0]
            let s = nameArr[1]


            // broken code need to fix
            /*
            // if doppler has a phase
            if (f == 'Doppler'){
                itemInfo.skinName = 'Doppler'
                itemName += " | " + 'Doppler'
                var phase = s + ' ' + nameArr[2]
            }

            // if doppler is a gem
            else if ((nameArr.length === 1) && (f == 'Ruby' || f == 'Sapphire')){
                itemInfo.skinName = f
                itemName += " | " + 'Doppler'
                if (s == 'Pearl') phase = skin
                else var phase = f
            }
            
            // if doppler is a gamma doppler
            else if (f == 'Gamma' && s == 'Doppler'){
                itemInfo.skinName = f + ' ' + s
                itemName += " | " + 'Gamma Doppler'
                var phase = nameArr[2] + ' ' + nameArr[3]
            }
            
            // if gamma doppler is a gem -> emerald
            else if ((nameArr.length === 1) && f == 'Emerald'){
                itemInfo.skinName = f
                itemName += " | " + 'Gamma Doppler'
                var phase = 'Emerald'
            }
            */

            //if item is case / pin -> not every item is added yet
            if (itemInfo.skinWeapon.includes('Case') ||
                itemInfo.skinWeapon.includes('Pin')){
                // continue
            }

            else if (!skin) {
                // continue
            }

            else{
                itemInfo.skinName = skin
                itemName += " | " + skin
            }
        }
    }

    // skin exterior (for selectable)
    let exterior = item.querySelector("p.size-small.font-bold").innerHTML.trim()
    console.log('exterior: ', exterior)

    if (isSticker){
        itemInfo.skinExterior = ' ('+ exterior + ')'
        let nameArr = itemName.split(' ')
        let f = 0
        for (let i=0; i<nameArr.length;i++){
            if (nameArr[i] === '|'){
                f++;
                if(f === 2){
                    nameArr[i-1] += itemInfo.skinExterior;
                    break;
                }
            }
        }
        itemName = nameArr.join(' ')
    }

    else{
        // if ("Doppler" in itemName){
        //     itemName += " (" + exterior + ")";
        //     console.log(itemName)
        // } else {
        //     itemName += " (" + exterior + ")";
        //     console.log(itemName)
        // }
        itemName += " (" + exterior + ")";
        console.log(itemName)
    }

    // ======================== PRICING ========================
    // USED TO CALCULATE PRICE => BUFF163 STARTING_AT VALUE (usd)
    // this value is not the best indicator of the correct price
    // so some pricings might be highly inaccurate

    // ========================== API ==========================
    // prices.csgotrader.app/latest/prices_v6.json
    // https://csgotrader.app/prices/

    //log(itemName)
    let priceInfo

    if (itemName.includes('StatTrak') && itemName.includes('Knife')) {
        itemNamStatTrak = itemName.replace('★ StatTrak™', '★');
        priceInfo = pricesList[itemNamStatTrak];
    } else {
        priceInfo = pricesList[itemName];
    }

    console.log(priceInfo)

    // if the constructed name of skin was not found in the JSON price file go to next item
    if (priceInfo === undefined) return;

    try {
        empirePrice_full = item.querySelector('.font-numeric.inline-flex span:nth-of-type(2)').innerText;
        empirePrice_full = empirePrice_full.replace(/[,.]/g, ""); // This replaces both commas and dots with an empty string
    } catch (e) {
        console.log('error empirePrice method one: ', e)
        try {
            empirePrice_full = item.querySelector('.font-numeric.inline-flex span:nth-of-type(2)').innerText.replace(',', '');
            empirePrice_full = empirePrice_full.replace(/[,.]/g, ""); // This replaces both commas and dots with an empty string
        } catch (error) {
            console.log('error empirePrice method two: ', error)
            empirePrice_full = undefined;
        }
    }

    let rollpercent_calc;

    if (empirePrice_full != undefined) {
        try {
            empirePrice = empirePrice_full / 100;

            console.log(empirePrice)
        } catch (error) {
            empirePrice = empirePrice_full
        }
        
        let buffVal;
        
        let condition
        // check if items is stattrak
        if (itemName.includes('StatTrak')) {
            condition = withdraw_list_st.find((c)  => itemName.includes(c.name));
        } else {
            condition = withdraw_list.find((c)  => itemName.includes(c.name));
        }
        
        buffVal = priceInfo.buff.price / 100;
        console.log(buffVal)

        let calc =  (Math.floor(empirePrice/buffVal*10000) - 10000) / 100
        console.log(calc)

        let parent_el = item.querySelector("div.my-sm.flex.h-full.flex-col.justify-between.px-lg.pb-md");
        let res = checkPrice(empirePrice, buffVal)

        parent_el.appendChild(drawCustomForm(res, calc, buffVal));

        // LOGS INTO CONSOLE ABOUT PRICINGS =
        log(blue,`${itemName}`)
        log(yellow,`\t Empire PRICE: $${empirePrice}`)
        log(yellow,`\t BUFF PRICE: $${buffVal}`)

        if(res === 'Overpriced' ) log(yellow,`\t DIFF: ${calc} %`)
        if(res === 'Goodpriced' ) log(yellow,`\t DIFF: ${calc} %`)
        if(res === 'Underpriced') log(yellow,`\t DIFF: ${calc} %`)
    }
}

function executeCommands() {
    if (elements.length === 0) {
        return;
    }
  
    const element = elements[0];
    console.log(`Executing commands on ${element}`);
  
    // Calculate the total elapsed time for the previous item
    const totalElapsed = (elements.length - 1) * (fix_Delay + (random_delay / 2));
  
    // Add a delay of one second between each item
    const delay = totalElapsed + (Math.random() * random_delay) + fix_Delay;

    const buy_button_delay =  delay + (Math.random() * random_buy_button_delay) + fix_buy_button_delay;
    
    setTimeout(() => {
        console.log('clicking');
        console.log(element)
        element.click();
        elements.shift();
        executeCommands();
    }, delay);
}
  
function handleNewItem(itemName) {
    console.log('handleNewItem')
    elements.push(itemName);

    console.log('going to click')
    
    if (elements.length === 1) {
        console.log('executeCommands')
        executeCommands();
    }
}

function removeName(name, array) {
    const index = array.indexOf(name);
    if (index !== -1) {
        array.splice(index, 1);
      console.log(`Removed ${name} from ${array}`);
    }
}


// eval wheter the item is OP/UNDERP/GOOD priced
// diff +-3% is considered as good priced
// over or under that it's overpriced / underpriced
function checkPrice(empirePrice, buffPrice){
    let v = empirePrice / buffPrice;
    let val = Math.floor(v * 100) / 100;
    if (val > 0.94) return "Overpriced";
    if (val <= 0.94 && val >= 0.92) return "Goodpriced";
    if (val < 0.92) return "Underpriced";
}