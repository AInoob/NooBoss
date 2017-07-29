import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import NooBoss from './components/NooBoss'
import reducer from './reducers'
import { setDB } from '../utils'

const store = createStore(reducer)

store.subscribe(() => {
	console.log(JSON.stringify(store.getState()));
	setDB('prevState', store.getState());
})

render(
	<Provider store={store}>
		<NooBoss />
	</Provider>,
	document.getElementById('nooboss')
)
