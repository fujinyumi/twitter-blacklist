//JS

var defaults = {
	'blacklist': []
};

function retrieveStorage() {
	var storage;
	if (localStorage && localStorage.settings) {
		//JSON parse, catch if error
		try {
			storage = JSON.parse(localStorage.settings);
		}
		catch (e) {
			alert("Your saved settings have been corrupted. Twitter Blacklist has wiped saved data and restarted.");
			storage = defaults;
		}
	}
	else storage = defaults;
	return storage;
}

function addToBlacklist(phrase) {
	var curStorage = retrieveStorage();
	
	//add to list
	curStorage.blacklist.push(phrase.toLowerCase());
	
	//propagate changes to browser local storage
	localStorage.settings = JSON.stringify(curStorage);
}

function removeFromBlacklist(phrase) {
	var curStorage = retrieveStorage();
	
	for (i = 0; i < curStorage.blacklist.length; i++) {
		if(phrase === curStorage.blacklist[i])
		{
			curStorage.blacklist.splice(i, 1);
			break;
		}
	}
	
	//propagate changes
	localStorage.settings = JSON.stringify(curStorage);
}

//JQUERY

function loadStorage() {
	var curStorage = retrieveStorage();
	
	for (i = 0; i < curStorage.blacklist.length; i++) {
		$('#tags').append("<span>"+curStorage.blacklist[i]+"<div id=\"close\">x</div></span>");
	}
}

$(document).ready(function() {
	//load storage on startup
	loadStorage();
	
	//prepared to accept tags
	$("#bar input[type=text]").keypress(function (e) {
		if (e.which == 13) {
			enterTag(this);
			return false;    //<---- Add this line
		}
	});
});

$(function() {
	$("#bar input[type=button]").click(function() {
		enterTag(document.getElementById("enterBar"));
	});
	$("#tags").on('click', '#close', function() {
		var txt = $(this.parentNode).text().slice(0, -1);
		$(this.parentNode).remove(); 
		removeFromBlacklist(txt);
	});
	$("#wrapper").on('click', '#clearall', function() {
		if(confirm("Are you sure you want to clear all tags?"))
			clearAll();
	});
});

function enterTag(e) {
      var txt= e.value.toLowerCase();
	  var curStorage = retrieveStorage();
	  
	  var addedFlag = 0;
	  
      if(txt) {
		  for (i = 0; i < curStorage.blacklist.length; i++) {
			  if (curStorage.blacklist[i] === txt) {
				  alert("You have already added this phrase to your blacklist.");
				  addedFlag = 1;
			  }
		  }
		  if (!addedFlag) {
			$('#tags').append("<span>"+txt+"<div id=\"close\">x</div></span>");
			addToBlacklist(txt);
		  }
	  }
      e.value="";
}

function clearAll() {
	var curStorage = retrieveStorage();
	
	$("#tags span").remove();
	curStorage.blacklist = [];
	localStorage.settings = JSON.stringify(curStorage);
}