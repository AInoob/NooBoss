import React from 'react';
import { rgbaChange } from '../utils';

export const Removy = (props) => {
	let color = props.color || 'rgba(255, 255, 255, 1)';
	if (props.changeRGBA) {
		color = rgbaChange(color, props.changeRGBA);
	}
	return (
		<svg onClick={props.onClick} fill={color} height="48" viewBox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg">
			<path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
			<path d="M0 0h24v24H0z" fill="none"/>
		</svg>
	);
};

export const Optioney = (props) => {
	let color = props.color || 'rgba(255, 255, 255, 1)';
	if (props.changeRGBA) {
		color = rgbaChange(color, props.changeRGBA);
	}
	return(
		<svg onClick={props.onClick} fill={color} height="48" viewBox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg">
		    <path d="M0 0h24v24H0z" fill="none"/>
		    <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
		</svg>
	);
};

export const Switchy = (props) => {
	let color = props.color || 'rgba(255, 255, 255, 1)';
	if (props.changeRGBA) {
		color = rgbaChange(color, props.changeRGBA);
	}
	return (
		<svg onClick={props.onClick} fill={color} height="48" viewBox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg">
			<path d="M0 0h24v24H0z" fill="none"/>
			<path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"  stroke={color} strokeWidth="1.1" />
		</svg>
	);
};

export const Chromey = (props) => {
	let color = props.color || 'rgba(255, 255, 255, 1)';
	if (props.changeRGBA) {
		color = rgbaChange(color, props.changeRGBA);
	}
	return (
		<svg onClick={props.onClick} height="512px" viewBox="0 -40 600 600" width="512px" xmlns="http://www.w3.org/2000/svg" >
			<g>
				<path d="M182.411,256.486c0,37.638,30.512,68.152,68.147,68.152c37.633,0,68.149-30.515,68.149-68.152   c0-37.632-30.516-68.148-68.149-68.148C212.922,188.338,182.41,218.854,182.411,256.486z" fill={color} />
				<path d="M250.558,149.725c34.618,0,61.106,11.749,80.61,37.287l3.867-0.353l166.004-3.251   C469.779,77.625,371.988,0.271,256,0.271c-37.511,0-73.062,8.285-105.193,22.813l42.613,143.482   C209.966,156.022,229.5,149.725,250.558,149.725z" fill={color} />
				<path d="M508.098,215.152l-158.07,3c4.572,11.927,7.373,24.787,7.373,38.335c0,59.004-47.84,106.78-106.842,106.78   c-1.804,0-1.334-0.243-3.104-0.307l-0.661,0.99l-99.469,123.282c33,15.565,69.765,24.496,108.677,24.496   c141.244,0,255.705-114.544,255.705-255.755C511.705,242.01,510.244,228.462,508.098,215.152z" fill={color} />
				<path d="M143.778,256.487c0-26.002,7.711-48.915,23.107-67.451L122.128,38.433   C49.128,83.472,0.294,163.91,0.294,255.975c0,90.729,47.372,170.28,118.663,215.674l93.403-115.738   C172.269,340.499,143.778,301.991,143.778,256.487z" fill={color} />
			</g>
		</svg>
	);
};

export const Cleary = (props) => {
	let color = props.color || 'rgba(255, 255, 255, 1)';
	if (props.changeRGBA) {
		color = rgbaChange(color, props.changeRGBA);
	}
	return (
		<svg onClick={props.onClick} fill={color} height="48" viewBox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg">
			<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
			<path d="M0 0h24v24H0z" fill="none"/>
		</svg>
	);
};

export const Copyy = (props) => {
	let color = props.color || 'rgba(255, 255, 255, 1)';
	if (props.changeRGBA) {
		color = rgbaChange(color, props.changeRGBA);
	}
	return (
		<svg onClick={props.onClick} fill={color} height="48" viewBox="-3 -1 27 27" width="48" xmlns="http://www.w3.org/2000/svg">
			<path d="M0 0h24v24H0z" fill="none"/>
			<path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
		</svg>
	);
};
