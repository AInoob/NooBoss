import { defaultValues, constantValues } from './values';
import createOptions from './Options';
import createBello from './Bello';
import createExtensions from './Extensions';
import createAutoState from './AutoState';
import createUserscripts from './Userscripts';
import createHistory from './History';
import createListeners from './Listeners';
import { set, isOn, GL, notify, sendMessage, promisedGetDB } from '../utils';

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
			case 'extensionToggle':
				NooBoss.Extensions.toggle(message.id, message.enabled);
				break;
			case 'extensionOptions':
				NooBoss.Extensions.options(message.id);
				break;
			case 'extensionRemove':
				NooBoss.Extensions.remove(message.id);
				break;
			case 'extensionBrowserOptions':
				NooBoss.Extensions.browserOptions(message.id);
				break;
			case 'groupToggle':
				NooBoss.Extensions.groupToggle(message.id, message.enabled);
				break;
			case 'groupCopy':
				NooBoss.Extensions.groupCopy(message.id);
				break;
			case 'groupRemove':
				NooBoss.Extensions.groupRemove(message.id);
				break;
			case 'groupListUpdate':
				NooBoss.Extensions.groupListUpdate(message.groupList);
				break;
			case 'newGroup':
				NooBoss.Extensions.newGroup();
				break;
			case 'groupUpdate':
				NooBoss.Extensions.groupUpdate(message.group);
				break;
			case 'launchApp':
				NooBoss.Extensions.launchApp(message.id);
				break;
			case 'openManifest':
				NooBoss.Extensions.openManifest(message.id);
				break;
			case 'autoStateRulesUpdate':
				NooBoss.AutoState.updateRules(message.rules);
				break;
			case 'openWebStore':
				NooBoss.Extensions.openWebStore(message.id);
				break;
			case 'notify':
				notify(message.title, message.message, message.duration);
				break;
			case 'getExtensionFromDB':
				temp = await promisedGetDB(message.id);
				sendMessage({ job: 'updateExtension', extension: temp });
				break;
		}
	});
};

document.addEventListener('DOMContentLoaded', NooBoss.initiate);
