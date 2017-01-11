chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		var response = {};

		if (request == 'retrieveStorage') {
			response.data = localStorage.settings;
		}
		
		sendResponse(response);
});