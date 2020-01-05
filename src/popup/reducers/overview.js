const initialState = {
  recommendExtensions: false
};

const overview = (state = initialState, action) => {
  switch (action.type) {
    case 'OVERVIEW_UPDATE_BELLO':
      state.bello = action.bello;
      break;
    case 'OVERVIEW_TOGGLE_RECOMMEND_EXTENSIONS':
      state.recommendExtensions = !state.recommendExtensions;
      break;
  }
  return JSON.parse(JSON.stringify(state));
};

export default overview;
