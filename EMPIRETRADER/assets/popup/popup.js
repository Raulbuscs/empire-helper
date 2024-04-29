// Master settings
var masterSwitchToggle = document.getElementById("master-switch-toggle");
var userNameField = document.getElementById("username-field");

// Pricing settings
var pricingList64Toggle = document.getElementById("pricing-list-64-toggle");
var pricingList62Toggle = document.getElementById("pricing-list-62-toggle");

// Withdraw settings
var depoAutoacceptToggle = document.getElementById("depo-autoaccept-toggle");
var depoAutoacceptMessageToggle = document.getElementById("depo-autoaccept-toggle-notify");
var depoAutoacceptSuccesMessageToggle = document.getElementById("depo-autoaccept-succes-toggle");

// trade settings
var withAutotradeToggle = document.getElementById("with-autotrade-toggle");
var customFiltersToggle = document.getElementById("Custom-filters-toggle");
var BuyListFilterToggle = document.getElementById("Buy-list-filter-toggle");
var maxRollInput = document.getElementById("max-roll-input");
var maxMarktInput = document.getElementById("max-market-input");
var fixDelayInput = document.getElementById("fix-delay-input");
var randomDelayInput = document.getElementById("random-delay-input");
var withAutobuyToggle = document.getElementById("with-autobuyer-toggle");
var fixBuyButtonDelayInput = document.getElementById("fix-buy-button-delay-input");
var randomBuyButtonDelayInput = document.getElementById("random-buy-button-delay-input");


// Master settings
chrome.runtime.sendMessage({action: "getSetting", key: "masterSwitch"}, function(result) {
    var isChecked = result.masterSwitch;
    masterSwitchToggle.checked = isChecked;
});

masterSwitchToggle.addEventListener("change", function() {
    var masterSwitchChecked = masterSwitchToggle.checked;
    chrome.runtime.sendMessage({action: "setSetting", key: "masterSwitch", value: masterSwitchChecked}, function() {
        console.log("MASTER SWITCH setting saved!");
    });
});

chrome.runtime.sendMessage({action: "getSetting", key: "userName"}, function(result) {
    var userName = result.userName;
    userNameField.value = userName;
});

userNameField.addEventListener("change", function() {
    var userName = userNameField.value;
    chrome.runtime.sendMessage({action: "setSetting", key: "userName", value: userName}, function() {
        console.log("MASTER SWITCH setting saved!");
    });
});

// Pricing Settings
chrome.runtime.sendMessage({action: "getSetting", key: "pricingList64"}, function(result) {
    var isChecked = result.pricingList64;
    pricingList64Toggle.checked = isChecked;
});

pricingList64Toggle.addEventListener("change", function() {
    var checked = pricingList64Toggle.checked;
    chrome.runtime.sendMessage({action: "setSetting", key: "pricingList64", value: checked}, function() {
        console.log("MASTER SWITCH setting saved!");
    });
});

chrome.runtime.sendMessage({action: "getSetting", key: "pricingList62"}, function(result) {
    var isChecked = result.pricingList62;
    pricingList62Toggle.checked = isChecked;
});

pricingList62Toggle.addEventListener("change", function() {
    var checked = pricingList62Toggle.checked;
    chrome.runtime.sendMessage({action: "setSetting", key: "pricingList62", value: checked}, function() {
        console.log("MASTER SWITCH setting saved!");
    });
});

// Withdraw settings
chrome.runtime.sendMessage({action: "getSetting", key: "depoAutoaccept"}, function(result) {
    var value = result.depoAutoaccept;
    depoAutoacceptToggle.checked = value;
});

depoAutoacceptToggle.addEventListener("change", function() {
    var value = depoAutoacceptToggle.checked;
    chrome.runtime.sendMessage({action: "setSetting", key: "depoAutoaccept", value: value}, function() {
        console.log("DEPO AUTOACCEPT setting saved!");
    });
});

chrome.runtime.sendMessage({action: "getSetting", key: "depoAutoacceptMessage"}, function(result) {
    var value = result.depoAutoacceptMessage;
    depoAutoacceptMessageToggle.checked = value;
});

depoAutoacceptMessageToggle.addEventListener("change", function() {
    var value = depoAutoacceptMessageToggle.checked;
    chrome.runtime.sendMessage({action: "setSetting", key: "depoAutoacceptMessage", value: value}, function() {
        console.log("depo Auto accept Message setting saved!");
    });
});

chrome.runtime.sendMessage({action: "getSetting", key: "depoAutoacceptSuccesMessage"}, function(result) {
    var value = result.depoAutoacceptSuccesMessage;
    depoAutoacceptSuccesMessageToggle.checked = value;
});

depoAutoacceptSuccesMessageToggle.addEventListener("change", function() {
    var value = depoAutoacceptSuccesMessageToggle.checked;
    chrome.runtime.sendMessage({action: "setSetting", key: "depoAutoacceptSuccesMessage", value: value}, function() {
        console.log("depo Auto accept Succes Message setting saved!");
    });
});


// trade settings
chrome.runtime.sendMessage({action: "getSetting", key: "withAutotrade"}, function(result) {
    var isChecked = result.withAutotrade;
    withAutotradeToggle.checked = isChecked;
});

withAutotradeToggle.addEventListener("change", function() {
    var withAutotradeChecked = withAutotradeToggle.checked;
    chrome.runtime.sendMessage({action: "setSetting", key: "withAutotrade", value: withAutotradeChecked}, function() {
        console.log("WITH AUTOTRADE setting saved!");
    });
});

chrome.runtime.sendMessage({action: "getSetting", key: "tradeCustomFilter"}, function(result) {
    var isChecked = result.tradeCustomFilter;
    customFiltersToggle.checked = isChecked;
});

customFiltersToggle.addEventListener("change", function() {
    var value = customFiltersToggle.checked;
    chrome.runtime.sendMessage({action: "setSetting", key: "tradeCustomFilter", value: value}, function() {
        console.log("tradeCustomFilter setting saved!");
    });
});

chrome.runtime.sendMessage({action: "getSetting", key: "tradeBuyListFilter"}, function(result) {
    var isChecked = result.tradeBuyListFilter;
    BuyListFilterToggle.checked = isChecked;
});

BuyListFilterToggle.addEventListener("change", function() {
    var value = BuyListFilterToggle.checked;
    chrome.runtime.sendMessage({action: "setSetting", key: "tradeBuyListFilter", value: value}, function() {
        console.log("tradeBuyListFilter setting saved!");
    });
});

chrome.runtime.sendMessage({action: "getSetting", key: "maxRoll"}, function(result) {
    var maxRollProcent = result.maxRoll;
    maxRollInput.value = maxRollProcent;
});

maxRollInput.addEventListener("change", function() {
    var maxRoll = maxRollInput.value;
    chrome.runtime.sendMessage({action: "setSetting", key: "maxRoll", value: maxRoll}, function() {
        console.log("Max Roll setting saved!");
    });
});

chrome.runtime.sendMessage({action: "getSetting", key: "maxMarkt"}, function(result) {
    var maxMarktProcent = result.maxMarkt;
    maxMarktInput.value = maxMarktProcent;
});

maxMarktInput.addEventListener("change", function() {
    var maxMarkt = maxMarktInput.value;
    chrome.runtime.sendMessage({action: "setSetting", key: "maxMarkt", value: maxMarkt}, function() {
        console.log("Max Market setting saved!");
    });
});

chrome.runtime.sendMessage({action: "getSetting", key: "fixDelay"}, function(result) {
    var delay = result.fixDelay;
    fixDelayInput.value = delay;
});

fixDelayInput.addEventListener("change", function() {
    var fixDelay = fixDelayInput.value;
    chrome.runtime.sendMessage({action: "setSetting", key: "fixDelay", value: fixDelay}, function() {
        console.log("FIX DELAY setting saved!");
    });
});

chrome.runtime.sendMessage({action: "getSetting", key: "randomDelay"}, function(result) {
    var delay = result.randomDelay;
    randomDelayInput.value = delay;
});

randomDelayInput.addEventListener("change", function() {
    var randomDelay = randomDelayInput.value;
    chrome.runtime.sendMessage({action: "setSetting", key: "randomDelay", value: randomDelay}, function() {
        console.log("RANDOM DELAY setting saved!");
    });
});

chrome.runtime.sendMessage({action: "getSetting", key: "withAutobuy"}, function(result) {
    var isChecked = result.withAutobuy;
    withAutobuyToggle.checked = isChecked;
});

withAutobuyToggle.addEventListener("change", function() {
    var withAutotradeChecked = withAutobuyToggle.checked;
    chrome.runtime.sendMessage({action: "setSetting", key: "withAutobuy", value: withAutotradeChecked}, function() {
        console.log("WITH AUTOBUY setting saved!");
    });
});

chrome.runtime.sendMessage({action: "getSetting", key: "fixBuyButtonDelay"}, function(result) {
    var fix_button_delay = result.fixBuyButtonDelay;
    fixBuyButtonDelayInput.value = fix_button_delay;
});

fixBuyButtonDelayInput.addEventListener("change", function() {
    var fixDelay = fixBuyButtonDelayInput.value;
    chrome.runtime.sendMessage({action: "setSetting", key: "fixBuyButtonDelay", value: fixDelay}, function() {
        console.log("FIX BUY BUTTON DELAY setting saved!");
    });
});

chrome.runtime.sendMessage({action: "getSetting", key: "randomButtonDelay"}, function(result) {
    var random_button_delay = result.randomButtonDelay;
    randomBuyButtonDelayInput.value = random_button_delay;
});

randomBuyButtonDelayInput.addEventListener("change", function() {
    var randomDelay = randomBuyButtonDelayInput.value;
    chrome.runtime.sendMessage({action: "setSetting", key: "randomButtonDelay", value: randomDelay}, function() {
        console.log("RANDOM BUY BUTTON DELAY setting saved!");
    });
});
