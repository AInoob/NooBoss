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
import { updateState, navigatorUpdateHoverPosition, updateMainLocation, updateLanguage, optionsUpdateThemeMainColor, optionsUpdateThemeSubColor} from '../actions';
import { getDB, getParameterByName, get, generateRGBAString, getLanguage } from '../../utils';


injectGlobal`
	body{
		width: 760px;
		margin: 0px;
	}
`;

const NooBossDiv = styled.div`
	* {
		transition: box-shadow 0.309s;
	}
	font-size: 12px;
	color: ${props => props.themeSubColor};
	input, select{
		color: ${props => props.themeSubColor};
		outline: none;
	}
	section{
		clear: both;
		margin-top: 8px;
		padding-left: 32px;
	}
	.line{
		clear: both;
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
		updateMainLocationIfOptions: (props) => {
			return new Promise(resolve => {
				const location = getParameterByName('page');
				if (location) {
					dispatch(updateMainLocation(location));
					let activePosition = 0;
					props.navigator.linkList.map((name, index) => {
						if (location == name) {
							activePosition = index;
						}
					});
					dispatch(navigatorUpdateHoverPosition(activePosition));
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
			await props.updateMainLocationIfOptions(props);
			await props.initialRequiredOptions();
		},
	});
}

class NooBoss extends Component{
	constructor(props) {
		super(props);
		props.initialize(props);
		this.state = {
			icons: {},
			loadByParam: true,
		};
		this.listener = this.listener.bind(this);
		setTimeout(() => {
			this.setState({ loadByParam: false });
		}, 333);
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

	componentDidMount() {
		browser.runtime.onMessage.addListener(this.listener);
	}

	componentWillUnmount() {
		browser.runtime.onMessage.removeListener(this.listener);
	}

	listener(message, sender, sendResponse) {
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
	}

	render() {
		window.shared = {
			themeMainColor: generateRGBAString(this.props.options.themeMainColor || {"r":195,"g":147,"b":220,"a":1}),
			themeSubColor: generateRGBAString(this.props.options.themeSubColor || {"r":0,"g":0,"b":0,"a":1}),
			icons: this.state.icons,
		};
		let page = null;
		let location = getParameterByName('page') || this.props.location.main;
		if (!this.state.loadByParam) {
			location = this.props.location.main;
		}
		if (location == 'overview') { page = <Overview />; }
		else if (location == 'extensions') { page = <Extensions getIcon={this.getIcon.bind(this)} />; }
		else if (location == 'userscripts') { page = <Userscripts />; }
		else if (location == 'history') { page = <History getIcon={this.getIcon.bind(this)} />; }
		else if (location == 'options') { page = <Options />; }
		else if (location == 'about') { page = <About />; }
		return (
			<NooBossDiv
				themeMainColor={window.shared.themeMainColor}
				themeSubColor={window.shared.themeSubColor}
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
