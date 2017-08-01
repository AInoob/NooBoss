import { promisedGet, getIcon, promisedSetDB, promisedGetDB } from '../utils';

export default (NooBoss) => {
	return {
		initiate: () => {
			return new Promise(async resolve => {
				NooBoss.Extensions.apps = {};
				NooBoss.Extensions.groupList = await promisedGet('groupList');
				await NooBoss.Extensions.getAllApps();
				resolve();
			});
		},
		getAllApps: () => {
			return new Promise(resolve => {
				chrome.management.getAll(async appInfoList => {
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
					const group = NooBoss.Extension.groupList.filter((group) => {
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
				const dataUrl = await getIcon(appInfo);
				appInfo.icon = dataUrl;
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
				const oldInfo = await promisedGetDB(id);
				if (!oldInfo) {
					resolve();
				}
				const newInfo = {...oldInfo, ...updateInfo };
				NooBoss.Extensions.apps[newInfo.id] = newInfo;
				await promisedSetDB(id, newInfo);
				resolve();
			});
		}
	};
};
