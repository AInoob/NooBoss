import { defaultValues, constantValues } from './values';
import createOptions from './Options';
import createBello from './Bello';
import createExtensions from './Extensions';
import createAutoState from './AutoState';
import createUserscripts from './Userscripts';
import createHistory from './History';
import createListeners from './Listeners';
import { getIconDBKey, waitFor, getSelf, set, isOn, GL, notify, sendMessage, promisedGetDB } from '../utils';

const NooBoss = {
	defaultValues,
	constantValues,
};
window.NooBoss = NooBoss;
window.browser = chrome;

NooBoss.initiate = async () => {
	NooBoss.Options = createOptions(NooBoss);
	NooBoss.Bello = createBello(NooBoss);
	NooBoss.Extensions = createExtensions(NooBoss);
	NooBoss.AutoState = createAutoState(NooBoss);
	//NooBoss.Userscripts = createUserscripts(NooBoss);
	NooBoss.History = createHistory(NooBoss);
	NooBoss.Listeners = createListeners(NooBoss);
	await NooBoss.Options.initiate();
	await NooBoss.Extensions.initiate();
	await NooBoss.AutoState.initiate();
	await NooBoss.History.initiate();
	await NooBoss.Listeners.initiate();
	browser.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
		let temp;
		switch (message.job) {
			case 'bello':
				NooBoss.Bello.bello(message.bananana);
				break;
			case 'set':
				await NooBoss.Options.promisedSet(message.key, message.value);
				if (message.key == 'viewMode') {
					sendMessage({ job: 'updateViewMode', value: message.value });
				}
				NooBoss.Bello.bello({ category: 'Options', action: message.job, label: message.key });
				break;
			case 'reset':
				await NooBoss.Options.resetOptions();
				await NooBoss.Options.resetIndexedDB();
				await NooBoss.Options.initiate();
				await NooBoss.Extensions.initiate();
				await NooBoss.History.initiate();
				notify(GL('extension_name'), GL('successfully_reset_everything'), 3);
				sendMessage({ job: 'popupNooBossUpdateTheme' });
				sendMessage({ job: 'popupOptionsInitiate' });
				NooBoss.Bello.bello({ category: 'Options', action: message.job });
				break;
			case 'emptyHistory':
				await NooBoss.History.empty();
				notify(GL('extension_name'), GL('successfully_emptied_history'), 3);
				NooBoss.Bello.bello({ category: 'Options', action: message.job });
				break;
			case 'updateAutoStateRules':
				NooBoss.Bello.bello({ category: 'AutoState', action: message.job });
				break;
			case 'updateGroupList':
				NooBoss.Bello.bello({ category: 'Extensions', action: message.job });
				break;
			case 'importOptions':
				NooBoss.Options.importOptions(message.optionsString);
				NooBoss.Bello.bello({ category: 'Options', action: message.job });
				break;
			case 'exportOptions':
				NooBoss.Options.exportOptions();
				NooBoss.Bello.bello({ category: 'Options', action: message.job });
				break;
			case 'getAllExtensions':
				sendResponse(NooBoss.Extensions.apps);
				break;
			case 'getGroupList':
				sendResponse(NooBoss.Extensions.groupList);
				break;
			case 'getAutoStateRuleList':
				sendResponse(NooBoss.AutoState.rules);
				break;
			case 'autoStateRulesUpdate':
				NooBoss.AutoState.updateRules(message.rules);
				NooBoss.Bello.bello({ category: 'autoState', action: message.action, id: message.id });
				break;
			case 'extensionToggle':
				NooBoss.Extensions.toggle(message.id, message.enabled);
				NooBoss.Bello.bello({ category: 'manage', action: message.job, id: message.id });
				break;
			case 'extensionOptions':
				NooBoss.Extensions.options(message.id);
				NooBoss.Bello.bello({ category: 'manage', action: message.job, id: message.id });
				break;
			case 'extensionRemove':
				NooBoss.Extensions.remove(message.id);
				NooBoss.Bello.bello({ category: 'manage', action: message.job, id: message.id });
				break;
			case 'extensionBrowserOptions':
				NooBoss.Extensions.browserOptions(message.id);
				NooBoss.Bello.bello({ category: 'manage', action: message.job, id: message.id });
				break;
			case 'groupToggle':
				NooBoss.Extensions.groupToggle(message.id, message.enabled);
				NooBoss.Bello.bello({ category: 'manage', action: message.job });
				break;
			case 'groupCopy':
				NooBoss.Extensions.groupCopy(message.id);
				NooBoss.Bello.bello({ category: 'manage', action: message.job });
				break;
			case 'groupRemove':
				NooBoss.Extensions.groupRemove(message.id);
				NooBoss.Bello.bello({ category: 'manage', action: message.job });
				break;
			case 'groupListUpdate':
				NooBoss.Extensions.groupListUpdate(message.groupList);
				NooBoss.Bello.bello({ category: 'manage', action: message.job });
				break;
			case 'newGroup':
				NooBoss.Extensions.newGroup();
				NooBoss.Bello.bello({ category: 'manage', action: message.job });
				break;
			case 'groupUpdate':
				NooBoss.Extensions.groupUpdate(message.group);
				break;
			case 'launchApp':
				NooBoss.Extensions.launchApp(message.id);
				NooBoss.Bello.bello({ category: 'manage', action: message.job, id: message.id });
				break;
			case 'openManifest':
				NooBoss.Extensions.openManifest(message.id);
				NooBoss.Bello.bello({ category: 'manage', action: message.job, id: message.id });
				break;
			case 'openWebStore':
				NooBoss.Extensions.openWebStore(message.id);
				NooBoss.Bello.bello({ category: 'manage', action: message.job, id: message.id });
				break;
			case 'notify':
				notify(message.title, message.message, message.duration);
				break;
			case 'getExtensionFromDB':
				temp = await promisedGetDB(message.id);
				sendMessage({ job: 'updateExtension', extension: temp });
				break;
			case 'historyRemoveRecord':
				NooBoss.History.removeRecord(message.index);
				NooBoss.Bello.bello({ category: 'history', action: message.job });
				break;
		}
	});
};

document.addEventListener('DOMContentLoaded', NooBoss.initiate);

chrome.runtime.onInstalled.addListener(async details => {
	await waitFor(3000);
	const extensionInfo = await getSelf();
	const icon = await getIconDBKey(extensionInfo);
	const { id, name, version } = extensionInfo;
	let event;
	if (details.reason == "install") {
		event = 'install';
		NooBoss.History.addRecord({ event, id, icon, name, version });
	} else if (details.reason == "update") {
		event = 'update';
		NooBoss.History.addRecord({ event, id, icon, name, version });
	}
});