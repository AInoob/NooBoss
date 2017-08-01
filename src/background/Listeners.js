export default (NooBoss) => {
	return {
		initiate: () => {
			return new Promise(resolve => {
				chrome.management.onInstalled.addListener(appInfo => {
					console.log('install/update');
					console.log(new Date().getTime());
					console.log(appInfo);
				});
				chrome.management.onUninstalled.addListener(id => {
					console.log('uninstall');
					console.log(new Date().getTime());
					console.log(id);
				});
				chrome.management.onEnabled.addListener(appInfo => {
					console.log('enable');
					console.log(new Date().getTime());
					console.log(appInfo);
				});
				chrome.management.onDisabled.addListener(appInfo => {
					console.log('disable');
					console.log(new Date().getTime());
					console.log(appInfo);
				});

				chrome.tabs.onCreated.addListener(tab => {
					if (NooBoss.Options.options['autoState']) {
						NooBoss.AutoState.newTab(tab);
					}
				});
				chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
					if (NooBoss.Options.options['autoState']) {
						NooBoss.AutoState.updateTab(tabId, info, tab);
					}
				});
				chrome.tabs.onRemoved.addListener(tabId => {
					if (NooBoss.Options.options['autoState']) {
						NooBoss.AutoState.removeTab(tabId);
					}
				});
				chrome.tabs.onReplaced.addListener((addedTabId, removedTabId) => {
					if (NooBoss.Options.options['autoState']) {
						NooBoss.AutoState.replace(addedTabId, removedTabId);
					}
				});
				resolve();
			});
		},
	};
};
