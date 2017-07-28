const options = (state = {}, action) => {
	switch (action.type) {
		case 'OPTIONS_UPDATE_THEME_MAIN_COLOR':
			state.themeMainColor = action.color;
			break;
		case 'OPTIONS_UPDATE_THEME_SUB_COLOR':
			state.themeSubColor = action.color;
			break;
	}
	return JSON.parse(JSON.stringify(state));
};

export default options;
