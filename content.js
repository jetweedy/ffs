"use strict"




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


function displayMy(friends) {
  var div = document.createElement("div");
  div.style = "background-color:white; padding:5%; position:fixed; width:600px; height:400px; left:15%; top:15%; border:2px solid black; border-collapse:collapse; overflow-y:scroll;";
  document.body.append(div);
  var table = document.createElement("table");
  var tbody = document.createElement("tbody");
  table.append(tbody);


  for (var i in friends) {
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
  var a = document.createElement("button");
  a.innerHTML = "[X]";
  a.style.float = "right";
  a.addEventListener("click", function() {
    this.element.parentNode.removeChild(this.element);
  }.bind({"element":div}));
  var p = document.createElement("p");
  p.style = "text-align:right;";
  p.append(a);
  div.append(p);
  div.append(table);
}


function lookForFriends() {
  var friends = {}
  var items = document.querySelectorAll("div");
  var regex = /\d+ mutual friends/;
  for (var i=0;i<items.length;i++) {
    var t = items[i].innerText;
    var f = t.split("\n")[0].trim();
    if (t.length<200 && regex.test(t) && f!="" ) {
      if (!regex.test(f)) {
        var n = splitFirstWord(f);
        friends[f] = {"first":n[0], "last":n[1]};
      }
    }
  }
  displayMy(friends);
}

























chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    if (request.action=="Go!") {

        //console.log("Action: %s", request.action, request);
        lookForFriends();

    }

})

