const initialState = {
  rule: {
    action: 'enableOnly',
    ids: [],
    match: {
      isWildcard: false,
      url: ''
    },
    disabled: false
  }
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
