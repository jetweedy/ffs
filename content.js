"use strict"

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    if (sender.action=="Go!") {

        console.log("Action: %s", sender.action, request);
        
        
    }

})

