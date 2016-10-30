$(document).ready(function() {
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
		$(this.parentNode).remove(); 
	});
	$("#wrapper").on('click', '#clearall', function() {
		if(confirm("Are you sure you want to clear all tags?"))
			clearAll();
	});
});

function enterTag(e) {
      var txt= e.value.toLowerCase();
      if(txt) $('#tags').append("<span>"+txt+"<div id=\"close\">x</div></span>");
      e.value="";
}

function clearAll() {
	$("#tags span").remove();
}
