import { promisedIsOn, getIconDBKey, notify, GL } from '../utils';

export default (NooBoss) => {
	return {
		initiate: () => {
			return new Promise(resolve => {
				/*browser.management.onInstalled.removeListener();
				browser.management.onUninstalled.removeListener();
				browser.management.onEnabled.removeListener();
				browser.management.onDisabled.removeListener();
				browser.tabs.onCreated.removeListener();
				browser.tabs.onUpdated.removeListener();
				browser.tabs.onRemoved.removeListener();
				browser.tabs.onReplaced.removeListener();*/
				browser.management.onInstalled.addListener(async appInfo => {
					appInfo.icon = await getIconDBKey(appInfo);
					await NooBoss.Extensions.updateAppInfo(appInfo);
					let event = 'install';
					if (NooBoss.Extensions.tempActiveList.indexOf(appInfo.id) != -1) {
						event = 'update';
						await NooBoss.Extensions.updateAppInfoById(appInfo.id, { lastUpdateDate: new Date().getTime() });
					}
					if (NooBoss.Options.options['historyInstall']) {
						const { id, icon, name, version } = appInfo;
						NooBoss.History.addRecord({ event, id, icon, name, version });
					}
					if (NooBoss.Options.options['notifyInstallation']) {
						notify(
							GL('notification'),
							appInfo.name + GL('was_' + (event == 'install' ? 'installed' : 'updated')),
							NooBoss.Options.options['notificationDuration_installation']
						);
					}
				});
				browser.management.onUninstalled.addListener(async id => {
					const appInfo = NooBoss.Extensions.apps[id];
					if (NooBoss.Options.options['historyRemove']) {
						const event = 'remove';
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
					await NooBoss.Extensions.updateAppInfoById(id, { uninstalledDate: new Date().getTime() });
					NooBoss.Extensions.delete(id);
				});
				browser.management.onEnabled.addListener(async appInfo => {
					const icon = await getIconDBKey(appInfo);
					if (NooBoss.Options.options['historyEnable']) {
						const event = 'enable';
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
				browser.management.onDisabled.addListener(async appInfo => {
					const icon = await getIconDBKey(appInfo);
					if (NooBoss.Options.options['historyDisable']) {
						const event = 'disable';
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

				browser.tabs.onCreated.addListener(tab => {
					if (NooBoss.Options.options['autoState']) {
						NooBoss.AutoState.newTab(tab);
					}
				});
				browser.tabs.onUpdated.addListener((tabId, info, tab) => {
					if (NooBoss.Options.options['autoState']) {
						NooBoss.AutoState.updateTab(tabId, info, tab);
					}
				});
				browser.tabs.onRemoved.addListener(tabId => {
					if (NooBoss.Options.options['autoState']) {
						NooBoss.AutoState.removeTab(tabId);
					}
				});
				browser.tabs.onReplaced.addListener((addedTabId, removedTabId) => {
					if (NooBoss.Options.options['autoState']) {
						NooBoss.AutoState.replace(addedTabId, removedTabId);
					}
				});
				resolve();
			});
		},
	};
};
