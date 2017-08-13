const initialState = {
  rule: {
    actions: 'enableOnly',
    ids: [],
    match: {
      isWildcard: false,
      url: '',
    },
  },
};

const autoState = (state = initialState, action) => {
	switch (action.type) {
		case 'UPDATE_AUTO_STATE_RULE':
			state.rule = action.rule;
			break;
	}
	return JSON.parse(JSON.stringify(state));
};

export default autoState;
