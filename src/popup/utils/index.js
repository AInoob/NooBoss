const getDB = (key, callback) => {
	if(callback) {
		const indexedDB = window.indexedDB;
		const open = indexedDB.open('NooBoss', 1);
		open.onupgradeneeded = () => {
			const db = open.result;
			const store = db.createObjectStore('Store', { keyPath: 'key' });
		};
		open.onsuccess = () => {
			const db = open.result;
			const tx = db.transaction('Store', 'readwrite');
			const store = tx.objectStore('Store');
			const action = store.get(key);
			action.onsuccess = (e) => {
				if(e.target.result) {
					callback(e.target.result.value);
				}
				else {
					callback(null);
				}
			}
			action.onerror = () => {
				console.log('getDB fail');
			}
		}
	}
}

const setDB = (key, value, callback) => {
	const indexedDB = window.indexedDB;
	const open = indexedDB.open('NooBoss', 1);
	open.onupgradeneeded = () => {
		const db = open.result;
		const store = db.createObjectStore('Store', { keyPath: 'key' });
	};
	open.onsuccess = () => {
		const db = open.result;
		const tx = db.transaction('Store', 'readwrite');
		const store = tx.objectStore('Store');
		const action = store.put({ key, value });
		action.onsuccess = () => {
			if(callback) {
				callback();
			}
		}
		action.onerror = () => {
			console.log('setDB fail');
		}
	}
}

export { getDB, setDB };
