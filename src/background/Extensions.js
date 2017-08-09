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
					sendMessage({ job: 'extensionToggled', id, enabled });
					resolve();
				});
			});
		},
		groupToggle: (id, enabled) => {
			const group = NooBoss.Extensions.groupList.filter(elem => {
				return elem.id == id;
			})[0];
			group.appList.map(elem => {
				NooBoss.Extensions.toggle(elem, enabled);
			});
		},
		groupCopy: (id) => {
			const group = NooBoss.Extensions.groupList.filter(elem => {
				return elem.id == id;
			})[0];
			const newGroup = JSON.parse(JSON.stringify(group));
			newGroup.id = 'NooBoss-Group-' + (Math.random().toString(36)).slice(2, 19)+(Math.random().toString(36)).slice(2, 19);
			NooBoss.Extensions.groupList.push(newGroup);
			sendMessage({ job: 'groupCopied', newGroup });
		},
		groupRemove: (id) => {
			return new Promise(resolve => {
				NooBoss.Extensions.groupList.map((elem, index) => {
					if (elem.id == id) {
						NooBoss.Extensions.groupList.splice(index, 1);
						sendMessage({ job: 'groupRemoved', index });
						resolve();
					}
				});
			});
		},
		groupListUpdate: (groupList) => {
			return new Promise(resolve => {
				NooBoss.Extensions.groupList = groupList;
				sendMessage({ job: 'groupListUpdated', groupList })
				resolve();
			});
		},
		groupUpdate: (group) => {
			return new Promise(resolve => {
				let groupIndex = -1;
				for(let i = 0; i < NooBoss.Extensions.groupList.length; i++) {
					if (NooBoss.Extensions.groupList[i].id == group.id) {
						NooBoss.Extensions.groupList[i] = group;
						sendMessage({ job: 'groupUpdated', group });
						resolve();
						break;
					}
				}
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
