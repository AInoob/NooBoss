import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled, { injectGlobal } from 'styled-components';
import Navigator from './Navigator';
import Overview from './Overview';
import Extensions from './Extensions';
import Userscripts from './Userscripts';
import Options from './Options';
import History from './History';
import About from './About';
import { updateState, updateMainLocation, updateLanguage, optionsUpdateThemeMainColor, optionsUpdateThemeSubColor} from '../actions';
import { getDB, getParameterByName, get, generateRGBAString, getLanguage } from '../../utils';


injectGlobal`
	body{
		width: 760px;
		margin: 0px;
	}
`;

const NooBossDiv = styled.div`
	font-size: 12px;
	color: ${props => props.themeSubColor};
	section{
		margin-top: 8px;
		padding-left: 32px;
	}
	.line{
		height: 32px;
		line-height: 32px;
	}
	.left{
		float: left;
	}
	button{
		label{
			cursor: pointer;
		}
		border: none;
		color: white;
		padding: 2px 8px;
		cursor: pointer;
		outline: none;
		background-color: ${props => props.themeMainColor};
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
		updateLanguage: () => {
			return new Promise(async resolve => {
				const language = await getLanguage();
				dispatch(updateLanguage(language));
				resolve();
			});
		},
		updateMainLocationIfOptions: () => {
			return new Promise(resolve => {
				const location = getParameterByName('page');
				if (location) {
					dispatch(updateMainLocation(location));
				}
				resolve();
			});
		},
		initialRequiredOptions: async (key) => {
			return new Promise(resolve => {
				get('mainColor', (color) => {
					dispatch(optionsUpdateThemeMainColor(color || { r: 195, g: 147, b: 220, a: 1 }));
					get('subColor', (color) => {
						dispatch(optionsUpdateThemeSubColor(color || { r: 0, g: 0, b: 0, a: 1 }));
						resolve();
					});
				});
			});
		},
		initialize: async (props) => {
			await props.loadPrevState();
			await props.updateMainLocationIfOptions();
			await props.initialRequiredOptions();
			chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
				if (message) {
					switch (message.job) {
						case 'popupNooBossUpdateTheme':
							get('mainColor', (color) => {
								dispatch(optionsUpdateThemeMainColor(color || { r: 195, g: 147, b: 220, a: 1 }));
								get('subColor', (color) => {
									dispatch(optionsUpdateThemeSubColor(color || { r: 0, g: 0, b: 0, a: 1 }));
								});
							});
							break;
					}
				}
			});
		},
	});
}

class NooBoss extends Component{
	constructor(props) {
		super(props);
		props.initialize(props);
		this.state = {
			icons: {},
		};
	}
	getIcon(iconDBKey) {
		return new Promise(resolve => {
			getDB(iconDBKey, icon => {
				this.setState(prevState => {
					prevState.icons[iconDBKey] = icon;
					return prevState;
				}, resolve);
			});
		});
	}

	render() {
		const shared = {
			themeMainColor: generateRGBAString(this.props.options.themeMainColor || {"r":195,"g":147,"b":220,"a":1}),
			themeSubColor: generateRGBAString(this.props.options.themeSubColor || {"r":0,"g":0,"b":0,"a":1}),
			icons: this.state.icons,
		};
		let page = null;
		if (this.props.location.main == 'overview') { page = <Overview />; }
		else if (this.props.location.main == 'extensions') { page = <Extensions shared={shared} />; }
		else if (this.props.location.main == 'userscripts') { page = <Userscripts />; }
		else if (this.props.location.main == 'history') { page = <History getIcon={this.getIcon.bind(this)} shared={shared} />; }
		else if (this.props.location.main == 'options') { page = <Options />; }
		else if (this.props.location.main == 'about') { page = <About />; }
		return (
			<NooBossDiv
				themeMainColor={shared.themeMainColor}
				themeSubColor={shared.themeSubColor}
			>
				<Navigator shared={shared} />
				{page}
			</NooBossDiv>
		);
	}
}

export default connect(
	mapStateToProps, 
	mapDispatchToProps
)(NooBoss);
