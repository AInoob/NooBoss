import { defaultValues, constantValues } from './values';
import createOptions from './Options';
import createBello from './Bello';
import createExtensions from './Extensions';
import createAutoState from './AutoState';
import createUserscripts from './Userscripts';
import createHistory from './History';
import createListeners from './Listeners';
import { set, isOn, GL, notify, sendMessage } from '../utils';

const NooBoss = {
	defaultValues,
	constantValues,
};
window.NooBoss = NooBoss;

NooBoss.initiate = async () => {
	NooBoss.Options = createOptions(NooBoss);
	NooBoss.Bello = createBello(NooBoss);
	NooBoss.Extensions = createExtensions(NooBoss);
	NooBoss.AutoState = createAutoState(NooBoss);
	//NooBoss.Userscripts = createUserscripts(NooBoss);
	NooBoss.History = createHistory(NooBoss);
	NooBoss.Listeners = createListeners(NooBoss);
	await NooBoss.Options.initiate();
	console.log(1);
	await NooBoss.Extensions.initiate();
	console.log(2);
	await NooBoss.AutoState.initiate();
	console.log(3);
	await NooBoss.History.initiate();
	console.log(4);
	await NooBoss.Listeners.initiate();
	console.log(5);
	chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
		switch (message.job) {
			case 'bello':
				NooBoss.Bello.bello(message.bananana);
				break;
			case 'set':
				await NooBoss.Options.promisedSet(message.key, message.value);
				isOn('bello', NooBoss.Bello.bello.bind(null, { category: 'Options', action: 'set', label: message.key }));
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
				isOn('bello', NooBoss.Bello.bello.bind(null, { category: 'Options', action: 'reset', label: '' }));
				break;
			case 'emptyHistory':
				await NooBoss.History.empty();
				notify(GL('extension_name'), GL('successfully_emptied_history'), 3);
				isOn('bello', NooBoss.Bello.bello.bind(null, { category: 'Options', action: 'emptyHistory', label: '' }));
				break;
			case 'toggleAutoState':
				isOn('bello', NooBoss.Bello.bello.bind(null, { category: 'Options', action: 'set', label: 'autoState' }));
				break;
			case 'updateAutoStateRules':
				isOn('bello', NooBoss.Bello.bello.bind(null, { category: 'AutoState', action: 'updateAutoStateRules', label: '' }));
				break;
			case 'updateGroupList':
				isOn('bello', NooBoss.Bello.bello.bind(null, { category: 'Extensions', action: 'updateGroupList', label: '' }));
				break;
			case 'importOptions':
				NooBoss.Options.importOptions(message.optionsString);
				isOn('bello', NooBoss.Bello.bello.bind(null, { category: 'Options', action: 'importOptions' }));
				break;
			case 'exportOptions':
				NooBoss.Options.exportOptions();
				isOn('bello', NooBoss.Bello.bello.bind(null, { category: 'Options', action: 'exportOptions' }));
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
		}
	});
};

document.addEventListener('DOMContentLoaded', NooBoss.initiate);
