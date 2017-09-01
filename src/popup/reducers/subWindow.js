const initialState = {
  display: '',
  id: '',
};

const subWindow = (state = initialState, action) => {
	switch (action.type) {
		case 'UPDATE_SUB_WINDOW':
      state.display = action.display;
      state.id = action.id;
			break;
	}
	return JSON.parse(JSON.stringify(state));
};

export default subWindow;