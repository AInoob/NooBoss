const overview = (state = {}, action) => {
	switch (action.type) {
		case 'OVERVIEW_UPDATE_BELLO':
			state.bello = action.bello;
			break;
	}
	return JSON.parse(JSON.stringify(state));
}

export default overview;
