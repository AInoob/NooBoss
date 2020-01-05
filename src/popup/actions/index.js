const UPDATE_STATE = 'UPDATE_STATE';
const UPDATE_MAIN_LOCATION = 'UPDATE_MAIN_LOCATION';
const UPDATE_SUB_LOCATION = 'UPDATE_SUB_LOCATION';
const UPDATE_SUB_WINDOW = 'UPDATE_SUB_WINDOW';
const UPDATE_LANGUAGE = 'UPDATE_LANGUAGE';
const OVERVIEW_UPDATE_BELLO = 'OVERVIEW_UPDATE_BELLO';
const OVERVIEW_TOGGLE_RECOMMEND_EXTENSIONS = 'OVERVIEW_TOGGLE_RECOMMEND_EXTENSIONS';
const OPTIONS_UPDATE_THEME_MAIN_COLOR = 'OPTIONS_UPDATE_THEME_MAIN_COLOR';
const OPTIONS_UPDATE_THEME_SUB_COLOR = 'OPTIONS_UPDATE_THEME_SUB_COLOR';
const OPTIONS_UPDATE_ZOOM = 'OPTIONS_UPDATE_ZOOM';
const OPTIONS_TOGGLE_DISPLAY = 'OPTIONS_TOGGLE_DISPLAY';
const UPDATE_AUTO_STATE_RULE = 'UPDATE_AUTO_STATE_RULE';
		

export const updateState = (state) => ({
	type: UPDATE_STATE,
	state
});

export const updateMainLocation = (mainLocation) => ({
	type: UPDATE_MAIN_LOCATION,
	mainLocation
});

export const updateSubLocation = (mainLocation, subLocation) => ({
	type: UPDATE_SUB_LOCATION,
	mainLocation,
	subLocation,
});

export const updateSubWindow = (display, id) => ({
	type: UPDATE_SUB_WINDOW,
	display,
	id,
});

export const updateLanguage = (language) => ({
	type: UPDATE_LANGUAGE,
	language
});

export const overviewUpdateBello = (bello) => ({
	type: OVERVIEW_UPDATE_BELLO,
	bello
});

export const overviewToggleRecommendExtensions = () => ({
	type: OVERVIEW_TOGGLE_RECOMMEND_EXTENSIONS
});

export const optionsUpdateThemeMainColor = (color) => ({
	type: OPTIONS_UPDATE_THEME_MAIN_COLOR,
	color
});

export const optionsUpdateThemeSubColor = (color) => ({
	type: OPTIONS_UPDATE_THEME_SUB_COLOR,
	color
});

export const optionsUpdateZoom = (zoom) => ({
	type: OPTIONS_UPDATE_ZOOM,
	zoom
});

export const optionsToggleDisplay = (name) => ({
	type: OPTIONS_TOGGLE_DISPLAY,
	name
});

export const updateAutoStateRule = (rule) => ({
	type: UPDATE_AUTO_STATE_RULE,
	rule
});