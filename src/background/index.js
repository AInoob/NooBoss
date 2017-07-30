import { defaultValues, constantValues } from './values';
import createOptions from './Options';
import createBello from './Bello';
import { set, isOn, GL } from '../utils';

const NooBoss = {
	defaultValues,
	constantValues,
};
window.NooBoss = NooBoss;

NooBoss.initiate = () => {
	NooBoss.Options = createOptions(NooBoss);
	NooBoss.Options.initiate();
	NooBoss.Bello = createBello(NooBoss);
	chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
		switch (message.job) {
			case 'bello':
				NooBoss.Bello.bello(message.bananana);
				break;
			case 'set':
				set(message.key, message.value);
				isOn('bello', NooBoss.Bello.bello.bind(null, { category: 'Options', action: 'set', label: message.key }));
				break;
			case 'reset':
				NooBoss.Options.resetOptions();
				NooBoss.Options.resetIndexedDB(() => {
					NooBoss.Management.init();
					NooBoss.History.init();
				});
				break;
			case 'clearHistory':
				console.log(sender);
				set('history_records', [], () => {
					chrome.runtime.sendMessage({ job: 'popupOptionsInitiate' });
					chrome.notifications.create({
						type:'basic',
						iconUrl: '/images/icon_128.png',
						title: GL(''),
						message: GL(''),
					});
				});
				break;
			case 'toggleAutoState':
				break;
			case 'updateAutoStateRules':
				break;
			case 'updateGroupList':
				break;
		}
	});
};

document.addEventListener('DOMContentLoaded', NooBoss.initiate);
