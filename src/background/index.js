import { defaultValues, constantValues } from './values';
import createOptions from './Options';
import createBello from './Bello';
import { set, isOn } from '../utils';

const NooBoss = {
	defaultValues,
	constantValues,
};
window.NooBoss = NooBoss;

NooBoss.initiate = () => {
	NooBoss.Options = createOptions(NooBoss);
	NooBoss.Options.initiate();
	NooBoss.Bello = createBello(NooBoss);
	chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
		switch (request.job) {
			case 'bello':
				NooBoss.Bello.bello(request.bananana);
				break;
			case 'set':
				set(request.key, request.value);
				isOn('bello', NooBoss.Bello.bello.bind(null, { category: 'Options', action: 'set', label: request.key }));
				break;
			case 'reset':
				NooBoss.Options.resetOptions();
				NooBoss.Options.resetIndexedDB(() => {
					NooBoss.Management.init();
					NooBoss.History.init();
				});
				break;
			case 'clearHistory':
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
