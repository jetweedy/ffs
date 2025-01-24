"use strict";

//alert("Hello, world from popup!")

function clickResetData() {
    var query = { active: true, currentWindow: true };
    function callback(tabs) {
      chrome.tabs.sendMessage( tabs[0].id, {"action":"ResetData"} );
    }
    chrome.tabs.query(query, callback);
}

function clickButtonCountLoadedFriends() {   
    var query = { active: true, currentWindow: true };
    function callback(tabs) {
      chrome.tabs.sendMessage( tabs[0].id, {"action":"CountLoadedFriends"} );
    }
    chrome.tabs.query(query, callback);
}

function clickButtonGoToFriends() {
    var query = { active: true, currentWindow: true };
    function callback(tabs) {
      chrome.tabs.sendMessage( tabs[0].id, {"action":"GoToFriends"} );
    }
    chrome.tabs.query(query, callback);
}

function clickButtonScroll() {
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

function logToContentConsole(message) {
    var query = { active: true, currentWindow: true };
    function callback(tabs) {
      chrome.tabs.sendMessage( tabs[0].id, {"action":"console.log", "message":message} );
    }
    chrome.tabs.query(query, callback);
}

function processFriends() {

    //// Send a message to the content page:
    var query = { active: true, currentWindow: true };
    function callback(tabs) {
      chrome.tabs.sendMessage( tabs[0].id, {"action":"visitNext"} );
    }
    chrome.tabs.query(query, callback);


    /*
    //// Send a message to the background:
    chrome.runtime.sendMessage({"action":"visitNext"})
    
      .then((response) => {
            logToContentConsole(response)
      })
      .catch((error) => {
            logToContentConsole(error)
      })
    */    
}

document.querySelector("#btnResetData").addEventListener("click", clickResetData);
document.querySelector("#btnGoToFriends").addEventListener("click", clickButtonGoToFriends);
document.querySelector("#btnCountLoadedFriends").addEventListener("click", clickButtonCountLoadedFriends);
document.querySelector("#btnScroll").addEventListener("click", clickButtonScroll);
document.querySelector("#btnLook").addEventListener("click", clickButtonLook);
document.querySelector("#btnProcessFriends").addEventListener("click", processFriends);



