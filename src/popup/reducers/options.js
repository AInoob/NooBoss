const initialState = {
	themeMainColor: { r: 0, g: 0, b: 0, a: 1 },
	themeSubColor: { r: 0, g: 0, b: 0, a: 1 },
	display: {
		experience: true,
		experienceTheme: true,
		extensions: true,
		extensionsExtensions: true,
		extensionsNotifications: true,
		extensionsHistory: true,
		extensionsAutoState: true,
		autoStateBasics: true,
		userscripts: true,
		advanced: true,
		advancedBasics: true,
		advancedClean: true,
		advancedBackup: true,
	},
    zoom: 1
};

const options = (state = initialState, action) => {
	switch (action.type) {
		case 'OPTIONS_UPDATE_THEME_MAIN_COLOR':
			state.themeMainColor = action.color || { r: 0, g: 0, b: 0, a: 1 };
			break;
		case 'OPTIONS_UPDATE_THEME_SUB_COLOR':
			state.themeSubColor = action.color || { r: 0, g: 0, b: 0, a: 1 };
			break;
		case 'OPTIONS_TOGGLE_DISPLAY':
			state.display[action.name] = !state.display[action.name];
			break;
		case 'OPTIONS_UPDATE_ZOOM':
			state.zoom = action.zoom;
			break;
	}
	return JSON.parse(JSON.stringify(state));
};

export default options;
