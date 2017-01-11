// FLAGS
var cur_len = 0;
var next_len = 0;
var blacklist_changed = false;

var new_settings = {
	'blacklist': []
};

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
		new_settings = JSON.parse(saveddata);
		if (new_settings.blacklist != settings.blacklist)
			blacklist_changed = true;
		else blacklist_changed = false;
		settings = new_settings;
	} catch(e) {
			alert("Your saved settings have been corrupted. Twitter Blacklist has wiped saved data and restarted.");
	}
}

function filterTweets() {
	var tweets = document.getElementsByClassName("js-tweet-text-container");
	
	cur_length = tweets.length;
	
	for (var i = 0; i < tweets.length; i++) {
		var tweet = tweets[i];
		for (var j = 0; j < settings.blacklist.length; j++) {
			var word = settings.blacklist[j];
			if (tweet.textContent.indexOf(word) != -1) {
				tweet.textContent = "This tweet contains blacklisted content";
			}
		}
	}
}

init();
window.setInterval(function () {
	var tweets = document.getElementsByClassName("js-tweet-text-container");
	next_len = tweets.length;
	if (next_len != cur_len || blacklist_changed == true)
		init();
}, 5);