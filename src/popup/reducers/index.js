import { combineReducers } from 'redux';
import location from './location';
import navigator from './navigator';
import overview from './overview';
import options from './options';

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
		options: options(state.options, action),
	};

	return state
}

export default noobossReducer;
