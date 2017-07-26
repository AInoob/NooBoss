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
};

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
};

const getParameterByName = (name, url) => {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
	const results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
};

const getString = (elem) => {
	if(elem===undefined||elem===null){
		return '';
	}
	else{
		return elem.toString();
	}
}

const capFirst = (elem) => {
	const str = getString(elem);
	return str.charAt(0).toUpperCase() + str.slice(1);
};

export { getDB, setDB, getParameterByName, capFirst };
