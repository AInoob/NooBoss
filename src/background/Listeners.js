export default (NooBoss) => {
	return {
		initiate: () => {
			chrome.management.onInstalled.addListener(appInfo => {
				console.log('install/update');
				console.log(appInfo);
			});
			chrome.management.onUninstalled.addListener(id => {
				console.log('uninstall');
				console.log(id);
			});
			chrome.management.onEnabled.addListener(appInfo => {
				console.log('enable');
				console.log(appInfo);
			});
			chrome.management.onDisabled.addListener(appInfo => {
				console.log('disable');
				console.log(appInfo);
			});

			chrome.tabs.onCreated.addListener(tab => {
			});
			chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
			});
			chrome.tabs.onRemoved.addListener(tabId => {
			});
			chrome.tabs.onReplaced.addListener((addedTabId, removedTabId) => {
			});
		},
	};
};
