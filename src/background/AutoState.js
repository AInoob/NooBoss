import { promisedGet, getRegExpFromWildcard } from '../utils';

export default (NooBoss) => {
	return {
		initiate: async () => {
			NooBoss.AutoState.reles = [];
			NooBoss.AutoState.tabs = {};
			await NooBoss.fetchTabs();
			await NooBoss.AutoState.updateRules();
			NooBoss.AutoState.manage();
		},
		fetchTabs: () => {
			return new Promise(resolve => {
				chrome.tabs.query({}, (tabList) => {
					for(let i = 0; i < tabList.length; i++) {
						const tabInfo = tabList[i];
						NooBoss.AutoState.tabs[tabInfo.id] = tabInfo.url;
					}
					resolve();
				});
			});
		},
		updateRules: () => {
			return new Promise(async resolve => {
				let rules = await promisedGet('autoStateRules');
				if (!rules) {
					resolve();
				}
				if (rules == 'string') {
					rules = JSON.parse(rules);
				}
				NooBoss.AutoState.rules = rules;
				resolve();
			});
		},
		manage: () => {
			const autoState = NooBoss.AutoState;
			const tabs = autoState.tabs;
			const nextPhases = {};
			const enableOnlys = {};
			const disableOnlys={};
			for(let i = 0; i < autoState.rules.length; i++) {
				const rule = autoState.rules[i];
				const appIds = rule.ids;
				const pattern = Management.autoState.getRegExp(rule.match.url, rule.match.isWildcard);
				const tabIds = Object.keys(tabs);
				let matched=false;
				for(let j = 0; j < tabIds.length; j++) {
					const url = tabs[tabIds[j]];
					if(pattern.exec(url)){
						matched = true;
						break;
					}
				}
				const affectedIds = NooBoss.Extensions.getIdsFromGroupsAndIds(appIds);
				switch (rule.action) {
					case 'enableOnly':
						if (matched) {
							affectedIds.map((id) => {
								nextPhases[id]={
									enabled: true,
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
		},
	};
};
