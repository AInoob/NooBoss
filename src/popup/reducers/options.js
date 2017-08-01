const initialState = {
	themeMainColor: { r: 195, g: 147, b: 220, a: 1 },
	themeSubColor: { r: 0, g: 0, b: 0, a: 1 },
};

const options = (state = initialState, action) => {
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
