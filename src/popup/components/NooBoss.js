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
import SubWindow from './SubWindow';
import {
	updateState,
	navigatorUpdateHoverPosition,
	updateMainLocation,
	updateSubWindow,
	updateLanguage,
	optionsUpdateThemeMainColor,
	optionsUpdateThemeSubColor
} from '../actions';
import { getDB, getParameterByName, get, generateRGBAString, getLanguage } from '../../utils';


injectGlobal`
	body{
		width: 760px;
		margin: 0px;
	}
	@keyframes spin {
    from {transform:rotate(0deg);}
    to {transform:rotate(360deg);}
	}
`;

const NooBossDiv = styled.div`
	min-height: 300px;
	* {
		transition: box-shadow 0.309s;
	}
	font-size: 12px;
	color: ${props => props.themeSubColor};
	input, select{
		color: ${props => props.themeSubColor};
		outline: none;
    font-size: 16px;
    line-height: 16px;
	}
	input{
		height: 20px;
		width: 100px;
		border: none;
		padding: 0px;
		border-bottom: ${() => shared.themeMainColor} solid 1px;
		&:hover, &:focus{
			border-bottom: ${() => shared.themeMainColor} solid 2px;
		}
		&::placeholder{
			opacity: 0.5;
		}
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
		min-width: 80px;
		&:hover{
			box-shadow: ${() => shared.themeMainColor} 0px 0px 8px;
		}
		margin-top: 10px;
		label{
			cursor: pointer;
		}
		border: none;
		color: white;
		padding: 4px 11px;
    font-size: 16px;
    line-height: 16px;
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
		updateSubWindow: (display, id) => {
			dispatch(updateSubWindow(display, id));
		},
		optionsUpdateThemeMainColor: (color) => {
			dispatch(optionsUpdateThemeMainColor(color));
		},
		optionsUpdateThemeSubColor: (color) => {
			dispatch(optionsUpdateThemeSubColor(color));
		},
		updateMainLocationIfOptions: (props) => {
			return new Promise(resolve => {
				const mainLocation = getParameterByName('page');
				if (mainLocation) {
					dispatch(updateSubWindow('', ''));
					dispatch(updateMainLocation(mainLocation));
				}
				resolve();
			});
		},
		initialRequiredOptions: async (key) => {
			return new Promise(resolve => {
				get('mainColor', (color) => {
					dispatch(optionsUpdateThemeMainColor(color));
					get('subColor', (color) => {
						dispatch(optionsUpdateThemeSubColor(color));
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
		window.shared = {};
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
		shared = {
			...shared,
			updateSubWindow: this.props.updateSubWindow,
			icons: this.state.icons,
		};
	}

	componentWillUnmount() {
		browser.runtime.onMessage.removeListener(this.listener);
	}

	listener(message, sender, sendResponse) {
		if (message) {
			switch (message.job) {
				case 'popupNooBossUpdateTheme':
					get('mainColor', (color) => {
						this.props.optionsUpdateThemeMainColor(color);
						get('subColor', (color) => {
							this.props.optionsUpdateThemeSubColor(color);
						});
					});
					break;
			}
		}
	}

	render() {
		shared.themeMainColor = generateRGBAString(this.props.options.themeMainColor);
		shared.themeSubColor = generateRGBAString(this.props.options.themeSubColor);
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
				themeMainColor={shared.themeMainColor}
				themeSubColor={shared.themeSubColor}
			>
				<Navigator />
				{page}
				<SubWindow />
			</NooBossDiv>
		);
	}
}

export default connect(
	mapStateToProps, 
	mapDispatchToProps
)(NooBoss);
