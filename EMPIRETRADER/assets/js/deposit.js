let excludedItemsFrom62 = ['Knife','Daggers','Gloves','Wraps','Doppler','CS:GO','Battle-Scarred','Well-Worn'];
var pricesList = {};
var itemsGrid;
var withdraw_list = [];
var withdraw_list_st = [];
  
const jsonURL_buy_list = chrome.runtime.getURL('assets/filters/withdraw_list.json');
fetch(jsonURL_buy_list)
.then(response => response.json())
.then(data => {
    withdraw_list = data;
    console.log(withdraw_list); // Output: ["M4A4 | Eye of Horus", "FAMAS | Waters of Nephthys", "P250 | Apep's Curse"]
});

const jsonURL_buy_list_st = chrome.runtime.getURL('assets/filters/Withdraw_List_ST.json');
fetch(jsonURL_buy_list_st)
.then(response => response.json())
.then(data => {
    withdraw_list_st = data;
    console.log(withdraw_list_st); // Output: ["M4A4 | Eye of Horus", "FAMAS | Waters of Nephthys", "P250 | Apep's Curse"]
});

let blue = '\x1b[36m%s\x1b[0m';
let yellow = '\x1b[33m%s\x1b[0m';

function log(c,str){
    console.log(c,str)
}

chrome.storage.sync.get('masterSwitch', function(result) {
    master_switch = result.masterSwitch;
    console.log('MASTERSWITCH setting:', master_switch);

    if (master_switch) {
        getPriceProvider();
        itemScannerStarter();
        itemScannerTradeBarStarter()
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
    const itemsGrid = document.querySelector("body > cw-root > mat-sidenav-container > mat-sidenav-content > div > cw-player-to-player-deposit > cw-steam-inventory-search-grid > div.ng-star-inserted");
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
        console.log("itemScannerStarter running");
    });
}

function itemScanner(itemsGrid) {
    itemsGrid.querySelectorAll("cw-csgo-market-item-card").forEach(function(node) {
        console.log(node);
        waitForValue(pricesList, function(node) {
            console.log(node);
            setBuffValue(node);
        }, node);
    });
}

// send msg for price provider response
function getPriceProvider() {
    chrome.runtime.sendMessage({ type: 'priceProvider' }, response => {
        pricesList = response;
        console.log('pricesList', pricesList);
    });
}

function drawCustomForm(calcRes, calc) {

    const grandForm = document.createElement("div");
    const searchItem = document.createElement("div");

    grandForm.classList.add("custom-search-grid");
    searchItem.classList.add("custom-search-grid-items");
    grandForm.appendChild(searchItem);

    var n = document.createElement("div");
    n.classList.add("prices-details-info");

    var a = document.createElement("div");
    a.classList.add("square-info");
    a.classList.add("orange-square");

    var r = document.createElement("div");
    r.classList.add("price-detail-info");
    r.appendChild(a);
    r.style.color = "#cd0a0a";
    r.innerHTML += "🔴 +" + calc + " %";

    var o = document.createElement("div");
    o.classList.add("price-detail-info");

    var i = document.createElement("div");
    i.classList.add("square-info");
    i.classList.add("green-square");

    o.appendChild(i);
    o.style.color = '#00C74D';
    o.innerHTML += "🟢 " + calc + " %";

    var c = document.createElement("div");
    c.classList.add("price-detail-info");

    var s = document.createElement("div");
    s.classList.add("square-info");
    s.classList.add("red-square");

    c.appendChild(s);
    c.style.color = "#0078D7";
    c.innerHTML += "🔵 " + calc + " %";

    if (calcRes == 'Overpriced')  n.appendChild(r);
    if (calcRes == 'Underpriced') n.appendChild(c);
    if (calcRes == 'Goodpriced')  n.appendChild(o);

    grandForm.appendChild(n);
    return grandForm;
}


function setBuffValue(item) {
    var itemInfo = {};
    let itemName = '';
    let isun66, is066 = false;
    let isSticker = false;


    //  weapon type
    itemInfo.skinWeapon = item.querySelector("cw-csgo-market-item-card > div > div > div.pointer > span:nth-child(2)").innerHTML.trim()
    if(itemInfo.skinWeapon === 'Sticker'){
        isSticker = true;
        itemName += 'Sticker | ';
    }
    else itemName += itemInfo.skinWeapon;

    // skin name
    if (item.querySelector("cw-csgo-market-item-card > div > div > div.pointer > span:nth-child(2)")) {

        if (isSticker){
            let skin = item.querySelector("cw-csgo-market-item-card > div > div > label").innerHTML.trim()
            itemName += skin;
        }

        else{
            let skin = item.querySelector("cw-csgo-market-item-card > div > div > label").innerHTML.trim()
            let nameArr = skin.split(' ')
            let f = nameArr[0]
            let s = nameArr[1]

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

            //if item is case / pin -> not every item is added yet
            else if (itemInfo.skinWeapon.includes('Case') ||
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
    let exterior = item.querySelector('cw-csgo-market-item-card > div > div > div:nth-child(1) > span:nth-child(2)').innerHTML.trim().slice(0, 2)

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
        switch (exterior) {
            case 'FN':
                itemInfo.skinExterior = 'Factory New'
                break;
            case 'MW':
                itemInfo.skinExterior = 'Minimal Wear'
                break;
            case 'FT':
                itemInfo.skinExterior = 'Field-Tested'
                break;
            case 'WW':
                itemInfo.skinExterior = 'Well-Worn'
                break;
            case 'BS':
                itemInfo.skinExterior = 'Battle-Scarred'
                break;
        }

        itemName += " (" + itemInfo.skinExterior + ")";
    }

    // ======================== PRICING ========================
    // USED TO CALCULATE PRICE => BUFF163 STARTING_AT VALUE (usd)
    // this value is not the best indicator of the correct price
    // so some pricings might be highly inaccurate

    // ========================== API ==========================
    // prices.csgotrader.app/latest/prices_v6.json
    // https://csgotrader.app/prices/

    if (itemName.includes('StatTrak') && itemName.includes('Knife')) {
        itemNamStatTrak = itemName.replace('★ StatTrak™', '★');
        priceInfo = pricesList[itemNamStatTrak];
    } else if (phase !== undefined){
        itemName += ' - ' + phase;
        priceInfo = pricesList[itemName];
    } else {
        priceInfo = pricesList[itemName];
    }

    // if the constructed name of skin was not found in the JSON price file go to next item
    if (priceInfo === undefined) return;

    let rollPrice = Math.floor(item.querySelector('cw-pretty-balance > span').innerText.replace(',','') * 100) / 100;

    
    let tbuffVal;
    let buff;
    let divval
    
    let condition
    console.log("itemName: ", itemName)

    // check if items is stattrak
    if (itemName.includes('StatTrak')) {
        condition = withdraw_list_st.find((c)  => itemName.includes(c.name));
    } else {
        condition = withdraw_list.find((c)  => itemName.includes(c.name));
    }

    console.log("statTrak condition: ", condition)
    
    if (condition) {
        console.log("condition: ", condition.name)
        isun66 = true;
        buff = priceInfo.buff.price / 100;
        tbuffVal = buff / condition.priceDivisor;
        divval = condition.priceDivisor
    } else {
        is066 = true;
        buff = priceInfo.buff.price / 100;
        console.log(exterior)

        all_knifes = ['Knife', 'Daggers', 'Bayonet', 'Karambit']
        all_gloves = ['Hand Wraps', 'Moto Gloves', 'Specialist Gloves', 'Sport Gloves', 'Bloodhound Gloves', 'Hydra Gloves', 'Broken Fang Gloves', 'Driver Gloves']
        // check if item is a knife and if it is battle scarred or well worn
        if (all_knifes.some((v) => itemName.includes(v)) && (exterior === 'BS' || exterior === 'WW')) {
            tbuffVal = buff / 0.675;
        } else if (all_gloves.some((v) => itemName.includes(v)) && (exterior === 'BS' || exterior === 'WW')) {
            tbuffVal = buff / 0.675;
        }  else if (phase !== undefined){
            tbuffVal = buff / 0.65;
        } else {
            tbuffVal = buff / 0.66;
        }
    }

    let buffVal = Math.floor(tbuffVal * 100) / 100
    let calc =  (Math.floor(rollPrice/buffVal*10000) - 10000) / 100

    let parent_el = item.querySelector("cw-csgo-market-item-card > div > div");
    let res = checkPrice(rollPrice, buffVal)

    parent_el.appendChild(drawCustomForm(res, calc));

    // LOGS INTO CONSOLE ABOUT PRICINGS =

    log(blue,`${itemName}`)
    log(yellow,`\t ROLL PRICE: ${rollPrice} coins`)
    log(yellow,`\t BUFF PRICE: ${buff}$`)
    log(yellow,`\t SUGGESTED : ${buffVal} coins`)

    if(res === 'Overpriced' ) log(yellow,`\t DIFF: ${calc} %`)
    if(res === 'Goodpriced' ) log(yellow,`\t DIFF: ${calc} %`)
    if(res === 'Underpriced') log(yellow,`\t DIFF: ${calc} %`)

    if(isun66) log(yellow,`\t USED RATIO: ${divval}`)
    if(is066) log(yellow,`\t USED RATIO: 0.66`)
}

// eval wheter the item is OP/UNDERP/GOOD priced
// diff +-3% is considered as good priced
// over or under that it's overpriced / underpriced
function checkPrice(rollPrice, buffPrice){
    let v = rollPrice / buffPrice;
    let val = Math.floor(v * 100) / 100;
    if (val > 1.03) return "Overpriced";
    if (val <= 1.03 && val >= 0.97) return "Goodpriced";
    if (val < 0.97) return "Underpriced";
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
                        if (node.tagName === "DIV" || node.tagName === "CW-DEPOSIT-LISTED" || node.tagName === "CW-WITHDRAW-PROCESSING" || node.tagName === "CW-DEPOSIT-PROCESSING") {
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

                    const items = tradeGrid2.querySelectorAll("cw-item");
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


function setBuffValueTradeBar(item) {
    var itemInfo = {};
    let itemName = '';
    let isSticker = false;

    //  weapon type
    itemInfo.skinWeapon = item.querySelector("cw-csgo-market-item-card > div > div > div:nth-child(3) > div:nth-child(2) > span:nth-child(2)").innerHTML.trim()
    console.log(itemInfo.skinWeapon)
    if(itemInfo.skinWeapon === 'Sticker'){
        isSticker = true;
        itemName += 'Sticker | ';
    }
    else itemName += itemInfo.skinWeapon;

    if (isSticker){
        let skin = item.querySelector("cw-csgo-market-item-card > div > div > div:nth-child(3) > label").innerHTML.trim()
        itemName += skin;
    }

    else {
        let skin = item.querySelector("cw-csgo-market-item-card > div > div > div:nth-child(3) > label").innerHTML.trim()

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

    // skin exterior (for selectable)
    let exterior = item.querySelector('cw-csgo-market-item-card > div > div > div:nth-child(3) > div:nth-child(1) > span').innerHTML.trim()

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
        switch (exterior) {
            case 'FN':
                itemInfo.skinExterior = 'Factory New'
                break;
            case 'MW':
                itemInfo.skinExterior = 'Minimal Wear'
                break;
            case 'FT':
                itemInfo.skinExterior = 'Field-Tested'
                break;
            case 'WW':
                itemInfo.skinExterior = 'Well-Worn'
                break;
            case 'BS':
                itemInfo.skinExterior = 'Battle-Scarred'
                break;
        }

        itemName += " (" + itemInfo.skinExterior + ")";
    }

    // ======================== PRICING ========================
    // USED TO CALCULATE PRICE => BUFF163 STARTING_AT VALUE (usd)
    // this value is not the best indicator of the correct price
    // so some pricings might be highly inaccurate

    // ========================== API ==========================
    // prices.csgotrader.app/latest/prices_v6.json
    // https://csgotrader.app/prices/

    //log(itemName)
    if (itemName.includes('StatTrak') && itemName.includes('Knife')) {
        itemNamStatTrak = itemName.replace('★ StatTrak™', '★');
        priceInfo = pricesList[itemNamStatTrak];
    } else {
        priceInfo = pricesList[itemName];
    }

    // if the constructed name of skin was not found in the JSON price file go to next item
    if (priceInfo === undefined) return;

    try {
        rollPrice_full = Math.floor(item.querySelector('cw-pretty-balance > span').innerText.replace(',', '') * 100) / 100;
    } catch (e) {
        console.log('error rollPrice methoth two: ' + error)
        rollPrice_full = undefined;
    }

    let rollpercent_calc;

    if (rollPrice_full != undefined) {
        try {
            let rollpercent = item.querySelector('cw-csgo-market-item-card > div > div > div:nth-child(3) > div:nth-child(3) > span').textContent
                .replace(/\s+/g, '') // remove all whitespace
                .replace(/\+/, '') // remove +
                .replace(/^-/, '-') // convert - to negative number
                .replace(/[^0-9.-]/g, ''); // remove any other characters
            rollpercent = Math.floor(parseFloat(rollpercent) * 100) / 100;

            rollpercent_calc = (rollpercent / 100) + 1

            //rollPrice = rollPrice_full / rollpercent_calc
            rollPrice = rollPrice_full

            console.log(rollpercent)
            console.log(rollpercent_calc)
            console.log(rollPrice_full)
            console.log(rollPrice)
        } catch (error) {
            rollPrice = rollPrice_full
            rollpercent_calc = 1
            console.log('error rollpercent: ' + error)
        }
        
        let tbuffVal;
        let buff;
        let divval;
        
        let condition
        // check if items is stattrak
        if (itemName.includes('★ StatTrak™')) {
            condition = withdraw_list_st.find((c)  => itemName.includes(c.name));
        } else {
            condition = withdraw_list.find((c)  => itemName.includes(c.name));
        }
        
        if (condition) {
            console.log("condition: ", condition.name)
            isun66 = true;
            buff = priceInfo.buff.price / 100;
            tbuffVal = buff / condition.priceDivisor;
            divval = condition.priceDivisor
        } else {
            is066 = true;
            buff = priceInfo.buff.price / 100;

            all_knifes = ['Knife', 'Daggers', 'Bayonet', 'Karambit']
            // check if item is a knife and if it is battle scarred or well worn
            if (all_knifes.some((v) => itemName.includes(v)) && (exterior === 'BS' || exterior === 'WW')) {
                tbuffVal = buff / 0.67;
            } else {
                tbuffVal = buff / 0.66;
            }
        }

        let buffVal = Math.floor(tbuffVal * 100) / 100
        let calc =  (Math.floor(rollPrice/buffVal*10000) - 10000) / 100

        let parent_el = item.querySelector("cw-csgo-market-item-card > div > div > div:nth-child(3)");
        let res = checkPrice(rollPrice, buffVal)

        parent_el.appendChild(drawCustomForm(res, calc));
    }
}