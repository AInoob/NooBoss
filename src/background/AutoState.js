import { promisedSet, promisedGet, getRegExpFromWildcard, notify, isOn, GL, sendMessage } from '../utils';

export default (NooBoss) => {
	return {
		initiate: () => {
			return new Promise(async resolve => {
				NooBoss.AutoState.rules = [];
				NooBoss.AutoState.tabs = {};
				await NooBoss.AutoState.fetchTabs();
				await NooBoss.AutoState.updateRules();
				NooBoss.AutoState.manage();
				resolve();
			});
		},
		fetchTabs: () => {
			return new Promise(resolve => {
				browser.tabs.query({}, (tabList) => {
					for(let i = 0; i < tabList.length; i++) {
						const tabInfo = tabList[i];
						NooBoss.AutoState.tabs[tabInfo.id] = tabInfo.url;
					}
					resolve();
				});
			});
		},
		updateRules: (rules) => {
			return new Promise(async resolve => {
				if (rules == undefined) {
					rules = await promisedGet('autoStateRules');
				}
				if (!rules) {
					resolve();
				}
				if (rules == 'string') {
					rules = JSON.parse(rules);
				}
				NooBoss.AutoState.rules = rules;
				sendMessage({ job: 'autoStateRulesUpdated', rules: NooBoss.AutoState.rules });
				if (rules != undefined) {
					await promisedSet('autoStateRules', rules);
				}
				resolve();
			});
		},
		newTab: (tab) => {
			NooBoss.AutoState.tabs[tab.id] = tab.url;
			NooBoss.AutoState.manage(tab.id);
		},
		updateTab: (tabId, changeInfo, tab) => {
			if (changeInfo.url) {
				const oldUrl = (NooBoss.AutoState.tabs[tabId] || {}).url;
				if(oldUrl != changeInfo.url) {
					NooBoss.AutoState.tabs[tabId] = changeInfo.url;
					NooBoss.AutoState.manage(tabId);
				}
			}
		},
		removeTab: (tabId) => {
			NooBoss.AutoState.tabs[tabId] = null;
			NooBoss.AutoState.manage();
		},
		replaceTab: (addedTabId, removedTabId) => {
			NooBoss.AutoState.tabs[removedTabId] = null;
			// Not sure if we need this or not, it might be the case that the tab is already recorded
			browser.tabs.get(addedTabId, (tab) => {
				NooBoss.AutoState.newTab(tab);
			});
		},
		manage: (tabId) => {
			const autoState = NooBoss.AutoState;
			const tabs = autoState.tabs;
			const nextPhases = {};
			const enableOnlys = {};
			const disableOnlys={};
			for(let i = 0; i < autoState.rules.length; i++) {
				const rule = autoState.rules[i];
				const appIds = rule.ids;
				const pattern = rule.match.isWildcard ? getRegExpFromWildcard(rule.match.url): new RegExp(rule.match.url, 'i');
				const tabIds = Object.keys(tabs);
				let matched = false;
				const affectedIds = NooBoss.Extensions.getIdsFromGroupsAndIds(appIds);
				for(let j = 0; j < tabIds.length; j++) {
					const url = tabs[tabIds[j]];
					if (pattern.exec(url)) {
						matched = true;
						break;
					}
				}
				switch (rule.action) {
					case 'enableOnly':
						if (matched) {
							affectedIds.map((id) => {
								nextPhases[id]={
									enabled: true,
									tabId,
									ruleId: i
								}
							});
						}
						else{
							affectedIds.map((id) => {
								nextPhases[id]={
									enabled: enableOnlys[id] || false,
									ruleId: i
								}
							});
						}
						break;
					case 'disableOnly':
						if(matched){
							affectedIds.map((id) => {
								nextPhases[id]={
									enabled: false,
									tabId,
									ruleId: i
								}
								disableOnlys[id]=true;
							});
						}
						else{
							affectedIds.map((id) => {
								nextPhases[id]={
									enabled: (!disableOnlys[id])&&true,
									ruleId: i
								}
							});
						}
						break;
					case 'enableWhen':
						if(matched){
							affectedIds.map((id) => {
								nextPhases[id]={
									enabled: true,
									tabId,
									ruleId: i
								}
							});
						}
						break;
					case 'disableWhen':
						if(matched){
							affectedIds.map((id) => {
								nextPhases[id]={
									enabled: false,
									ruleId: i
								}
							});
						}
						break;
				}
			}
			const ids=Object.keys(nextPhases);
			for(let i = 0; i < ids.length; i++) {
				const id=ids[i];
				const phase=nextPhases[id];
				NooBoss.AutoState.setAppState(id, phase.enabled, phase.tabId, phase.ruleId);
			}
		},
		setAppState: async (id, enabled, tabId, ruleId) => {
			if (NooBoss.Extensions.apps[id]) {
				const appInfo = NooBoss.Extensions.apps[id];
				if (appInfo && appInfo.enabled != enabled) {
					appInfo.enabled = enabled;
					await NooBoss.Extensions.toggle(id, enabled);
					let enabledStr = 'enabled';
					if (!enabled) {
						enabledStr = 'disabled';
					}
					isOn('autoStateNotification', async () => {
						notify(GL('autoState'), '', await promisedGet('notificationDuration_autoState'));
					});
					//get('userId', userId => {
					//	newCommunityRecord(false, { userId, category: 'AutoState', event: enabledStr });
					//});
					if (tabId) {
						browser.tabs.reload(tabId);
					}
				}
			}
		},
	};
};
