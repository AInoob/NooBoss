import { promisedGet } from '../utils';

export default (NooBoss) => {
	return {
		initiate: () => {
			return new Promise(async resolve => {
				NooBoss.Extensions.groupList = await promisedGet('groupList');
				resolve();
			});
		},
		getIdsFromGroupsAndIds: (groupsAndIds) => {
			const appIds = {};
			for(let i = 0; i < groupsAndIds.length; i++) {
				const name = groupAndIds[k];
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
	};
};
