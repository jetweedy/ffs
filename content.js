"use strict"


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

function displayFriends() {

  var table = document.createElement("table");
  var tbody = document.createElement("tbody");
  table.append(tbody);
  for (var i in friends) {

    console.log(friends[i].element);

    var tr = document.createElement("tr");
    tbody.append(tr);
    var td = document.createElement("td");
    td.innerHTML = friends[i].first;
    td.style = "border:1px solid black;";
    tr.append(td);
    var td = document.createElement("td");
    td.innerHTML = friends[i].last;
    td.style = "border:1px solid black;";
    tr.append(td);
  }

  var resultsContainer = document.createElement("div");
  resultsContainer.style = "background-color:white; position:fixed; width:500px; left:15%; top:15%; border:2px solid black; border-collapse:collapse; height:350px;";
  document.body.append(resultsContainer);

  var a = document.createElement("button");
  a.innerHTML = "[X]";
  a.style.float = "right";
  a.addEventListener("click", function() {
    this.element.parentNode.removeChild(this.element);
  }.bind({"element":resultsContainer}));
  var p = document.createElement("p");
  p.style = "text-align:right;";
  p.append(a);
  resultsContainer.append(p);

  var tableContainer = document.createElement("div");
  tableContainer.style = "margin:5%; left:15%; top:15%; border-collapse:collapse; height:300px; overflow-y:scroll;";
  document.body.append(tableContainer);
  tableContainer.append(table);

  resultsContainer.append(tableContainer);

}


var friends = {};
var fs = [];
function lookForFriends() {
  var items = document.querySelectorAll("div");
  var regex = /\d+ mutual friends/;
  for (var i=0;i<items.length;i++) {
    var t = items[i].innerText;
    var f = t.split("\n")[0].trim();
    if (t.length<200 && regex.test(t) && f!="" ) {
      if (!regex.test(f)) {
        var n = splitFirstWord(f);
        friends[f] = {
          "first":n[0], "last":n[1],
          "url":items[i].querySelector("a").href,
        };
      }
    }
  }
  fs = [];
  for (var f in friends) {
    fs.push (f);
  }

  displayFriends();
  //console.log(friends);
  console.log(fs);

}

















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

function getNumberOfFriends() {
  var as = document.querySelectorAll("a");
  for (var a of as) {
    if (matchesFriendsPattern(a.innerHTML)) {
      var numFriends = parseInt(a.innerHTML.replace(" friends").trim());
      return numFriends;
    }
  }
}

// Function to start the auto-scrolling process
function startAutoScroll() {
  var numFriends = getNumberOfFriends();
  console.log("numFriends:", numFriends);
  
  showCoverDiv("Scrolling...");
  scrollInterval = setInterval(() => {
    scrollToBottom();
  }, 3000); // Adjust the interval (in milliseconds) as needed (currently set to 3 seconds)
}
// Function to stop the auto-scrolling
function stopAutoScroll() {
  clearInterval(scrollInterval); // Stop the scrolling
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








var friendIndex = 0;
function visitNext() {
  if (friendIndex < fs.length) {
    var url = friends[fs[friendIndex]].url+"/about_contact_and_basic_info";
    console.log("url:", url);
    //console.log("friendIndex:", friendIndex);
    //console.log("fs:", fs);
    //console.log("friends:", friends);
    //var friend = friends[friendIndex];
    //console.log(friend);
    friendIndex++;
  }
}











chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    if (request.action === 'visitNext') {
      visitNext();
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

