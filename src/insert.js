// FLAGS
var cur_len = 0;
var next_len = 0;
var blacklist_changed = false;

//dictionary of tweets to save
var tweetDict = {};

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
		
		//get tweet id
		var this_id = tweet.parentNode.parentNode.getAttribute("data-tweet-id");
		
		//set old text in dictionary
		var oldtext = tweet.parentNode.innerHTML;
		
		var photoflag = false;
		var quoteflag = false;
		
		if (!(this_id in tweetDict)) {
			tweetDict[this_id] = oldtext;
		}
		
		//photo
		if (tweet.parentNode.getElementsByClassName("AdaptiveMediaOuterContainer") != null) photoflag = true;
		//quote
		if (tweet.parentNode.getElementsByClassName("QuoteTweet") != null) quoteflag = true;
		
		//get user
		var this_user = "";
		
		var parent_div = tweet.parentNode.innerText;
		var parent_split = parent_div.split(/\s/);
		for (var j = 0; j < parent_split.length; j++) {
			var cur = parent_split[j];
			if (cur[0] == "@") {
				this_user = cur.replace("@", "").toLowerCase();
				break;
			}
		}
		
		if (this_user == "") {
			console.log("Twitter Blacklist: User couldn't be found?");
		}

		//insert button
		var view_anyway = document.createElement("button");		
		var style_view = document.createElement("style")
		style_view.innerHTML = "button {color: #5ab4f9; font-weight:bold;}"	
		var toclick = document.createTextNode("Click to view anyway.");
		view_anyway.appendChild(style_view);
		view_anyway.appendChild(toclick);
				
		var next = tweet.nextElementSibling;
		
		//button function
		view_anyway.onclick = function () { var id_attr = this.parentNode.parentNode.parentNode.getAttribute("data-tweet-id"); if (!(id_attr in tweetDict)) { console.log("Error"); return; } if (tweetDict[id_attr] != undefined) { this.parentNode.parentNode.innerHTML = tweetDict[id_attr]; tweetDict[id_attr] = undefined; return; } else return };
		
		var toput = "This tweet contains blacklisted content. "
		
		for (var j = 0; j < settings.blacklist.length; j++) {
			var word = settings.blacklist[j];
			var word_array = word.split(/\s/);
			var user = "";
			
			//check if filtered user is included
			if (word_array[0].startsWith("from:") && word_array.length > 1) {
				word = "";
				//re-build word without from
				for (var k = 1; k < word_array.length; k++) {
					word += word_array[k];
				}
				
				user = word_array[0].replace("from:", "");
				user = user.replace(" ", "").toLowerCase();
			}
			
			var mult_words = false;
			//multiple phrase test
			var combo_word = word.split('+');
			if (combo_word.length > 1) mult_words = true;
			
			//tweet text in lowercase
			var lowercase = oldtext.toLowerCase();
			
			//no specified user
			if (user == "") {
				
				//there are multiple words
				if (mult_words == true) {
					
					var no_match = false;
					for (var n = 0; n < combo_word.length; n++) {
						if(lowercase.indexOf(combo_word[n]) == -1) {
							no_match = true;
							break;
						}
					}
					if (no_match == false && tweetDict[this_id] != undefined) {
						tweet.textContent = toput;
						tweet.appendChild(view_anyway);
						
						if (photoflag == true) {
							var photo_contain = tweet.parentNode.getElementsByClassName("AdaptiveMediaOuterContainer");
							for (var m = 0; m < photo_contain.length; m++)
								tweet.parentNode.removeChild(photo_contain[m]);
						}
						if (quoteflag == true) {
							var quote_contain = tweet.parentNode.getElementsByClassName("QuoteTweet");
							for (var m = 0; m < quote_contain.length; m++)
								tweet.parentNode.removeChild(quote_contain[m]);
						}
					}
				}
			
				//there aren't multiple words
				else {
					if (lowercase.indexOf(word) != -1 && tweetDict[this_id] != undefined) {
						tweet.textContent = toput;
						tweet.appendChild(view_anyway);
					
						if (photoflag == true) {
							var photo_contain = tweet.parentNode.getElementsByClassName("AdaptiveMediaOuterContainer");
							for (var m = 0; m < photo_contain.length; m++)
								tweet.parentNode.removeChild(photo_contain[m]);
						}
						if (quoteflag == true) {
							var quote_contain = tweet.parentNode.getElementsByClassName("QuoteTweet");
							for (var m = 0; m < quote_contain.length; m++)
								tweet.parentNode.removeChild(quote_contain[m]);
						}
					}
				}
			}
			else {
				//there are multiple words
				if (user == this_user && mult_words == true) {
					
					var no_match = false;
					for (var n = 0; n < combo_word.length; n++) {
						if(lowercase.indexOf(combo_word[n]) == -1) {
							no_match = true;
							break;
						}
					}
					if (no_match == false && tweetDict[this_id] != undefined) {
						tweet.textContent = toput;
						tweet.appendChild(view_anyway);
						
						if (photoflag == true) {
							var photo_contain = tweet.parentNode.getElementsByClassName("AdaptiveMediaOuterContainer");
							for (var m = 0; m < photo_contain.length; m++)
								tweet.parentNode.removeChild(photo_contain[m]);
						}
						if (quoteflag == true) {
							var quote_contain = tweet.parentNode.getElementsByClassName("QuoteTweet");
							for (var m = 0; m < quote_contain.length; m++)
								tweet.parentNode.removeChild(quote_contain[m]);
						}
					}
				}
				else {
					if (user == this_user && lowercase.indexOf(word) != -1 && tweetDict[this_id] != undefined) {
						tweet.textContent = toput;
						tweet.appendChild(view_anyway);
						
						if (photoflag == true) {
							var photo_contain = tweet.parentNode.getElementsByClassName("AdaptiveMediaOuterContainer");
							for (var m = 0; m < photo_contain.length; m++)
								tweet.parentNode.removeChild(photo_contain[m]);
						}
						if (quoteflag == true) {
							var quote_contain = tweet.parentNode.getElementsByClassName("QuoteTweet");
							for (var m = 0; m < quote_contain.length; m++)
								tweet.parentNode.removeChild(quote_contain[m]);
						}
					}
				}
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
}, 100);