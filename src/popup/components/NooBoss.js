import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled, { injectGlobal } from 'styled-components';
import Overview from './Overview';
import Options from './Options';
import Navigator from './Navigator';
import { updateState, updateLocation, optionsUpdateThemeMainColor, optionsUpdateThemeSubColor} from '../actions';
import { getDB, getParameterByName, get, generateRGBAString } from '../utils';


injectGlobal`
	body{
		width: 800px;
		margin: 0px;
	}
`;

const NooBossDiv = styled.div`
	background-color: ${props => props.themeSubColor};
	section{
		margin-top: 8px;
		margin-left: 32px;
	}
	.line{
		height: 32px;
		line-height: 32px;
		float: left;
		width: 100%;
	}
	.left{
		float: left;
	}
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
		initialRequiredOptions: async (key) => {
			return new Promise(resolve => {
				get('mainColor', (color) => {
					dispatch(optionsUpdateThemeMainColor(color || { r: 195, g: 147, b: 220, a: 1 }));
					get('subColor', (color) => {
						dispatch(optionsUpdateThemeSubColor(color || { r: 255, g: 255, b: 255, a: 1 }));
						resolve();
					});
				});
			});
		},
		initialize: async (props) => {
			await props.loadPrevState();
			await props.updateLocationIfOptions();
			await props.initialRequiredOptions();
		},
	});
}

class NooBoss extends Component{
	constructor(props) {
		super(props);
		props.initialize(props);
	}
	render() {
		let page = null;
		if (this.props.location == 'overview') { page = <Overview />; }
		if (this.props.location == 'options') { page = <Options />; }
		return (
			<NooBossDiv
				themeMainColor={generateRGBAString(this.props.options.themeMainColor || {"r":195,"g":147,"b":220,"a":1})}
				themeSubColor={generateRGBAString(this.props.options.themeSubColor || {"r":255,"g":255,"b":255,"a":1})}
			>
				<Navigator />
				{page}
			</NooBossDiv>
		);
	}
}

export default connect(
	mapStateToProps, 
	mapDispatchToProps
)(NooBoss);
