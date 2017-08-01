import { setIfNull, promisedGet, promisedSet, promisedSetIfNull, clearDB } from '../utils';

export default (NooBoss) => {
	return {
		initiate: () => {
			return new Promise(async resolve => {
				await NooBoss.Options.initiateDefaultValues();
				await NooBoss.Options.initiateConstantValues();
				NooBoss.Options.options = {};
				resolve();
			});
		},
		initiateDefaultValues: () => {
			return new Promise(async resolve => {
				const keyList = Object.keys(NooBoss.defaultValues);
				for(let i = 0; i < keyList.length; i++) {
					const key = keyList[i];
					await promisedSetIfNull(key, NooBoss.defaultValues[key]);
					if (key == 'autoStateRules') {
						const value = await promisedGet(key);
						if (typeof(value) == 'string') {
							await promisedSet(key, JSON.parse(value));
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
					await promisedSet(key, NooBoss.constantValues[key]);
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
	};
};
