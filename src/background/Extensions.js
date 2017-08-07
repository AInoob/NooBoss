import { promisedGet, getIconDBKey, promisedSetDB, promisedGetDB, sendMessage } from '../utils';

export default (NooBoss) => {
	return {
		initiate: () => {
			return new Promise(async resolve => {
				NooBoss.Extensions.apps = {};
				NooBoss.Extensions.tempActiveList = [];
				NooBoss.Extensions.groupList = await promisedGet('groupList');
				await NooBoss.Extensions.getAllApps();
				resolve();
			});
		},
		addTempActive(id) {
			const tempActiveList = NooBoss.Extensions.tempActiveList;
			if (tempActiveList.indexOf(id) == -1) {
				tempActiveList.push(id);
				setTimeout(() => {
					const index = tempActiveList.indexOf(id);
					tempActiveList.splice(index, 1);
				}, 2333);
			}
		},
		getAllApps: () => {
			return new Promise(resolve => {
				browser.management.getAll(async appInfoList => {
					const apps = {};
					for(let i = 0; i < appInfoList.length; i++) {
						const appInfo = appInfoList[i];
						await NooBoss.Extensions.updateAppInfo(appInfo);
					}
					resolve();
				});
			});
		},
		getIdsFromGroupsAndIds: (groupsAndIds) => {
			const appIds = {};
			for(let i = 0; i < groupsAndIds.length; i++) {
				const name = groupsAndIds[i];
				let appId;
				if(name.match(/^NooBoss-Group/)) {
					const group = NooBoss.Extensions.groupList.filter((group) => {
						return group.id == name;
					})[0];
					if(!group) {
						continue;
					}
					for(let j = 0; j < group.appList.length; j++) {
						appId = group.appList[j];
					}
				}
				else {
					appId = name;
				}
				appIds[appId] = true;
			}
			return Object.keys(appIds);
		},
		updateAppInfo: (appInfo, extraInfo) => {
			return new Promise(async resolve => {
				appInfo.icon = await getIconDBKey(appInfo);
				const oldInfo = await promisedGetDB(appInfo.id) || {};
				const time = new Date().getTime();
				oldInfo.installedDate = time;
				oldInfo.lastUpdateDate = time;
				const newInfo = {...oldInfo, ...appInfo, ...extraInfo };
				NooBoss.Extensions.apps[newInfo.id] = newInfo;
				await promisedSetDB(appInfo.id, newInfo);
				resolve();
			});
		},
		updateAppInfoById: (id, updateInfo) => {
			return new Promise(async resolve => {
				if (updateInfo.enabled == false || updateInfo.uninstalledDate) {
					NooBoss.Extensions.addTempActive(id);
				}
				const oldInfo = await promisedGetDB(id);
				if (!oldInfo) {
					resolve();
				}
				const newInfo = {...oldInfo, ...updateInfo };
				NooBoss.Extensions.apps[newInfo.id] = newInfo;
				await promisedSetDB(id, newInfo);
				resolve();
			});
		},
		toggle: (id, enabled) => {
			return new Promise(resolve => {
				if (enabled == undefined) {
					enabled = !NooBoss.Extensions.apps[id].enabled;
				}
				if (id == 'aajodjghehmlpahhboidcpfjcncmcklf' || id == 'nkkbbadgjkchmggnpbammldmkbnhndme') {
					enabled = true;
				}
				browser.management.setEnabled(id, enabled, () => {
					NooBoss.Extensions.apps[id].enabled = enabled;
					sendMessage({ job: 'extensionToggled',id, enabled });
					resolve();
				});
			});
		},
		options: (id) => {
			const url = NooBoss.Extensions.apps[id].optionsUrl;
			browser.tabs.create({ url });
		},
		remove: (id) => {
			browser.management.uninstall(id, { showConfirmDialog: true }, () => {
				delete NooBoss.Extensions.apps.id;
				sendMessage({ job: 'extensionRemoved',id });
			});
		},
		browserOptions: (id) => {
			browser.tabs.create({ url: 'browser://extensions/?id=' + id });
		},
	};
};
