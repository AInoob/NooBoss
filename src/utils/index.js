export const isZh = () => {
	return new Promise(resolve => {
		chrome.i18n.getAcceptLanguages((data) => {
			let result = false;
			if (data.indexOf('zh') != -1) {
				result = true;
				try {
					if (browser.i18n.getUILanguage().indexOf('zh') == -1) {
						result = false;
					}
				} catch (e) {}
			}
			resolve(result);
		})
	});
};

export const GLS = (string, number) => {
	console.log(GL(string));
	console.log(JSON.parse(GL(string)));
	if (number == 0 || number == 1) {
		return JSON.parse(GL(string))[0];
	} else {
		return JSON.parse(GL(string))[1];
	}
};

export const waitFor = (duration) => {
	return new Promise(resolve => {
		setTimeout(resolve, duration);
	});
};

export const getSelf = () => {
	return new Promise(resolve => {
		browser.management.getSelf(extensionInfo => {
			resolve(extensionInfo);
		});
	});
};

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
					callback();
				}
			};
			action.onerror = () => {
				console.log('getDB fail');
			};
		}
	}
};

export const promisedGetDB = (key) => {
	return new Promise(resolve => {
		getDB(key, resolve);
	});
};

export const clearDB = () => {
	new Promise(resolve => {
		const indexedDB = window.indexedDB;
		const open = indexedDB.open('NooBoss', 1);
		open.onsuccess = () => {
			const db = open.result;
			const tx = db.transaction('Store', 'readwrite');
			const store = tx.objectStore('Store');
			const action = store.clear();
			action.onsuccess = () => {
				resolve(0);
			};
			action.onerror = (err) => {
				console.log(err);
				resolve(1);
			};
		};
	});
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
		};
		action.onerror = () => {
			console.log('setDB fail');
		};
	}
};

export const promisedSetDB = (key, value) => {
	return new Promise(resolve => {
		setDB(key, value, resolve);
	});
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
	return browser.i18n.getMessage(string);
};

export const get = (key, callback) => {
	browser.storage.sync.get(key, (result) => {
		if(callback)
			callback(result[key]);
	});
};

export const promisedGet = (key) => {
	return new Promise(resolve => {
		get(key, resolve);
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

export const promisedIsOn = (key) => {
	return new Promise(resolve => {
		isOn(key, resolve.bind(null, true), resolve.bind(null, false));
	});
};

export const set = (key, value, callback) => {
	const temp = {};
	temp[key] = value;
	browser.storage.sync.set(temp, () => {
		callback(value);
	});
};

export const promisedSet = (key, value) => {
	return new Promise(resolve => {
		set(key, value, resolve);
	});
};

export const setIfNull = (key, setValue, callback) => {
	get(key, (value) => {
		if (value == undefined || value == null) {
			set(key, setValue, callback);
		}
		else {
			if (callback) {
				callback(value);
			}
		}
	});
};

export const promisedSetIfNull = (key, setValue) => {
	return new Promise(async resolve => {
		setIfNull(key, setValue, resolve);
	});
};

export const generateRGBAString = (rgbaObject) => {
	return 'rgba('+rgbaObject.r+','+rgbaObject.g+','+rgbaObject.b+','+rgbaObject.a+')';
};

export const rgbaStringToObject = (rgbaString) => {
	let values = rgbaString.substr(5, rgbaString.length - 6).split(',');
	values = values.map((elem, index) => {
		if (index < 3) {
			return parseInt(elem);
		}
		else {
			return parseFloat(elem);
		}
	});
	return { r: values[0], g: values[1], b: values[2], a: values[3] };
};

export const colorToRGBA = (color) => {
	if (color.indexOf('rgba(') != -1) {
		return color;
	}
	else {
		const hex = color;
		var c;
		if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
			c= hex.substring(1).split('');
			if(c.length== 3){
				c= [c[0], c[0], c[1], c[1], c[2], c[2]];
			}
			c= '0x'+c.join('');
			return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',1)';
		}
		throw new Error('Bad Hex');
	}
};

export const copy = obj => {
	return JSON.parse(JSON.stringify(obj));
};

export const fileToDataURL =  file => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.addEventListener("load", () => {
			resolve(reader.result)
		}, false);
		if (file) {
			reader.readAsDataURL(file);
		}
		else {
			reject();
		}
	});
};

export const rgbaChange = (color, changeRGBA) => {
	let rgba = color;
	if (typeof rgba == 'string') {
		rgba = colorToRGBA(rgba);
		rgba = rgbaStringToObject(rgba);
	}
	if (typeof changeRGBA == 'string') {
		changeRGBA = rgbaStringToObject(changeRGBA);
	}
	Object.keys(rgba).map(elem => {
		rgba[elem] = rgba[elem] + changeRGBA[elem];
	});
	return generateRGBAString(rgba);
};

export const sendMessage = (message, callback = () => {}) => {
	browser.runtime.sendMessage(message, callback);
};

export const notify = (title, message, duration) => {
	browser.notifications.create({
		type: 'basic',
		iconUrl: '/images/icon_128.png',
		title,
		message,
		requireInteraction: true
	}, (notificationId) => {
		if (duration > 0) {
			setTimeout(() => {
				browser.notifications.clear(notificationId, () => {});
			}, duration * 1000);
		}
	});
};

export const setIfNullDB = (key, setValue, callback) => {
	getDB(key, (value) => {
		if (value == undefined || value == null) {
			setDB(key, setValue, callback);
		}
		else {
			if (callback) {
				callback(value);
			}
		}
	});
};

export const promisedSetIfNullDB = (key, setValue) => {
	return new Promise(async resolve => {
		setIfNullDB(key, setValue, resolve);
	});
};

export const getIcon = (appInfo) => {
	return new Promise(resolve => {
		let iconUrl = undefined;
		if (appInfo.icons) {
			let maxSize = 0;
			for(let j = 0; j < appInfo.icons.length; j++) {
				const iconInfo = appInfo.icons[j];
				if (iconInfo.size > maxSize) {
					maxSize = iconInfo.size;
					iconUrl = iconInfo.url;
				}
			}
		}
		if(!iconUrl) {
			const canvas = document.createElement("canvas");
			canvas.width = 128;
			canvas.height = 128;
			const ctx = canvas.getContext('2d');
			ctx.font = "120px Arial";
			ctx.fillStyle = "grey";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = "white";
			ctx.fillText(appInfo.name[0], 22, 110);
			const dataUrl = canvas.toDataURL();
			resolve(dataUrl);
		}
		else {
			const img = new Image();
			img.addEventListener('load', () => {
				const canvas = document.createElement("canvas");
				canvas.width = img.width;
				canvas.height = img.height;
				const ctx = canvas.getContext('2d');
				ctx.drawImage(img, 0, 0, img.width, img.height);
				const dataUrl = canvas.toDataURL();
				resolve(dataUrl);
			});
			img.src = iconUrl;
		}
	});
};

export const getCurrentUrl = () => {
	return new Promise(resolve => {
		chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, (tabs) => {
			let url = null;
			if (tabs[0]) {
				url = tabs[0].url || null;
			}
			resolve(url);
		});
	});
}

export const getDomainFromUrl = (url) => {
	if (!url) {
		return '';
	}
	let domain;
	if (url.indexOf("://") > -1) {
		domain = url.split('/')[2];
	}
	else {
		domain = url.split('/')[0];
	}
	domain = domain.split(':')[0];
	const list = domain.split('.');
	if (list.length == 1){
		return list[0];
	}
	return list[list.length - 2] + '.' + list[list.length - 1];
};

export const getIconDBKey = (appInfo) => {
	return new Promise(async resolve => {
		const dataUrl = await getIcon(appInfo);
		const iconDBKey = appInfo.id + '_' + appInfo.version + '_icon';
		if (! await promisedGetDB(iconDBKey)) {
			await promisedSetIfNullDB(iconDBKey, dataUrl);
		}
		resolve(iconDBKey);
	});
};

export const getLanguage = () => {
	return new Promise(resolve => {
		browser.i18n.getAcceptLanguages(languageList => {
			const supportedLanguageList = [ 'ar', 'be', 'bg', 'ca', 'da', 'de', 'el', 'en', 'en_short', 'es', 'eu', 'fa', 'fi', 'fr', 'gl', 'he', 'hu', 'in_BG', 'in_HI', 'in_ID', 'it', 'ja', 'ko', 'ml', 'my', 'nb_NO', 'nl', 'nn_NO', 'pl', 'pt_BR', 'ro', 'ru', 'sv', 'ta', 'th', 'tr', 'uk', 'vi', 'zh_CN', 'zh_TW' ];
			const bestLanguageIndex = supportedLanguagesList.reduce((index, language) => {
				const languageIndex = languageList.indexOf(language);
				if (index == -1 || (languageIndex != -1 && languageIndex < index)) {
					return languageIndex;
				}
			}, -1);
			resolve(bestLanguageIndex == -1 ? 'en' : languageList[bestLanguageIndex]);
		});
	});
};

export const getA = (url) => {
  const parser = document.createElement('a');
  parser.href = url;
  return parser;
};

export const getChromeVersion = () => {
	var match = window.navigator.userAgent.match(/Chrom(?:e|ium)\/([0-9\.]+)/);
  return match ? match[1] : '58.0.3029.110';
};

export const ajax = (req) => {
	return new Promise((resolve, reject) => {
		const request = new XMLHttpRequest();
		const params = (typeof req.data == 'string' || !req.data) ? req.data : Object.keys(req.data).map(
			function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(req.data[k]) }
		).join('&');
		request.open(req.type || 'GET', req.url, req.async == undefined ? true : req.async, req.user, req.password);
		request.onload = () => {
			 if (request.status >= 200 && request.status < 400) {
					resolve(request.responseText);
			 }
			 else {
				 reject('server error');
			 }
		};
		request.onerror = (e) => {
			reject(e);
		};
		if (req.contentType) {
			request.setRequestHeader('Content-Type', req.contentType);
		}
		request.send(params);
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

export const getRegExpFromWildcard = (expr) => {
	// via Greasemonkey/content/convert2RegExp.js
	// Converts a pattern in this programs simple notation to a regular expression.
	// thanks AdBlock! http://www.mozdev.org/source/browse/adblock/adblock/
	var s = new String(expr);
	var res = new String("^");
	for (var i = 0; i < s.length; i++) {
		switch (s[i]) {
			case "*":
				res += ".*";
				break;
			case ".":
			case "?":
			case "^":
			case "$":
			case "+":
			case "{":
			case "[":
			case "|":
			case "(":
			case ")":
			case "]":
				res += "\\" + s[i];
				break;
			case "\\":
				res += "\\\\";
				break;
			case " ":
				break;
			default:
				res += s[i];
				break;
		}
	}
	var tldRegExp = new RegExp("^(\\^(?:[^/]*)(?://)?(?:[^/]*))(\\\\\\.tld)((?:/.*)?)$")
	var tldRes = res.match(tldRegExp);
	if (tldRes) {
		var tldStr = "\.(?:demon\\.co\\.uk|esc\\.edu\\.ar|(?:c[oi]\\.)?[^\\.]\\.(?:vt|ne|ks|il|hi|sc|nh|ia|wy|or|ma|vi|tn|in|az|id|nc|co|dc|nd|me|al|ak|de|wv|nm|mo|pr|nj|sd|md|va|ri|ut|ct|pa|ok|ky|mt|ga|la|oh|ms|wi|wa|gu|mi|tx|fl|ca|ar|mn|ny|nv)\\.us|[^\\.]\\.(?:(?:pvt\\.)?k12|cc|tec|lib|state|gen)\\.(?:vt|ne|ks|il|hi|sc|nh|ia|wy|or|ma|vi|tn|in|az|id|nc|co|dc|nd|me|al|ak|de|wv|nm|mo|pr|nj|sd|md|va|ri|ut|ct|pa|ok|ky|mt|ga|la|oh|ms|wi|wa|gu|mi|tx|fl|ca|ar|mn|ny|nv)\\.us|[^\\.]\\.vt|ne|ks|il|hi|sc|nh|ia|wy|or|ma|vi|tn|in|az|id|nc|co|dc|nd|me|al|ak|de|wv|nm|mo|pr|nj|sd|md|va|ri|ut|ct|pa|ok|ky|mt|ga|la|oh|ms|wi|wa|gu|mi|tx|fl|ca|ar|mn|ny|nvus|ne|gg|tr|mm|ki|biz|sj|my|hn|gl|ro|tn|co|br|coop|cy|bo|ck|tc|bv|ke|aero|cs|dm|km|bf|af|mv|ls|tm|jm|pg|ky|ga|pn|sv|mq|hu|za|se|uy|iq|ai|com|ve|na|ba|ph|xxx|no|lv|tf|kz|ma|in|id|si|re|om|by|fi|gs|ir|li|tz|td|cg|pa|am|tv|jo|bi|ee|cd|pk|mn|gd|nz|as|lc|ae|cn|ag|mx|sy|cx|cr|vi|sg|bm|kh|nr|bz|vu|kw|gf|al|uz|eh|int|ht|mw|gm|bg|gu|info|aw|gy|ac|ca|museum|sk|ax|es|kp|bb|sa|et|ie|tl|org|tj|cf|im|mk|de|pro|md|fm|cl|jp|bn|vn|gp|sm|ar|dj|bd|mc|ug|nu|ci|dk|nc|rw|aq|name|st|hm|mo|gq|ps|ge|ao|gr|va|is|mt|gi|la|bh|ms|bt|gb|it|wf|sb|ly|ng|gt|lu|il|pt|mh|eg|kg|pf|um|fr|sr|vg|fj|py|pm|sn|sd|au|sl|gh|us|mr|dz|ye|kn|cm|arpa|bw|lk|mg|tk|su|sc|ru|travel|az|ec|mz|lb|ml|bj|edu|pr|fk|lr|nf|np|do|mp|bs|to|cu|ch|yu|eu|mu|ni|pw|pl|gov|pe|an|ua|uk|gw|tp|kr|je|tt|net|fo|jobs|yt|cc|sh|io|zm|hk|th|so|er|cz|lt|mil|hr|gn|be|qa|cv|vc|tw|ws|ad|sz|at|tg|zw|nl|info\\.tn|org\\.sd|med\\.sd|com\\.hk|org\\.ai|edu\\.sg|at\\.tt|mail\\.pl|net\\.ni|pol\\.dz|hiroshima\\.jp|org\\.bh|edu\\.vu|net\\.im|ernet\\.in|nic\\.tt|com\\.tn|go\\.cr|jersey\\.je|bc\\.ca|com\\.la|go\\.jp|com\\.uy|tourism\\.tn|com\\.ec|conf\\.au|dk\\.org|shizuoka\\.jp|ac\\.vn|matsuyama\\.jp|agro\\.pl|yamaguchi\\.jp|edu\\.vn|yamanashi\\.jp|mil\\.in|sos\\.pl|bj\\.cn|net\\.au|ac\\.ae|psi\\.br|sch\\.ng|org\\.mt|edu\\.ai|edu\\.ck|ac\\.yu|org\\.ws|org\\.ng|rel\\.pl|uk\\.tt|com\\.py|aomori\\.jp|co\\.ug|video\\.hu|net\\.gg|org\\.pk|id\\.au|gov\\.zw|mil\\.tr|net\\.tn|org\\.ly|re\\.kr|mil\\.ye|mil\\.do|com\\.bb|net\\.vi|edu\\.na|co\\.za|asso\\.re|nom\\.pe|edu\\.tw|name\\.et|jl\\.cn|gov\\.ye|ehime\\.jp|miyazaki\\.jp|kanagawa\\.jp|gov\\.au|nm\\.cn|he\\.cn|edu\\.sd|mod\\.om|web\\.ve|edu\\.hk|medecin\\.fr|org\\.cu|info\\.au|edu\\.ve|nx\\.cn|alderney\\.gg|net\\.cu|org\\.za|mb\\.ca|com\\.ye|edu\\.pa|fed\\.us|ac\\.pa|alt\\.na|mil\\.lv|fukuoka\\.jp|gen\\.in|gr\\.jp|gov\\.br|gov\\.ac|id\\.fj|fukui\\.jp|hu\\.com|org\\.gu|net\\.ae|mil\\.ph|ltd\\.je|alt\\.za|gov\\.np|edu\\.jo|net\\.gu|g12\\.br|org\\.tn|store\\.co|fin\\.tn|ac\\.nz|gouv\\.fr|gov\\.il|org\\.ua|org\\.do|org\\.fj|sci\\.eg|gov\\.tt|cci\\.fr|tokyo\\.jp|net\\.lv|gov\\.lc|ind\\.br|ca\\.tt|gos\\.pk|hi\\.cn|net\\.do|co\\.tv|web\\.co|com\\.pa|com\\.ng|ac\\.ma|gov\\.bh|org\\.zw|csiro\\.au|lakas\\.hu|gob\\.ni|gov\\.fk|org\\.sy|gov\\.lb|gov\\.je|ed\\.cr|nb\\.ca|net\\.uy|com\\.ua|media\\.hu|com\\.lb|nom\\.pl|org\\.br|hk\\.cn|co\\.hu|org\\.my|gov\\.dz|sld\\.pa|gob\\.pk|net\\.uk|guernsey\\.gg|nara\\.jp|telememo\\.au|k12\\.tr|org\\.nz|pub\\.sa|edu\\.ac|com\\.dz|edu\\.lv|edu\\.pk|com\\.ph|net\\.na|net\\.et|id\\.lv|au\\.com|ac\\.ng|com\\.my|net\\.cy|unam\\.na|nom\\.za|net\\.np|info\\.pl|priv\\.hu|rec\\.ve|ac\\.uk|edu\\.mm|go\\.ug|ac\\.ug|co\\.dk|net\\.tt|oita\\.jp|fi\\.cr|org\\.ac|aichi\\.jp|org\\.tt|edu\\.bh|us\\.com|ac\\.kr|js\\.cn|edu\\.ni|com\\.mt|fam\\.pk|experts-comptables\\.fr|or\\.kr|org\\.au|web\\.pk|mil\\.jo|biz\\.pl|org\\.np|city\\.hu|org\\.uy|auto\\.pl|aid\\.pl|bib\\.ve|mo\\.cn|br\\.com|dns\\.be|sh\\.cn|org\\.mo|com\\.sg|me\\.uk|gov\\.kw|eun\\.eg|kagoshima\\.jp|ln\\.cn|seoul\\.kr|school\\.fj|com\\.mk|e164\\.arpa|rnu\\.tn|pro\\.ae|org\\.om|gov\\.my|net\\.ye|gov\\.do|co\\.im|org\\.lb|plc\\.co\\.im|net\\.jp|go\\.id|net\\.tw|gov\\.ai|tlf\\.nr|ac\\.im|com\\.do|net\\.py|tozsde\\.hu|com\\.na|tottori\\.jp|net\\.ge|gov\\.cn|org\\.bb|net\\.bs|ac\\.za|rns\\.tn|biz\\.pk|gov\\.ge|org\\.uk|org\\.fk|nhs\\.uk|net\\.bh|tm\\.za|co\\.nz|gov\\.jp|jogasz\\.hu|shop\\.pl|media\\.pl|chiba\\.jp|city\\.za|org\\.ck|net\\.id|com\\.ar|gon\\.pk|gov\\.om|idf\\.il|net\\.cn|prd\\.fr|co\\.in|or\\.ug|red\\.sv|edu\\.lb|k12\\.ec|gx\\.cn|net\\.nz|info\\.hu|ac\\.zw|info\\.tt|com\\.ws|org\\.gg|com\\.et|ac\\.jp|ac\\.at|avocat\\.fr|org\\.ph|sark\\.gg|org\\.ve|tm\\.pl|net\\.pg|gov\\.co|com\\.lc|film\\.hu|ishikawa\\.jp|hotel\\.hu|hl\\.cn|edu\\.ge|com\\.bm|ac\\.om|tec\\.ve|edu\\.tr|cq\\.cn|com\\.pk|firm\\.in|inf\\.br|gunma\\.jp|gov\\.tn|oz\\.au|nf\\.ca|akita\\.jp|net\\.sd|tourism\\.pl|net\\.bb|or\\.at|idv\\.tw|dni\\.us|org\\.mx|conf\\.lv|net\\.jo|nic\\.in|info\\.vn|pe\\.kr|tw\\.cn|org\\.eg|ad\\.jp|hb\\.cn|kyonggi\\.kr|bourse\\.za|org\\.sb|gov\\.gg|net\\.br|mil\\.pe|kobe\\.jp|net\\.sa|edu\\.mt|org\\.vn|yokohama\\.jp|net\\.il|ac\\.cr|edu\\.sb|nagano\\.jp|travel\\.pl|gov\\.tr|com\\.sv|co\\.il|rec\\.br|biz\\.om|com\\.mm|com\\.az|org\\.vu|edu\\.ng|com\\.mx|info\\.co|realestate\\.pl|mil\\.sh|yamagata\\.jp|or\\.id|org\\.ae|greta\\.fr|k12\\.il|com\\.tw|gov\\.ve|arts\\.ve|cul\\.na|gov\\.kh|org\\.bm|etc\\.br|or\\.th|ch\\.vu|de\\.tt|ind\\.je|org\\.tw|nom\\.fr|co\\.tt|net\\.lc|intl\\.tn|shiga\\.jp|pvt\\.ge|gov\\.ua|org\\.pe|net\\.kh|co\\.vi|iwi\\.nz|biz\\.vn|gov\\.ck|edu\\.eg|zj\\.cn|press\\.ma|ac\\.in|eu\\.tt|art\\.do|med\\.ec|bbs\\.tr|gov\\.uk|edu\\.ua|eu\\.com|web\\.do|szex\\.hu|mil\\.kh|gen\\.nz|okinawa\\.jp|mob\\.nr|edu\\.ws|edu\\.sv|xj\\.cn|net\\.ru|dk\\.tt|erotika\\.hu|com\\.sh|cn\\.com|edu\\.pl|com\\.nc|org\\.il|arts\\.co|chirurgiens-dentistes\\.fr|net\\.pa|takamatsu\\.jp|net\\.ng|org\\.hu|net\\.in|net\\.vu|gen\\.tr|shop\\.hu|com\\.ae|tokushima\\.jp|za\\.com|gov\\.eg|co\\.jp|uba\\.ar|net\\.my|biz\\.et|art\\.br|ac\\.fk|gob\\.pe|com\\.bs|co\\.ae|de\\.net|net\\.eg|hyogo\\.jp|edunet\\.tn|museum\\.om|nom\\.ve|rnrt\\.tn|hn\\.cn|com\\.fk|edu\\.dz|ne\\.kr|co\\.je|sch\\.uk|priv\\.pl|sp\\.br|net\\.hk|name\\.vn|com\\.sa|edu\\.bm|qc\\.ca|bolt\\.hu|per\\.kh|sn\\.cn|mil\\.id|kagawa\\.jp|utsunomiya\\.jp|erotica\\.hu|gd\\.cn|net\\.tr|edu\\.np|asn\\.au|com\\.gu|ind\\.tn|mil\\.br|net\\.lb|nom\\.co|org\\.la|mil\\.pl|ac\\.il|gov\\.jo|com\\.kw|edu\\.sh|otc\\.au|gmina\\.pl|per\\.sg|gov\\.mo|int\\.ve|news\\.hu|sec\\.ps|ac\\.pg|health\\.vn|sex\\.pl|net\\.nc|qc\\.com|idv\\.hk|org\\.hk|gok\\.pk|com\\.ac|tochigi\\.jp|gsm\\.pl|law\\.za|pro\\.vn|edu\\.pe|info\\.et|sch\\.gg|com\\.vn|gov\\.bm|com\\.cn|mod\\.uk|gov\\.ps|toyama\\.jp|gv\\.at|yk\\.ca|org\\.et|suli\\.hu|edu\\.my|org\\.mm|co\\.yu|int\\.ar|pe\\.ca|tm\\.hu|net\\.sb|org\\.yu|com\\.ru|com\\.pe|edu\\.kh|edu\\.kw|org\\.qa|med\\.om|net\\.ws|org\\.in|turystyka\\.pl|store\\.ve|org\\.bs|mil\\.uy|net\\.ar|iwate\\.jp|org\\.nc|us\\.tt|gov\\.sh|nom\\.fk|go\\.th|gov\\.ec|com\\.br|edu\\.do|gov\\.ng|pro\\.tt|sapporo\\.jp|net\\.ua|tm\\.fr|com\\.lv|com\\.mo|edu\\.uk|fin\\.ec|edu\\.ps|ru\\.com|edu\\.ec|ac\\.fj|net\\.mm|veterinaire\\.fr|nom\\.re|ingatlan\\.hu|fr\\.vu|ne\\.jp|int\\.co|gov\\.cy|org\\.lv|de\\.com|nagasaki\\.jp|com\\.sb|gov\\.za|org\\.lc|com\\.fj|ind\\.in|or\\.cr|sc\\.cn|chambagri\\.fr|or\\.jp|forum\\.hu|tmp\\.br|reklam\\.hu|gob\\.sv|com\\.pl|saitama\\.jp|name\\.tt|niigata\\.jp|sklep\\.pl|nom\\.ni|co\\.ma|net\\.la|co\\.om|pharmacien\\.fr|port\\.fr|mil\\.gu|au\\.tt|edu\\.gu|ngo\\.ph|com\\.ve|ac\\.th|gov\\.fj|barreau\\.fr|net\\.ac|ac\\.je|org\\.kw|sport\\.hu|ac\\.cn|net\\.bm|ibaraki\\.jp|tel\\.no|org\\.cy|edu\\.mo|gb\\.net|kyoto\\.jp|sch\\.sa|com\\.au|edu\\.lc|fax\\.nr|gov\\.mm|it\\.tt|org\\.jo|nat\\.tn|mil\\.ve|be\\.tt|org\\.az|rec\\.co|co\\.ve|gifu\\.jp|net\\.th|hokkaido\\.jp|ac\\.gg|go\\.kr|edu\\.ye|qh\\.cn|ab\\.ca|org\\.cn|no\\.com|co\\.uk|gov\\.gu|de\\.vu|miasta\\.pl|kawasaki\\.jp|co\\.cr|miyagi\\.jp|org\\.jp|osaka\\.jp|web\\.za|net\\.za|gov\\.pk|gov\\.vn|agrar\\.hu|asn\\.lv|org\\.sv|net\\.sh|org\\.sa|org\\.dz|assedic\\.fr|com\\.sy|net\\.ph|mil\\.ge|es\\.tt|mobile\\.nr|co\\.kr|ltd\\.uk|ac\\.be|fgov\\.be|geek\\.nz|ind\\.gg|net\\.mt|maori\\.nz|ens\\.tn|edu\\.py|gov\\.sd|gov\\.qa|nt\\.ca|com\\.pg|org\\.kh|pc\\.pl|com\\.eg|net\\.ly|se\\.com|gb\\.com|edu\\.ar|sch\\.je|mil\\.ac|mil\\.ar|okayama\\.jp|gov\\.sg|ac\\.id|co\\.id|com\\.ly|huissier-justice\\.fr|nic\\.im|gov\\.lv|nu\\.ca|org\\.sg|com\\.kh|org\\.vi|sa\\.cr|lg\\.jp|ns\\.ca|edu\\.co|gov\\.im|edu\\.om|net\\.dz|org\\.pl|pp\\.ru|tm\\.mt|org\\.ar|co\\.gg|org\\.im|edu\\.qa|org\\.py|edu\\.uy|targi\\.pl|com\\.ge|gub\\.uy|gov\\.ar|ltd\\.gg|fr\\.tt|net\\.qa|com\\.np|ass\\.dz|se\\.tt|com\\.ai|org\\.ma|plo\\.ps|co\\.at|med\\.sa|net\\.sg|kanazawa\\.jp|com\\.fr|school\\.za|net\\.pl|ngo\\.za|net\\.sy|ed\\.jp|org\\.na|net\\.ma|asso\\.fr|police\\.uk|powiat\\.pl|govt\\.nz|sk\\.ca|tj\\.cn|mil\\.ec|com\\.jo|net\\.mo|notaires\\.fr|avoues\\.fr|aeroport\\.fr|yn\\.cn|gov\\.et|gov\\.sa|gov\\.ae|com\\.tt|art\\.dz|firm\\.ve|com\\.sd|school\\.nz|edu\\.et|gob\\.pa|telecom\\.na|ac\\.cy|gz\\.cn|net\\.kw|mobil\\.nr|nic\\.uk|co\\.th|com\\.vu|com\\.re|belgie\\.be|nl\\.ca|uk\\.com|com\\.om|utazas\\.hu|presse\\.fr|co\\.ck|xz\\.cn|org\\.tr|mil\\.co|edu\\.cn|net\\.ec|on\\.ca|konyvelo\\.hu|gop\\.pk|net\\.om|info\\.ve|com\\.ni|sa\\.com|com\\.tr|sch\\.sd|fukushima\\.jp|tel\\.nr|atm\\.pl|kitakyushu\\.jp|com\\.qa|firm\\.co|edu\\.tt|games\\.hu|mil\\.nz|cri\\.nz|net\\.az|org\\.ge|mie\\.jp|net\\.mx|sch\\.ae|nieruchomosci\\.pl|int\\.vn|edu\\.za|com\\.cy|wakayama\\.jp|gov\\.hk|org\\.pa|edu\\.au|gov\\.in|pro\\.om|2000\\.hu|szkola\\.pl|shimane\\.jp|co\\.zw|gove\\.tw|com\\.co|net\\.ck|net\\.pk|net\\.ve|org\\.ru|uk\\.net|org\\.co|uu\\.mt|com\\.cu|mil\\.za|plc\\.uk|lkd\\.co\\.im|gs\\.cn|sex\\.hu|net\\.je|kumamoto\\.jp|mil\\.lb|edu\\.yu|gov\\.ws|sendai\\.jp|eu\\.org|ah\\.cn|net\\.vn|gov\\.sb|net\\.pe|nagoya\\.jp|geometre-expert\\.fr|net\\.fk|biz\\.tt|org\\.sh|edu\\.sa|saga\\.jp|sx\\.cn|org\\.je|org\\.ye|muni\\.il|kochi\\.jp|com\\.bh|org\\.ec|priv\\.at|gov\\.sy|org\\.ni|casino\\.hu|res\\.in|uy\\.com)";
		res = tldRes[1] + tldStr + tldRes[3];
	}
	return new RegExp(res + "$", "i");
};
