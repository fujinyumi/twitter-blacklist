var settings = {
	'blacklist': []
};

//initialize necessary data
function init() {
	chrome.runtime.sendMessage('retrieveStorage', apply);
}

function apply(event) {
	if(!event)
		alert("Twitter Blacklist: Unexpected error at func apply() in insert.js. Please alert the programmer.");
	retrieveLists(event.data);
	filterTweets();
}

function retrieveLists(saveddata) {
	try {
		settings = JSON.parse(saveddata);
	} catch(e) {
			alert("Your saved settings have been corrupted. Twitter Blacklist has wiped saved data and restarted.");
	}
}

function filterTweets() {
	var tweets = document.getElementsByClassName("js-tweet-text-container");
	//console.log(tweets);
	console.log(tweets.length);
	for (var i = 0; i < tweets.length; i++) {
		var tweet = tweets[i];
		console.log(tweet.textContent)
		for (var j = 0; j < settings.blacklist.length; j++) {
			var word = settings.blacklist[j];
			console.log("Word is " + word);
			if (tweet.textContent.indexOf(word) != -1) {
				console.log("Found a match");
				tweet.textContent = "This tweet contains blacklisted content";
			}
		}
	}
}

window.setInterval(function () {
	init();
}, 1);