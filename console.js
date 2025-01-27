
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
  div.style = "background-color:white; padding:5%; position:fixed; width:600px; height:80%; left:15%; top:15%; border:2px solid black; border-collapse:collapse; overflow-y:scroll;";
  document.body.append(div);
  var html = "<table>";
  for (var i in friends) {
    html += ("<tr><td style='border:1px solid black;'>" + friends[i].first + "</td><td style='border:1px solid black;'>" + friends[i].last + "</td></tr>");
  }
  html += "</table>";
  div.innerHTML = html;
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


//lookForFriends();





















let scrollInterval;
// Function to scroll to the bottom
function scrollToBottom() {
  window.scrollTo(0, document.body.scrollHeight);
}
// Function to start the auto-scrolling process
function startAutoScroll() {
  scrollInterval = setInterval(() => {
    scrollToBottom();
  }, 3000); // Adjust the interval (in milliseconds) as needed (currently set to 3 seconds)
}
// Function to stop the auto-scrolling
function stopAutoScroll() {
  clearInterval(scrollInterval); // Stop the scrolling
  console.log('Scrolling stopped.');
  lookForFriends();
}
// Listen for the Escape key press
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    stopAutoScroll(); // Stop the scrolling when Escape is pressed
  }
});




//startAutoScroll();


var x = document.querySelector("#mount_0_0_Nd > div > div > div:nth-child(1) > div > div.x9f619.x1n2onr6.x1ja2u2z > div > div > div.x78zum5.xdt5ytf.x1t2pt76.x1n2onr6.x1ja2u2z.x10cihs4 > div.x78zum5.xdt5ytf.x1t2pt76 > div > div > div:nth-child(1) > div.x9f619.x1ja2u2z.x78zum5.x2lah0s.x1n2onr6.xl56j7k.x1qjc9v5.xozqiw3.x1q0g3np.x1l90r2v.x1ve1bff > div > div > div > div.x78zum5.x15sbx0n.x5oxk1f.x1jxijyj.xym1h4x.xuy2c7u.x1ltux0g.xc9uqle > div > div > div.x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.x2lah0s.x193iq5w.x1cy8zhl.xyamay9 > span > a");
console.log(x.innerHTML);

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
      console.log(a);
    }
  }
}
getNumberOfFriends();













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

var divs = document.querySelectorAll("div");
for (var div of divs) {
  var t = div.innerText;
  if (t.substr(0,12)=="Contact info") {
    var emails = extractEmails(t);
    console.log(emails);
    var phones = extractPhoneNumbers(t);
    console.log(phones);
    break;
  }
}


