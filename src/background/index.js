import { defaultValues, constantValues } from './values';
import createOptions from './Options';
import createBello from './Bello';
import createExtensions from './Extensions';
import createAutoState from './AutoState';
import createUserscripts from './Userscripts';
import createHistory from './History';
import createListeners from './Listeners';
import { set, isOn, GL, notify } from '../utils';

const NooBoss = {
	defaultValues,
	constantValues,
};
window.NooBoss = NooBoss;

NooBoss.initiate = () => {
	NooBoss.Options = createOptions(NooBoss);
	NooBoss.Options.initiate();
	NooBoss.Bello = createBello(NooBoss);
	NooBoss.Extensions = createExtensions(NooBoss);
	NooBoss.AutoState = createAutoState(NooBoss);
	NooBoss.Userscripts = createUserscripts(NooBoss);
	NooBoss.History = createHistory(NooBoss);
	NooBoss.History.initiate();
	NooBoss.Listeners = createListeners(NooBoss);
	NooBoss.Listeners.initiate();
	chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
		switch (message.job) {
			case 'bello':
				NooBoss.Bello.bello(message.bananana);
				break;
			case 'set':
				set(message.key, message.value);
				isOn('bello', NooBoss.Bello.bello.bind(null, { category: 'Options', action: 'set', label: message.key }));
				break;
			case 'reset':
				await NooBoss.Options.resetOptions();
				await NooBoss.Options.resetIndexedDB();
				await NooBoss.Extensions.initiate();
				await NooBoss.History.initiate();
				notify(GL('extension_name'), GL('successfully_reset_everything'), 3);
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
		}
	});
};

document.addEventListener('DOMContentLoaded', NooBoss.initiate);
