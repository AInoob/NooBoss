const location = (state = "manage", action) => {
	switch (action.type) {
		case 'UPDATE_LOCATION':
			state = action.location;
			break;
	}
	return JSON.parse(JSON.stringify(state));
};

export default location;
