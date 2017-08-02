import { getDB, setDB } from '../utils';

export default (NooBoss) => {
	return {
		initiate: () => {
			return new Promise(resolve => {
				getDB('history_records', (recordList) => {
					NooBoss.History.recordList = recordList || [];
					resolve();
				});
			});
		},
		addRecord: (record) => {
			return new Promise(resolve => {
				record.date = new Date().getTime();
				NooBoss.History.recordList.push(record);
				setDB('history_records', NooBoss.History.recordList, resolve);
			});
		},
		removeRecord: (index) => {
			return new Promise(resolve => {
				NooBoss.History.recordList.splice(index, 1);
				setDB('history_records', NooBoss.History.recordList, resolve);
			});
		},
		empty: () => {
			return new Promise(resolve => {
				NooBoss.History.recordList = [];
				setDB('history_records', NooBoss.History.recordList, resolve);
			});
		},
		onUpdate: () => {
		},
		listen: () => {
			chrome.management.onInstalled.addListener(appInfo => {
			});
		},
	};
};
