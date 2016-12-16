chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		var response = {};
		
		console.log("yo got message");
		if (request == 'retrieveStorage') {
			response.data = localStorage.settings;
		}
		
		sendResponse(response);
});