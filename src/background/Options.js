import { setIfNull, promisedGet, promisedSet, promisedSetIfNull, clearDB, notify, GL, sendMessage } from '../utils';

export default (NooBoss) => {
	return {
		initiate: () => {
			return new Promise(async resolve => {
				NooBoss.Options.options = {};
				await NooBoss.Options.initiateDefaultValues();
				await NooBoss.Options.initiateConstantValues();
				resolve();
			});
		},
		initiateDefaultValues: () => {
			return new Promise(async resolve => {
				const keyList = Object.keys(NooBoss.defaultValues);
				for(let i = 0; i < keyList.length; i++) {
					const key = keyList[i];
					NooBoss.Options.options[key] = await promisedSetIfNull(key, NooBoss.defaultValues[key]);
					if (key == 'autoStateRules') {
						const value = await promisedGet(key);
						if (typeof(value) == 'string') {
							NooBoss.Options.options[key] = await promisedSet(key, JSON.parse(value));
						}
					}
				}
				resolve();
			});
		},
		initiateConstantValues: () => {
			return new Promise(async resolve => {
				const keyList = Object.keys(NooBoss.constantValues);
				for(let i = 0; i < keyList.length; i++) {
					const key = keyList[i];
					NooBoss.Options.options[key] = await promisedSet(key, NooBoss.constantValues[key]);
				}
				resolve();
			});
		},
		promisedSet: (key, value) => {
			return new Promise(async resolve => {
				await promisedSet(key, value);
				NooBoss.Options.options[key] = value;
				resolve();
			});
		},
		resetOptions: () => {
			return new Promise(async resolve => {
				const keyList = Object.keys(NooBoss.defaultValues);
				for(let i = 0; i < keyList.length; i++) {
					const key = keyList[i];
					await promisedSet(key, NooBoss.defaultValues[key]);
				}
				resolve();
			});
		},
		resetIndexedDB: clearDB,
		importOptions: (optionsString) => {
			let options = null;
			if (!optionsString.match(/^NooBoss-Options/)) {
				notify(GL('backup'), GL('failed_to_import'), 5);
				return;
			}
			try {
				options = JSON.parse(optionsString.substr(16));
			}
			catch (e) {
				console.log(e);
				notify(GL('backup'), GL('failed_to_import'), 5);
				return;
			}
			if (!options) {
				notify(GL('backup'), GL('failed_to_import'), 5);
				return;
			}
			browser.storage.sync.set(options, async () => {
				sendMessage({ job: 'popupNooBossUpdateTheme' });
				sendMessage({ job: 'popupOptionsInitiate' });
				await NooBoss.Options.initiate();
				await NooBoss.Extensions.initiate();
				await NooBoss.AutoState.initiate();
				await NooBoss.History.initiate();
			});
			notify(GL('backup'), GL('successfully_imported'), 5);
		},
		exportOptions: () => {
			browser.storage.sync.get(data => {
				const dataURI='data:text;charset=utf-8,NooBoss-Options:'+JSON.stringify(data);
				const a = document.createElement('a');
				a.href = dataURI;
				a.download = 'NooBoss.options';
				a.style.display = 'none';
				document.body.appendChild(a);
				a.click();
				notify(GL('backup'), GL('successfully_exported'), 5);
			});
		},
	};
};
