import { combineReducers } from 'redux';
import location from './location';
import navigator from './navigator';
import overview from './overview';

const noobossReducer = (state = {}, action) => {
	if (action && action.type == 'UPDATE_STATE') {
		if (action.state) {
			state = action.state;
		}
	}

	state = {
		location: location(state.location, action),
		navigator: navigator(state.navigator, action),
		overview: overview(state.overview, action),
	};

	return state
}

export default noobossReducer;
