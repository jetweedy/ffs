"use strict"




chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action == "TestBG") {
    //logToContentConsole(sender.tab, "Test from Background!");

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {action: "console.log", message:"Test from BG!"}
            , function(response) {});  
    });

  }
})