import { promisedIsOn, getIconDBKey, notify, GL } from '../utils';

export default (NooBoss) => {
	return {
		initiate: () => {
			return new Promise(resolve => {
				/*chrome.management.onInstalled.removeListener();
				chrome.management.onUninstalled.removeListener();
				chrome.management.onEnabled.removeListener();
				chrome.management.onDisabled.removeListener();
				chrome.tabs.onCreated.removeListener();
				chrome.tabs.onUpdated.removeListener();
				chrome.tabs.onRemoved.removeListener();
				chrome.tabs.onReplaced.removeListener();*/
				chrome.management.onInstalled.addListener(async appInfo => {
					appInfo.icon = await getIconDBKey(appInfo);
					await NooBoss.Extensions.updateAppInfo(appInfo);
					let event = 'installed';
					if (NooBoss.Extensions.tempActiveList.indexOf(appInfo.id) != -1) {
						event = 'updated';
					}
					if (NooBoss.Options.options['historyInstall']) {
						const { id, icon, name, version } = appInfo;
						NooBoss.History.addRecord({ event, id, icon, name, version });
					}
					if (NooBoss.Options.options['notifyInstallation']) {
						notify(
							GL('notification'),
							appInfo.name + GL('was_' + event),
							NooBoss.Options.options['notificationDuration_removal']
						);
					}
				});
				chrome.management.onUninstalled.addListener(id => {
					const appInfo = NooBoss.Extensions.apps[id];
					if (NooBoss.Options.options['historyRemove']) {
						const event = 'removed';
						const { id, icon, name, version } = appInfo;
						NooBoss.History.addRecord({ event, id, icon, name, version });
					}
					if (NooBoss.Options.options['notifyRemoval']) {
						notify(
							GL('notification'),
							appInfo.name + GL('was_removed'),
							NooBoss.Options.options['notificationDuration_removal']
						);
					}
					NooBoss.Extensions.updateAppInfoById(id, { uninstalledDate: new Date().getTime() });
				});
				chrome.management.onEnabled.addListener(async appInfo => {
					const icon = await getIconDBKey(appInfo);
					if (NooBoss.Options.options['historyEnable']) {
						const event = 'enabled';
						const { id, name, version } = appInfo;
						NooBoss.History.addRecord({ event, id, icon, name, version });
					}
					if (NooBoss.Options.options['notifyStateChange']) {
						notify(
							GL('notification'),
							appInfo.name + GL('was_enabled'),
							NooBoss.Options.options['notificationDuration_stateChange']
						);
					}
					NooBoss.Extensions.updateAppInfoById(appInfo.id, { enabled: true });
				});
				chrome.management.onDisabled.addListener(async appInfo => {
					const icon = await getIconDBKey(appInfo);
					if (NooBoss.Options.options['historyDisable']) {
						const event = 'disnabled';
						const { id, name, version } = appInfo;
						NooBoss.History.addRecord({ event, id, icon, name, version });
					}
					if (NooBoss.Options.options['notifyStateChange']) {
						notify(
							GL('notification'),
							appInfo.name + GL('was_disabled'),
							NooBoss.Options.options['notificationDuration_stateChange']
						);
					}
					NooBoss.Extensions.updateAppInfoById(appInfo.id, { enabled: false });
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
