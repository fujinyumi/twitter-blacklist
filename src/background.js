chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		var response = {};

		var defaults = {
		'blacklist': []
		};

		if (request == 'retrieveStorage') {
			if (!localStorage.settings) {
				response.data = JSON.stringify(defaults);
			}
			else response.data = localStorage.settings;
		}
		
		sendResponse(response);
});