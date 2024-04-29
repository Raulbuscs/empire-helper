// Master settings
var masterSwitchToggle = document.getElementById("master-switch-toggle");
var webAPIField = document.getElementById("webapi-field");

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

document.addEventListener('DOMContentLoaded', () => {
    // Retrieve the stored data from the background script
    chrome.storage.local.get(['webAPI'], (result) => {
      if (result.webAPI) {
        document.getElementById('webapi-field').innerText = result.webAPI;
      } else {
        document.getElementById('webapi-field').innerText = 'No data available';
      }
    });
});