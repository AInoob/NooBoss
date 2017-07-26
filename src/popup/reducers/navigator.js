const initialState = {
	linkList: [
		'overview',
		'extensions',
		'userscripts',
		'autoState',
		'options',
		'about'
	]
};

const navigator = (state = initialState, action) => {
	switch (action.type) {
	}
	return JSON.parse(JSON.stringify(state));
}

export default navigator;
