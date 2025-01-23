"use strict"




chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (request.action == "TestBG") {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){

      /*
      chrome.tabs.sendMessage(tabs[0].id, {action: "console.log", message:"Test from BG!"}
          , function(response) {

          }); 
      */

      chrome.tabs.sendMessage(tabs[0].id, {action: "visitNext"}); 


    });
  }
})