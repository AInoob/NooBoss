import { combineReducers } from 'redux';
import location from './location';
import language from './language';
import overview from './overview';
import options from './options';
import subWindow from './subWindow';
import autoState from './autoState';

const noobossReducer = (state = {}, action) => {
	if (action && action.type == 'UPDATE_STATE') {
		if (action.state) {
			state = action.state;
		}
	}

	state = {
		language: language(state.language, action),
		location: location(state.location, action),
		subWindow: subWindow(state.subWindow, action),
		overview: overview(state.overview, action),
		options: options(state.options, action),
		autoState: autoState(state.autoState, action),
	};

	return state
}

export default noobossReducer;
