export const getDB = (key, callback) => {
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

export const setDB = (key, value, callback) => {
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

export const getParameterByName = (name, url) => {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
	const results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
};

export const getString = (elem) => {
	if(elem===undefined||elem===null){
		return '';
	}
	else{
		return elem.toString();
	}
};

export const capFirst = (elem) => {
	const str = getString(elem);
	return str.charAt(0).toUpperCase() + str.slice(1);
};

export const GL = (string) => {
	return chrome.i18n.getMessage(string);
};

export const get = (key, callback) => {
	chrome.storage.sync.get(key, (result) => {
		if(callback)
			callback(result[key]);
	});
};

export const isOn = (key, callbackTrue, callbackFalse, param) => {
	get(key, (value) => {
		if (value == '1' || value == true) {
			if(callbackTrue) {
				callbackTrue(param);
			}
		}
		else {
			if(callbackFalse) {
				callbackFalse(param);
			}
		}
	});
};

export const set = (key, value, callback) => {
	const temp = {};
	temp[key] = value;
	chrome.storage.sync.set(temp, callback);
};

export const setAsync = (key, value) => {
	return new Promise(resolve => {
		const temp = {};
		temp[key] = value;
		chrome.storage.sync.set(temp, () => {
			resolve();
		});
	});
};

export const setIfNull = (key, setValue, callback) => {
	get(key, (value) => {
		if (value == undefined || value == null) {
			set(key, setValue, callback);
		}
		else {
			if (callback) {
				callback();
			}
		}
	});
};


export const generateRGBAString = (rgbaObject) => {
	return 'rgba('+rgbaObject.r+','+rgbaObject.g+','+rgbaObject.b+','+rgbaObject.a+')';
};

export const sendMessage = (message, callback = () => {}) => {
	chrome.runtime.sendMessage(message, callback);
};

export const notify = (title, message, duration) => {
	chrome.notifications.create({
		type: 'basic',
		iconUrl: '/images/icon_128.png',
		title,
		message,
		requireInteraction: true
	}, (notificationId) => {
		if (duration > 0) {
			setTimeout(() => {
				chrome.notifications.clear(notificationId, () => {});
			}, duration * 1000);
		}
	});
};

export const alerty = (text, mainColor, callbackConfirm, callbackCancel) => {
	const alertHolder = document.createElement('div');
	const alertDiv = document.createElement('div');
	const texty = document.createElement('div');
	texty.innerHTML = text;
	const confirmy = document.createElement('button');
	confirmy.innerHTML = GL('confirm');
	confirmy.onclick = () => {
		if (callbackConfirm) {
			callbackConfirm();
		}
		document.body.removeChild(alertHolder);
	};
	const cancely = document.createElement('button');
	cancely.innerHTML = GL('cancel');
	cancely.onclick = () => {
		if (callbackCancel) {
			callbackCancel();
		}
		document.body.removeChild(alertHolder);
	};

	alertHolder.style.position = 'fixed';
	alertHolder.style.width = '100%';
	alertHolder.style.height = '100%';
	alertHolder.style.top = '0';
	alertHolder.style.background = 'rgba(0,0,0,0.4)';

	alertDiv.style.width = '300px';
	alertDiv.style.padding = '13px';
	alertDiv.style.marginLeft = '250px';
	alertDiv.style.marginTop = '100px';
	alertDiv.style.textAlign = 'center';
	alertDiv.style.backgroundColor = 'white';

	texty.style.fontSize = 'large';
	texty.style.marginBottom = '13px';


	confirmy.style.border = 'none';
	confirmy.style.color = 'white';
	confirmy.style.padding = '2px 8px';
	confirmy.style.cursor = 'pointer';
	confirmy.style.outline = 'none';
	confirmy.style.backgroundColor = mainColor;

	cancely.style.border = 'none';
	cancely.style.color = 'white';
	cancely.style.padding = '2px 8px';
	cancely.style.cursor = 'pointer';
	cancely.style.outline = 'none';
	cancely.style.backgroundColor = mainColor;
	cancely.style.marginLeft = '30px';


	alertDiv.appendChild(texty);
	alertDiv.appendChild(confirmy);
	alertDiv.appendChild(cancely);
	alertHolder.appendChild(alertDiv);
	document.body.appendChild(alertHolder);
};
