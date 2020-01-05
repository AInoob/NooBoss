const initialState = {
  main: 'about',
  sub: {
    extensions: 'manage'
  }
};

const location = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_MAIN_LOCATION':
      state.main = action.mainLocation;
      break;
    case 'UPDATE_SUB_LOCATION':
      state.sub[action.mainLocation] = action.subLocation;
      break;
  }
  return JSON.parse(JSON.stringify(state));
};

export default location;
