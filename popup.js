"use strict";

//alert("Hello, world from popup!")


function clickButtonA() {
    var query = { active: true, currentWindow: true };
    function callback(tabs) {
      //document.querySelector("#debug").value = JSON.stringify(tabs[0]);
      chrome.tabs.sendMessage( tabs[0].id, {"action":"Go!"} );
    }
    chrome.tabs.query(query, callback);
}


document.querySelector("#btnA").addEventListener("click", clickButtonA);




