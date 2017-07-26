const UPDATE_STATE = 'UPDATE_STATE';
const UPDATE_LOCATION = 'UPDATE_LOCATION';
const OVERVIEW_UPDATE_BELLO = 'OVERVIEW_UPDATE_BELLO';

export const updateState = (state) => ({
	type: UPDATE_STATE,
	state
});

export const updateLocation = (location) => ({
	type: UPDATE_LOCATION,
	location
});

export const overviewUpdateBello = (bello) => ({
	type: OVERVIEW_UPDATE_BELLO,
	bello
});
