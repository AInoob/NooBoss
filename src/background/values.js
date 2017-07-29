export const defaultValues = [
	['userId',(Math.random().toString(36)+'00000000000000000').slice(2, 19)],
	['notifyStateChange',true],
	['notifyInstallation',true],
	['notifyRemoval',true],
	['historyInstall',true],
	['historyRemove',true],
	['historyUpdate',true],
	['historyEnable',true],
	['historyDisable',true],
	['autoState',true],
	['autoStateNotification',true],
	['autoStateRules','[]'],
	['sortOrder','nameState'],
	['joinCommunity',true],
	['notificationDuration_autoState',5],
	['notificationDuration_stateChange',5],
	['notificationDuration_installation',-1],
	['notificationDuration_removal',-1],
	['listView',true],
	['sendUsage',true],
	['groupList', []],
	['mainColor', { r: 185, g: 7, b: 168, a: 1 }],
	['subColor', { r: 0, g: 0, b: 0, a: 1 }],
	['extensions', true],
	['userscripts', true],
];

export const constantValues = [
	['version', '0.1.5.0'],
];