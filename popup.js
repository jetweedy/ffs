"use strict";

//alert("Hello, world from popup!")


function clickButtonScoll() {
    var query = { active: true, currentWindow: true };
    function callback(tabs) {
      chrome.tabs.sendMessage( tabs[0].id, {"action":"Scroll"} );
    }
    chrome.tabs.query(query, callback);
}

function clickButtonLook() {
    var query = { active: true, currentWindow: true };
    function callback(tabs) {
      chrome.tabs.sendMessage( tabs[0].id, {"action":"Look"} );
    }
    chrome.tabs.query(query, callback);
}



document.querySelector("#btnScroll").addEventListener("click", clickButtonScoll);
document.querySelector("#btnLook").addEventListener("click", clickButtonLook);




