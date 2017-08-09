const initialState = {
	hoverPosition: 0,
};

const navigator = (state = initialState, action) => {
	switch (action.type) {
		case 'UPDATE_MAIN_LOCATION':
			state.hoverPosition = ['overview', 'extensions', 'userscripts', 'history', 'options', 'about'].indexOf(action.mainLocation);
			console.log(action.mainLocation);
			console.log(['overview', 'extensions', 'userscripts', 'history', 'options', 'about'].indexOf(action.mainLocation));
			break;
		case 'NAVIGATOR_UPDATE_HOVER_POSITION':
			state.hoverPosition = action.position;
			break;
	}
	return JSON.parse(JSON.stringify(state));
}

export default navigator;
