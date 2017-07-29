export default (NooBoss) => {
	return {
		belloOnce: false,
		history: {},
		bananana: {
			path: NooBoss.constantValues.version,
			title: 'NooBoss ' + NooBoss.constantValues.version,
			referrer: '',
			ua: navigator.userAgent,
			sr: screen.width + 'x' + screen.height,
			ul: navigator.language || navigator.userLanguage,
		},
		bello: (obj) => {
			const id = '' + obj.category + '_' + obj.action + '_' + obj.label;
			if (NooBoss.Bello.history[id] && NooBoss.Bello.history[id] + 10000 > new Date().getTime()) {
				NooBoss.Bello.history[id] = new Date().getTime();
				return;
			}
			NooBoss.Bello.history[id] = new Date().getTime();
			let data = JSON.parse(JSON.stringify(NooBoss.Bello.bananana));
			if (!NooBoss.Bello.belloOnce) {
				NooBoss.Bello.belloOnce = true;
				data = {
					...data,
					type: 'pageview',
					ainoob: Math.random(),
				}
				NooBoss.Bello.ajax('https://ainoob.com/bello/nooboss' + NooBoss.Bello.serialize(data));
			}
			data = JSON.parse(JSON.stringify(NooBoss.Bello.bananana));
			data = {
				...data,
				type: 'event',
				category: obj.category,
				action: obj.action,
				label: obj.label,
				value: obj.value || 0,
				ainoob: Math.random(),
			}
			NooBoss.Bello.ajax('https://ainoob.com/bello/nooboss' + NooBoss.Bello.serialize(data));
		},
		ajax: (url) => {
			const request = new XMLHttpRequest();
			request.open('GET', url, true);
			request.onload = () => {
				if (request.status >= 200 && request.status < 400) {
					console.log(request.responseText);
				}
			}
			request.send();
		},
		serialize: (obj) => {
			return '?'+Object.keys(obj).reduce(function(a,k){a.push(k+'='+encodeURIComponent(obj[k]));return a},[]).join('&')
		},
	};
};
