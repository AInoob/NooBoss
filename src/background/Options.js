import { setIfNull, set, get } from '../utils';

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
			let temp;
			for(let i = 1; i < NooBoss.defaultValues.length; i++){
				temp = NooBoss.defaultValues[i];
				set(temp[0], temp[1]);
			}
		},
		resetIndexedDB: (callback) => {
			let req = window.indexedDB.deleteDatabase('NooBoss');
			req.onerror = (e) => {
				console.log(e);
			}
			if(callback) {
				req.onsuccess = callback;
			}
		},
		set: (name, value, callback) => {
			set(name, value, callback);
		},
	};
};
