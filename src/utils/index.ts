export const generateRGBAString = (rgbaObject: {
  r: number
	g: number
	b: number
	a: number
}) => {
	return 'rgba('+rgbaObject.r+','+rgbaObject.g+','+rgbaObject.b+','+rgbaObject.a+')';
};

export const rgbaStringToObject = (rgbaString: string) => {
	let values: any = rgbaString.substr(5, rgbaString.length - 6).split(',');
	values = values.map((elem: string, index: number) => {
		if (index < 3) {
			return parseInt(elem);
		}
		else {
			return parseFloat(elem);
		}
	});
	return { r: values[0], g: values[1], b: values[2], a: values[3] };
};

export const colorToRGBA = (color: string) => {
	if (color.indexOf('rgba(') != -1) {
		return color;
	}
	else {
		const hex = color;
		let c: any;
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

export const copy = (obj: any) => {
	return JSON.parse(JSON.stringify(obj));
};

export const getSquareImg = (dataUrl: string) => {
	return new Promise(resolve => {
		const canvas = document.createElement('canvas');
		canvas.height = 128;
		canvas.width = 128
		const ctx = canvas.getContext('2d');
		const image = new Image();
		image.onload = function() {
			const sideLength = Math.min(image.width, image.height);
			ctx.drawImage(image,
				(image.width - sideLength) / 2,
				(image.height - sideLength) / 2,
				sideLength,
				sideLength,
				0,
				0,
				128,
				128
			);
			resolve(canvas.toDataURL());
		};
		image.src = dataUrl;
	});
}

export const fileToDataURL =  (file: File) => {
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

export const rgbaChange = (color: string, deltaRGBA: Object) => {
	let rgba: any = color;
	if (typeof rgba == 'string') {
		rgba = colorToRGBA(rgba);
		rgba = rgbaStringToObject(rgba);
	}
	if (typeof deltaRGBA == 'string') {
		deltaRGBA = rgbaStringToObject(deltaRGBA);
	}
	Object.keys(rgba).map(elem => {
		rgba[elem] = rgba[elem] + deltaRGBA[elem];
	});
	return generateRGBAString(rgba);
};

