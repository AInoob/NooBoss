const language = (state = "en", action) => {
	switch (action.type) {
		case 'UPDATE_LANGUAGE':
			state = action.language;
			break;
	}
	return JSON.parse(JSON.stringify(state));
};

export default language;
