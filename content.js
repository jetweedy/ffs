"use strict"




//// -------------------------------------------------------------
//// COVER/WAITING OVERLAY:
//// -------------------------------------------------------------

function showCoverDiv(message) {
    coverDiv.style.display = "block";
    coverMessage.innerHTML = message;
}
function hideCoverDiv() {
    coverDiv.style.display = "none";
}

var coverDiv = document.createElement("div");
coverDiv.style = "opacity:.9; position:fixed; top:0px; left:0px; height:100%; width:100%; z-index:1000; background-color:white; display:none;";
var coverMessage = document.createElement("div");
coverMessage.innerHTML = "Please wait...";
coverMessage.style = "position:fixed; top:50%; left:50%; font-weight:bold; font-size:2em;";
coverDiv.append(coverMessage);
document.body.append(coverDiv);





//// -------------------------------------------------------------
//// EXAMINE FRIENDS LIST AND PREPARE FOR PROCESSING INDIVUALS:
//// -------------------------------------------------------------

function highlightAndCopyElementContents(element) {
    if (!element) {
        console.error("Invalid element provided.");
        return;
    }
    // Create a range to select the element's contents
    const range = document.createRange();
    range.selectNodeContents(element);
    // Select the contents
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    // Copy to clipboard
    try {
        document.execCommand("copy");
        alert("Content copied to clipboard!");
    } catch (err) {
        console.error("Failed to copy: ", err);
    }
    // Optional: Clear selection after copying
    setTimeout(() => selection.removeAllRanges(), 1000);
}


function splitFirstWord(str) {
    // Use a regular expression to match the first word and the rest of the string
    let match = str.match(/^(\S+)\s*(.*)$/);
    // Check if the match was successful
    if (match) {
        return [match[1],match[2]];
    } else {
        // If the string is empty or doesn't match, return the whole string as the first word and an empty rest
        return [str,''];
    }
}


var resultsContainer = document.createElement("div");
resultsContainer.style = "display:none; background-color:white; position:fixed; width:500px; left:15%; top:15%; border:2px solid black; border-collapse:collapse; height:350px;";
document.body.append(resultsContainer);


function displayFriends() {

  resultsContainer.innerHTML = "";
  var table = document.createElement("table");
  var tbody = document.createElement("tbody");
  table.append(tbody);
  for (var i in friendList) {
    var tr = document.createElement("tr");
    tbody.append(tr);
    var td = document.createElement("td");
    td.innerHTML = friendList[i].first;
    td.style = "border:1px solid black;";
    tr.append(td);
    var td = document.createElement("td");
    td.innerHTML = friendList[i].last;
    td.style = "border:1px solid black;";
    tr.append(td);
  }

  var p = document.createElement("p");
  p.style = "text-align:right;";
  resultsContainer.append(p);

  var a = document.createElement("button");
  a.style.margin = "5px 10px";
  a.innerHTML = "[Highlight All]";
  a.addEventListener("click", function() {
    highlightAndCopyElementContents(this.table);
  }.bind({"table":table}));
  p.append(a);

  var a = document.createElement("button");
  a.style.margin = "5px 10px";
  a.innerHTML = "[X]";
  a.addEventListener("click", function() {
    resultsContainer.style.display = "none";
  });
  p.append(a);

  var tableContainer = document.createElement("div");
  tableContainer.style = "margin:5%; left:15%; top:15%; border-collapse:collapse; height:300px; overflow-y:scroll;";
  tableContainer.append(table);
  resultsContainer.append(tableContainer);
  resultsContainer.style.display = "block";
  highlightElementContents(table);

}


function lookForFriends() {
  var items = document.querySelectorAll("div");
  var regex = /\d+ mutual friends/;
  for (var i=0;i<items.length;i++) {
    var t = items[i].innerText;
    var f = t.split("\n")[0].trim();
    if (t.length<200 && regex.test(t) && f!="" ) {
      if (!regex.test(f)) {
        var n = splitFirstWord(f);
        friendList[f] = {
          "first":n[0], "last":n[1],
          "url":items[i].querySelector("a").href,
        };
      }
    }
  }
  friendNames = [];
  for (var f in friendList) {
    friendNames.push(f);
  }
  chrome.storage.local.set({ "friendNames": friendNames, "friendList":friendList }, function() {
      if (callback) callback({});
  });  
  
  displayFriends();

}


















//// -------------------------------------------------------------
//// SCROLL DOWN FRIENDS LIST UNTIL FULLY LOADED:
//// -------------------------------------------------------------

let scrollInterval;

// Function to scroll to the bottom
function scrollToBottom() {
  window.scrollTo(0, document.body.scrollHeight);
}

function matchesFriendsPattern(text) {
    // Define the pattern: ^\d+ friends$ matches one or more digits followed by 'friends'
    const pattern = /^\d+ friends$/;
    // Test if the string matches the pattern
    return pattern.test(text);
}


function countLoadedFriends() {
  var loadedFriends = {};
  var items = document.querySelectorAll("div");
  var regex = /\d+ mutual friends/;
  for (var i=0;i<items.length;i++) {
    var t = items[i].innerText;
    var f = t.split("\n")[0].trim();
    if (t.length<200 && regex.test(t) && f!="" ) {
      loadedFriends[f] = f;
    }
  }
  var friendCount = Object.keys(loadedFriends).length;
  return friendCount;
}


var lastCount = 0;
// Function to start the auto-scrolling process
function startAutoScroll() {
  showCoverDiv("Scrolling...");
  scrollInterval = setInterval(() => {
    var loadedFriends = countLoadedFriends();
    console.log(loadedFriends, "|", lastCount);
    if (loadedFriends == lastCount) {
      stopAutoScroll();
    }
    lastCount = loadedFriends;
    //console.log(loadedFriends, "<", numFriends, "?");
    //if ( loadedFriends >= numFriends ) {
    //  stopAutoScroll();
    //}
    scrollToBottom();
  }, 2000); // Adjust the interval (in milliseconds) as needed (currently set to 3 seconds)
}
// Function to stop the auto-scrolling
function stopAutoScroll() {
  clearInterval(scrollInterval); // Stop the scrolling
  hideCoverDiv();
  console.log('Scrolling stopped.');
  //lookForFriends();
}


// Listen for the Escape key press
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    stopAutoScroll(); // Stop the scrolling when Escape is pressed
    hideCoverDiv();
  }
});






//// -------------------------------------------------------------
//// GO TO FRIENDS PAGE:
//// -------------------------------------------------------------

function goToFriends() {
  window.location.replace("https://facebook.com/me/friends");
}





//// -------------------------------------------------------------
//// PROCESSING FRIENDS:
//// -------------------------------------------------------------


//// Reset Data:
function resetData() {
  chrome.storage.local.set({ friendList: {} , friendData: {}, friendNames: [], friendIndex: 0}, function() {});
  console.log("Resetting Data");
  window.location.reload();

}


function initializeFriendIndex(callback) {
    chrome.storage.local.get(['friendIndex'], function(result) {
        if (chrome.runtime.lastError) {
          return;
        }
        console.log("result.friendIndex:", result.friendIndex);
        if (!result.friendIndex && !result.friendIndex===0) {
          chrome.storage.local.set({ friendIndex: "0" }, function() {
              if (callback) callback({});
          });
        } else {
          if (callback) callback(result.friendIndex);
        }
    });
}

function initializeFriendData(callback) {
    chrome.storage.local.get(['friendData'], function(result) {
        if (chrome.runtime.lastError) {
            return;
        }

        if (!result.friendData) {
            chrome.storage.local.set({ friendData: {} }, function() {
                if (callback) callback({});
            });
        } else {
            if (callback) callback(result.friendData);
        }
    });
}


function initializeFriendNames(callback) {
    chrome.storage.local.get(['friendNames'], function(result) {
        if (chrome.runtime.lastError) {
            return;
        }

        if (!result.friendNames) {
            chrome.storage.local.set({ friendNames: [] }, function() {
                if (callback) callback({});
            });
        } else {
            if (callback) callback(result.friendNames);
        }
    });
}


function initializeFriendList(callback) {
    chrome.storage.local.get(['friendList'], function(result) {
        if (chrome.runtime.lastError) {
            //console.error("Error accessing storage:", chrome.runtime.lastError);
            return;
        }

        if (!result.friendList) {
            // If 'friendList' does not exist, initialize it
            chrome.storage.local.set({ friendList: {} }, function() {
                //console.log("Initialized 'friendList' as an empty object.");
                if (callback) callback({});
            });
        } else {
            //console.log("Friends data exists:", result.friendList);
            if (callback) callback(result.friendList);
        }
    });
}

function addFriend(friend) {

    //console.log(friend);
    //return;

    if (!friendData) {
        //console.error("Friends list is not initialized yet.");
        return;
    }
    friendData[friend.name] = friend;
    //console.log("Added friend:", friend);
    // Step 4: Save updated friends list to chrome storage


    friendIndex++;
    chrome.storage.local.set({ friendData: friendData, friendIndex: friendIndex }, function() {
        if (chrome.runtime.lastError) {
        } else {
          setTimeout(visitNext, 3000);
          //if (confirm("Continue?")) {
          //  visitNext();
          //}
        }
    });

}



//// Here I'd like to just loop through the indexes in friendList and process the ones that haven't been found in friendData yet... but it's not working yet.
function _visitNext() {
  var url = false;
  for (var n in friendNames) {
    if (typeof friendData[n] == "undefined") {
      var url = friendList[n].url;
      if (url.indexOf("?id") > 0) {
        url += "&sk=about_contact_and_basic_info&ffsProcessFriend"
      } else {
        url += "/about_contact_and_basic_info?ffsProcessFriend";
      }
      break;
    }
  }
  if (!!url) {
    //window.open(url);
    window.location.replace(url);
  }
}



function visitNext() {
  if (friendIndex < friendNames.length) {
    var url = friendList[friendNames[friendIndex]].url;
    if (url.indexOf("?id") > 0) {
      url += "&sk=about_contact_and_basic_info&ffsProcessFriend"
    } else {
      url += "/about_contact_and_basic_info?ffsProcessFriend";
    }
    //window.open(url);
    window.location.replace(url);
  }
}








function isFacebookContactDetailsURL(url) {
    const regex = /^https:\/\/www\.facebook\.com\/[^\/]+\/about_contact_and_basic_info$/;
    return regex.test(url);
}

function extractPhoneNumbers(text) {
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]\d{4}/g;
    const phoneNumbers = text.match(phoneRegex);
    return phoneNumbers ? phoneNumbers : [];
}

function extractEmails(text) {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emails = text.match(emailRegex);
    return emails ? emails : [];
}








var friendIndex = 0;
initializeFriendIndex(function(fi) {
  friendIndex = fi;
  console.log("friendIndex:", friendIndex);
})

var friendNames = [];
initializeFriendNames(function(fn) {
  friendNames = fn;
  console.log("friendNames:", friendNames);
})

var friendList = {};
initializeFriendList(function(fl) {
  friendList = fl;
  console.log("friendList:", friendList);
})


var friendData = {};
initializeFriendData(function(fd) {
  friendData = fd;
  console.log("friendData:", friendData);
  //var currentURL = window.location.href;
  //if (isFacebookContactDetailsURL(currentURL)) {
  var urlParams = new URLSearchParams(window.location.search);

  var ffsProcessFriend = urlParams.get('ffsProcessFriend');
  if (ffsProcessFriend!==null) {

    //// Set a timeout to reload this page just in case something breaks later.
    setTimeout(function() {
      window.location.reload();
    }, 10000);

    var divs = document.querySelectorAll("div");
    for (var div of divs) {
      var t = div.innerText;
      if (t.substr(0,12)=="Contact info") {
        var emails = extractEmails(t);
        //console.log(emails);
        var phones = extractPhoneNumbers(t);
        //console.log(phones);
        var name = document.querySelector("h1").innerText;
        addFriend({"name":name, "phones":phones, "emails":emails, "contactText":t});
        break;
      }
    }
  }



});








//// -------------------------------------------------------------
//// LISTEN FOR MESSAGES FROM POPUP OR BACKGROUND:
//// -------------------------------------------------------------

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    if (request.action == "ResetData") {
      resetData();
    }

    if (request.action == 'visitNext') {
      visitNext();
    }

    if (request.action == "CountLoadedFriends") {
      var lf = countLoadedFriends();
      console.log("Loaded Friends:", lf);
    }

    if (request.action == "GoToFriends") {
      goToFriends();
    }

    //if (request.action === 'console.log') {
    //    console.log(request.message);
    //}

    if (request.action=="Look") {
        lookForFriends();
    }
    if (request.action=="Scroll") {
        startAutoScroll();
    }

    //// https://stackoverflow.com/questions/14245334/sendmessage-from-extension-background-or-popup-to-content-script-doesnt-work
    //// This keeps some port from closing prematurely:
    return true

})










