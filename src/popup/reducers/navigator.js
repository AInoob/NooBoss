const initialState = {
	hoverPosition: 0,
	linkList: [
		'overview',
		'extensions',
		'userscripts',
		'history',
		'options',
		'about'
	]
};

const navigator = (state = initialState, action) => {
	switch (action.type) {
		case 'NAVIGATOR_UPDATE_HOVER_POSITION':
			state.hoverPosition = action.position;
			break;
	}
	return JSON.parse(JSON.stringify(state));
}

export default navigator;
