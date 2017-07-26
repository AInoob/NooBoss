import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled, { injectGlobal } from 'styled-components';
import Overview from './Overview';
import Navigator from './Navigator';
import { updateState, updateLocation } from '../actions';
import { getDB, getParameterByName } from '../utils'


injectGlobal`
	body{
		width: 800px;
		margin: 4px;
	}
`;

const NooBossDiv = styled.div`
`;

const mapStateToProps = (state, ownProps) => {
	return ({
		...state,
	});
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return ({
		...ownProps,
		loadPrevState: () => {
			return new Promise(resolve => {
				getDB('prevState', (prevState) => {
					dispatch(updateState(prevState));
					resolve();
				});
			})
		},
		updateLocationIfOptions: () => {
			return new Promise(resolve => {
				const location = getParameterByName('page');
				if (location) {
					dispatch(updateLocation(location));
				}
				resolve();
			});
		},
		initialize: async (props) => {
			await props.loadPrevState();
			await props.updateLocationIfOptions();
		},
	});
}

class NooBoss extends Component{
	constructor(props) {
		super(props);
		props.initialize(props);
	}
	render() {
		return (
			<NooBossDiv>
				<Navigator />
					Bello
				<Overview />
			</NooBossDiv>
		);
	}
}

export default connect(
	mapStateToProps, 
	mapDispatchToProps
)(NooBoss);
