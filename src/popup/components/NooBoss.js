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
import { promisedGet, notify, sendMessage, GL, alerty, ajax, getDB, copy, getParameterByName, get, generateRGBAString, getLanguage } from '../../utils';


injectGlobal`
	body{
		width: 760px;
		margin: 0px;
	}
	@keyframes spin {
    from {transform:rotate(0deg);}
    to {transform:rotate(360deg);}
	}
	@keyframes loader {
    0% {transform: rotate3d(-1,1,1,0deg)}
    10% {transform: rotate3d(-1,1,1,90deg)}
    20% {transform: rotate3d(-1,1,1,180deg)}
    30% {transform: rotate3d(-1,1,1,270deg)}
    40% {transform: rotate3d(-1,1,1,360deg)}
    50% {transform: rotate3d(-1,-1,1,90deg)}
    60% {transform: rotate3d(-1,-1,1,180deg)}
    70% {transform: rotate3d(-1,-1,1,270deg)}
    100% {transform: rotate3d(-1,-1,1,360deg)}
	}
`;

const NooBossDiv = styled.div`
	padding-top: 35px;
	overflow-y: scroll;
	&::-webkit-scrollbar-track{
		background: white;
	}
	&::-webkit-scrollbar{
		width: 5px;
	}
	&::-webkit-scrollbar-thumb{
		background: ${props => props.themeMainColor};
	}
	height: 560px;
	* {
		transition: opacity 0.309s, box-shadow 0.309s;
	}
	font-size: 12px;
	color: ${props => props.themeSubColor};
	.switch-input {
		display: none;
	}
	.switch-label {
		position: relative;
    display: inline-block;
    width: 39px;
    cursor: pointer;
	}
	.switch-label:before, .switch-label:after {
		content: "";
		position: absolute;
		margin: 0;
		outline: 0;
		top: 50%;
		-ms-transform: translate(0, -50%);
		-webkit-transform: translate(0, -50%);
		transform: translate(0, -50%);
		-webkit-transition: all 0.3s ease;
		transition: all 0.3s ease;
	}
	.switch-label:before {
		left: 1px;
		width: 30px;
		height: 12px;
		background-color: #9E9E9E;
		border-radius: 8px;
	}
	.switch-label:after {
		left: 0;
		width: 17px;
		height: 17px;
		background-color: #FAFAFA;
		border-radius: 50%;
		box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.14), 0 2px 2px 0 rgba(0, 0, 0, 0.098), 0 1px 5px 0 rgba(0, 0, 0, 0.084);
	}
	.switch-label .toggle--on {
		display: none;
	}
	.switch-label .toggle--off {
		display: inline-block;
	}
	.switch-input:checked + .switch-label:before {
		background-color: ${props => props.themeSubColor};
		opacity: 0.4;
	}
	.switch-input:checked + .switch-label:after {
		background-color: ${props => props.themeSubColor};
		transform: translate(80%, -50%);
	}
	.switch-input:checked + .switch-label .toggle--on {
		display: inline-block;
	}
	.switch-input:checked + .switch-label .toggle--off {
		display: none;
	}

	input, select{
		color: ${props => props.themeSubColor};
		outline: none;
    font-size: 16px;
    line-height: 16px;
		height: 20px;
		min-width: 90px;
		border: none;
		padding: 0px;
		border-bottom: ${() => shared.themeMainColor} solid 1px;
		&:hover, &:focus{
			border-bottom: ${() => shared.themeMainColor} solid 2px;
		}
		background-color: white;
	}
	input{
		&:hover, &:focus{
			margin-top: -1px;
		}
	}
	.hidden{
		display: none;
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
	button.inActive{
		filter: grayscale(100%);
		opacity: 0.7;
		cursor: default;
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
			return new Promise(resolve => {
				const language = getLanguage();
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
		if (getParameterByName('resetZoom')) {
			browser.tabs.setZoom(1, () => {
				sendMessage({ job: 'notify', title: GL('reset_zoom'), message: GL('x_4'), duration: 5 });
				window.close();
			});
		}
		window.shared = {
			getAllExtensions: this.getAllExtensions.bind(this),
			getGroupList: this.getGroupList.bind(this),
			getAutoStateRuleList: this.getAutoStateRuleList.bind(this),
			themeMainColor: generateRGBAString(this.props.options.themeMainColor),
			themeSubColor: generateRGBAString(this.props.options.themeSubColor),
		};
		get('joinCommunity', joinCommunity => shared.joinCommunity = joinCommunity);
		props.initialize(props);
		this.state = {
			icons: {},
			loadByParam: true,
			extensions: {},
			gorupList: [],
			themeMainColor: 'rgba(0,0,0,1)',
			themeSubColor: 'rgba(0,0,0,1)',
			autoStateRuleList: [],
			extensionInfoWeb: {},
			historyRecordList: [],
			viewMode: 'tile',
		};
		this.updateSubWindow = this.props.updateSubWindow.bind(this);
		this.getHistoryRecordList = this.getHistoryRecordList.bind(this);
		this.listener = this.listener.bind(this);
		setTimeout(() => {
			this.setState({ loadByParam: false });
		}, 333);
	}
	getAutoStateRuleList() {
		browser.runtime.sendMessage({ job: 'getAutoStateRuleList' }, autoStateRuleList => {
			this.setState({ autoStateRuleList });
		});
	}
	getGroupList() {
		browser.runtime.sendMessage({ job: 'getGroupList' }, async groupList => {
			this.setState({ groupList });
			for(let i = 0; i < groupList.length; i++) {
				await this.getIcon(groupList[i].id + '_icon');
			}
		});
	}

	getAllExtensions() {
		browser.runtime.sendMessage({ job: 'getAllExtensions' }, async extensions => {
			if (extensions.undefined) {
				delete extensions.undefined;
			}
			this.setState({ extensions });
			const keyList = Object.keys(extensions);
			for(let i = 0; i < keyList.length; i++) {
				const extension = extensions[keyList[i]];
				if (extension.icons && extension.icons.length > 0) {
					await this.getIcon(extension.icon, false, extension.icons);
				}
				else {
					await this.getIcon(extension.icon);
				}
			}
		});
	}
	async getHistoryRecordList() {
		getDB('history_records', async (historyRecordList = []) => {
			this.setState({ historyRecordList });
			for(let i = 0; i < historyRecordList.length; i++) {
				const record = historyRecordList[i];
				if (!this.state.icons[record.icon]) {
					await this.getIcon(record.icon);
				}
			}
		});
	}

	async getExtensionInfoWeb(extensionList) {
		if (extensionList.length == 0) {
			return;
		}
		let data = await ajax({
			type: 'POST',
			data: JSON.stringify({ extensionList }),
			contentType: "application/json",
			url: 'https://ainoob.com/api/nooboss/extensionInfo'
		});
		data = JSON.parse(data).extensionInfoList;
		this.setState(prevState => {
			for (let i = 0; i < data.length; i++) {
				const extensionInfo = data[i];
				prevState.extensionInfoWeb[extensionInfo.id] = extensionInfo;
			}
			return prevState;
		});
	}
	getIconHelper(iconDBKey, icon, callback) {
		this.setState(prevState => {
			prevState.icons[iconDBKey] = icon;
			prevState.icons = copy(prevState.icons);
			return prevState;
		}, callback);
	}
	getIcon(iconDBKey, update, iconList) {
		return new Promise(resolve => {
			if (this.state.icons[iconDBKey] && !update) {
				resolve();
			}
			else {
				if (iconList) {
					const icon = iconList.sort((a, b) => b.size - a.size)[0].url;
					this.getIconHelper(iconDBKey, icon, resolve);
				}
				else {
					getDB(iconDBKey, icon => {
						this.getIconHelper(iconDBKey, icon, resolve);
					});
				}
			}
		});
	}

	async componentWillMount() {
		browser.runtime.onMessage.addListener(this.listener);
		this.setState({ viewMode: await promisedGet('viewMode') });
		this.props.updateLanguage();
	}

	componentWillUnmount() {
		browser.runtime.onMessage.removeListener(this.listener);
	}

	async listener(message, sender, sendResponse) {
		if (message) {
			const location = this.props.location.main;
			switch (message.job) {
				case 'updateViewMode':
					this.setState({ viewMode: message.value });
					break;
				case 'popupHistoryUpdate':
					if (location == 'history') {
						this.getHistoryRecordList();
					}
					break;
				case 'popupNooBossUpdateTheme':
					get('mainColor', (color) => {
						this.props.optionsUpdateThemeMainColor(color);
						get('subColor', (color) => {
							this.props.optionsUpdateThemeSubColor(color);
						});
					});
					break;
				case 'extensionToggled':
					this.setState(prevState => {
						if (prevState.extensions[message.id]) {
							prevState.extensions[message.id].enabled = message.enabled;
							prevState.extensions = copy(prevState.extensions);
						}
						return prevState;
					});
					break;
				case 'extensionRemoved':
					this.setState(prevState => {
						delete prevState.extensions[message.id];
						prevState.extensions = copy(prevState.extensions);
						return prevState;
					});
					break;
				case 'groupCopied':
					this.setState(prevState => {
						prevState.groupList.push(message.newGroup);
						prevState.groupList = copy(prevState.groupList);
						return prevState;
					});
					break;
				case 'groupRemoved':
					this.setState(prevState => {
						prevState.groupList.splice(message.index, 1);
						prevState.groupList = copy(prevState.groupList);
						return prevState;
					});
					break;
				case 'groupListUpdated':
					const groupList = message.groupList;
					this.setState({ groupList });
					for(let i = 0; i < groupList.length; i++) {
						await this.getIcon(groupList[i].ic + '_icon');
					}
					break;
				case 'groupUpdated':
					this.setState(prevState => {
						const group = message.group;
						for(let i = 0; i < prevState.groupList.length; i++) {
							if (prevState.groupList[i].id == group.id) {
								prevState.groupList[i] = group;
								this.getIcon(group.id + '_icon', true);
								break;
							}
						}
						prevState.groupList = copy(prevState.groupList);
						return prevState;
					});
					break;
				case 'autoStateRulesUpdated':
					this.setState(prevState => {
						const rules = message.rules;
						prevState.autoStateRuleList = rules;
						return prevState;
					});
					break;
				case 'updateExtension':
					this.setState(prevState => {
						const extension = message.extension;
						prevState.extensions[extension.id] = extension;
						prevState.extensions = copy(prevState.extensions);
						this.getIcon(extension.icon);
						return prevState;
					});
					break;
			}
		}
	}

	render() {
		const language = this.props.language;
		shared.themeMainColor = generateRGBAString(this.props.options.themeMainColor);
		shared.themeSubColor = generateRGBAString(this.props.options.themeSubColor);
		const extensions = this.state.extensions || {};
		const groupList = this.state.groupList || [];
		const autoStateRuleList = this.state.autoStateRuleList || [];
		let page = null;
		let location = getParameterByName('page') || this.props.location.main;
		if (!this.state.loadByParam) {
			location = this.props.location.main;
		}
		if (location == 'overview') {
			page = (
				<Overview
					updateScrollChild={ref => this.onScrollChild = ref}
					extensionInfoWeb={this.state.extensionInfoWeb}
					icons={this.state.icons}
					extensions={extensions}
					groupList={groupList}
					autoStateRuleList={autoStateRuleList}
					getExtensionInfoWeb={this.getExtensionInfoWeb.bind(this)}
					viewMode={this.state.viewMode}
				/>
			);
		}
		else if (location == 'extensions') {
			page = (
				<Extensions
					icons={this.state.icons}
					extensions={extensions}
					groupList={groupList}
					autoStateRuleList={autoStateRuleList}
					updateSubWindow={this.props.updateSubWindow}
					viewMode={this.state.viewMode}
				/>
			);
		}
		else if (location == 'userscripts') { page = <Userscripts />; }
		else if (location == 'history') {
			page = (
				<History getIcon={this.getIcon.bind(this)}
					language={language}
					updateScrollChild={ref => this.onScrollChild = ref}
					icons={this.state.icons}
					recordList={this.state.historyRecordList}
					extensions={extensions}
					updateSubWindow={this.props.updateSubWindow}
					getRecordList={this.getHistoryRecordList}
				/>
			);
		}
		else if (location == 'options') { page = <Options />; }
		else if (location == 'about') { page = <About />; }
		return (
			<NooBossDiv
				id="noobossDiv"
				themeMainColor={shared.themeMainColor}
				themeSubColor={shared.themeSubColor}
				onScroll={() => {if(this.onScrollChild){this.onScrollChild.onScroll()}}}
			>
				<Navigator />
				{page}
				<SubWindow
					language={language}
					viewMode={this.state.viewMode}
					icons={this.state.icons}
					extensions={extensions}
					groupList={groupList}
					updateSubWindow={this.props.updateSubWindow}
				/>
			</NooBossDiv>
		);
	}
}

export default connect(
	mapStateToProps, 
	mapDispatchToProps
)(NooBoss);
