import { setIfNull, set, get, setAsync } from '../utils';

export default (NooBoss) => {
	return {
		initiate: () => {
			NooBoss.Options.initiateDefaultValues();
			NooBoss.Options.initiateConstantValues();
		},
		initiateDefaultValues: () => {
			const keyList = Object.keys(NooBoss.defaultValues);
			for(let i = 0; i < keyList.length; i++) {
				const key = keyList[i];
				setIfNull(key, NooBoss.defaultValues[key], () => {
					// if is autoState, change it from string to array
					if (key == 'autoStateRules') {
						get(key, (value) => {
							if (typeof(value) == 'string') {
								set(key, JSON.parse(value));
							}
						});
					}
				});
			}
		},
		initiateConstantValues: () => {
			const keyList = Object.keys(NooBoss.constantValues);
			for(let i = 0; i < keyList.length; i++) {
				const key = keyList[i];
				set(key, NooBoss.constantValues[key]);
			}
		},
		resetOptions: () => {
			return new Promise(async resolve => {
				const keyList = Object.keys(NooBoss.defaultValues);
				for(let i = 0; i < keyList.length; i++) {
					const key = keyList[i];
					await setAsync(key, NooBoss.defaultValues[key]);
				}
				resolve();
			});
		},
		resetIndexedDB: () => {
			return new Promise(resolve => {
				const req = window.indexedDB.deleteDatabase('NooBoss');
				req.onerror = (e) => {
					console.log(e);
					resolve();
				}
				req.onsuccess = () => {
					resolve();
				};
			});
		},
	};
};
