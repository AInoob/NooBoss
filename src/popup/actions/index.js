const UPDATE_STATE = 'UPDATE_STATE';
const UPDATE_LOCATION = 'UPDATE_LOCATION';
const NAVIGATOR_UPDATE_HOVER_POSITION = 'NAVIGATOR_UPDATE_HOVER_POSITION';
const OVERVIEW_UPDATE_BELLO = 'OVERVIEW_UPDATE_BELLO';
const OPTIONS_UPDATE_THEME_MAIN_COLOR = 'OPTIONS_UPDATE_THEME_MAIN_COLOR';
const OPTIONS_UPDATE_THEME_SUB_COLOR = 'OPTIONS_UPDATE_THEME_SUB_COLOR';
const OPTIONS_TOGGLE_DISPLAY = 'OPTIONS_TOGGLE_DISPLAY';
		

export const updateState = (state) => ({
	type: UPDATE_STATE,
	state
});

export const updateLocation = (location) => ({
	type: UPDATE_LOCATION,
	location
});

export const navigatorUpdateHoverPosition = (position) => ({
	type: NAVIGATOR_UPDATE_HOVER_POSITION,
	position
});

export const overviewUpdateBello = (bello) => ({
	type: OVERVIEW_UPDATE_BELLO,
	bello
});

export const optionsUpdateThemeMainColor = (color) => ({
	type: OPTIONS_UPDATE_THEME_MAIN_COLOR,
	color
});

export const optionsUpdateThemeSubColor = (color) => ({
	type: OPTIONS_UPDATE_THEME_SUB_COLOR,
	color
});

export const optionsToggleDisplay = (name) => ({
	type: OPTIONS_TOGGLE_DISPLAY,
	name
});
