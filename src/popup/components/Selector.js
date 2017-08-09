import React, { Component } from 'react';
import styled from 'styled-components';
import ExtensionBrief  from './ExtensionBrief';
import GroupBrief  from './GroupBrief';
import { GL, sendMessage } from '../../utils';
import { Cleary } from '../../icons';

const SelectorDiv = styled.div`
	overflow: visible;
	padding-bottom: 10px;
	#actionBar{
		margin-left: 0px;
		margin-top: 20px;
		height: 26px;
		#nameFilter, #typeFilter{
			height: 20px;
			width: 100px;
			border: none;
			padding: 0px;
			border-bottom: ${() => shared.themeMainColor} solid 1px;
			&:hover, &:focus{
				border-bottom: ${() => shared.themeMainColor} solid 2px;
			}
			background-color: white;
		}
		#typeFilter{
			height: 21px;
		}
		*{
			margin-right: 16px;
			float: left;
			display: block;
			margin-top: 0px;
		}
		button{
			margin-top: -3px;
		}
		button.inActive{
			filter: grayscale(100%);
			opacity: 0.7;
			cursor: default;
		}
		#clearNameFilter{
			display: inline-block;
			margin-left: -36px;
			height: 20px;
			margin-right: 16px;
			width: 20px;
			text-align: center;
			cursor: pointer;
			background-color: rgba(255,255,255, 0.8);
			svg{
				width: 20px;
				height: 20px;
			}
		}
		#nameFilter{
			&[value=''] + #clearNameFilter{
				display: none;
			}
		}
	}
	#extensionList, #appList, #themeList, #groupList{
		clear: both;
		padding-top: 12px;
	}
`;

class Selector extends Component{
	constructor(props) {
		super(props);
		this.state = {
			filterName: '',
			filterType: 'all',
			stateHistoryList: [],
			redoStateHistoryList: [],
		};
	}

	enable() {
		const stateHistory = {};
		this.getFiltered().map(id => {
			const extension = this.props.extensions[id];
			if (!extension.enabled) {
				stateHistory[extension.id] = extension.enabled;
				sendMessage({ job: 'extensionToggle', id: extension.id, enabled: !extension.enabled }, () => {});
			}
		});
		this.addStateHistory(stateHistory);
	}
	
	disable() {
		const stateHistory = {};
		this.getFiltered().map(id => {
			const extension = this.props.extensions[id];
			if (extension.enabled) {
				stateHistory[extension.id] = extension.enabled;
				sendMessage({ job: 'extensionToggle', id: extension.id, enable: !extension.enabled }, () => {});
			}
		});
		this.addStateHistory(stateHistory);
	}

	undo() {
		this.setState(prevState => {
			const stateHistory = prevState.stateHistoryList.pop() || {};
			const redoStateHistory = {};
			Object.keys(stateHistory).map(id => {
				switch (id) {
					case 'groupList':
						redoStateHistory.groupList = JSON.parse(JSON.stringify(this.props.groupList));
						sendMessage({ job: 'groupListUpdate', groupList: stateHistory.groupList });
						break;
					default: 
						redoStateHistory[id] = this.props.extensions[id].enabled;
						sendMessage({ job: 'extensionToggle', id, enabled: stateHistory[id] });
				}
			});
			prevState.redoStateHistoryList.push(redoStateHistory);
			return prevState;
		});
	}

	redo() {
		this.setState(prevState => {
			const redoStateHistory = prevState.redoStateHistoryList.pop() || {};
			const stateHistory = {};
			Object.keys(redoStateHistory).map(id => {
				switch (id) {
					case 'groupList':
						stateHistory.groupList = JSON.parse(JSON.stringify(this.props.groupList));
						sendMessage({ job: 'groupListUpdate', groupList: redoStateHistory.groupList });
						break;
					default:
						stateHistory[id] = this.props.extensions[id].enabled;
						sendMessage({ job: 'extensionToggle', id, enabled: redoStateHistory[id] });
				}
			});
			prevState.stateHistoryList.push(stateHistory);
			return prevState;
		});
	}

	addStateHistory(stateHistory) {
		this.setState(prevState => {
			prevState.stateHistoryList.push(stateHistory);
			prevState.redoStateHistoryList = [];
			return prevState;
		});
	}

	getFiltered(type) {
		const extensions = this.props.extensions;
		return Object.keys(extensions).filter(elem => {
			const extension = extensions[elem];
			let pass = true;
			if (type && ((extension.name.match(/NooBoss-Group/) && type == 'group') || (extension.type != type))) {
				pass = false;
			}
			else if (extension.name.toLowerCase().indexOf(this.state.filterName.toLowerCase()) == -1) {
				pass = false;
			}
			else {
				switch (this.state.filterType) {
					case 'all':
						break;
					case 'group':
						if (!extension.name.match(/^NooBoss-Group/)) {
							pass = false;
						}
						break;
					default:
						if ((extension.type || '').indexOf(this.state.filterType) == -1) {
							pass = false;
						}
				}
			}
			return pass;
		});
	}

	groupToggle(id, enabled) {
		const stateHistory = {};
		const group = this.props.groupList.filter(elem => {
			return elem.id == id;
		})[0];
		group.appList.map(elem => {
			if (enabled != undefined && this.props.extensions[elem].enabled != enabled) {
				stateHistory[elem] = !enabled;
			}
		})
		this.addStateHistory(stateHistory);
		sendMessage({ job: 'groupToggle', id, enabled });
	}

	groupCopy(id) {
		const groupList = JSON.parse(JSON.stringify(this.props.groupList));
		this.addStateHistory({ groupList });
		sendMessage({ job: 'groupCopy', id });
	}

	groupRemove(id) {
		const groupList = JSON.parse(JSON.stringify(this.props.groupList));
		this.addStateHistory({ groupList });
		sendMessage({ job: 'groupRemove', id });
	}

	componentDidMount() {
		if (this.props.actionBar) {
			this.nameFilter.focus();
		}
	}

	render() {
		const extensions = this.props.extensions;
		const appList = [], extensionList = [], themeList = [];
		this.getFiltered().map((id, index) => {
			const x = (
				<ExtensionBrief
					selected={this.props.selectedList ? (this.props.selectedList.indexOf(id) != -1) : null}
					onClick={() => {
						console.log(id);
						if (this.props.select) {
							this.props.select(id);
						}
					}}
					addStateHistory={this.addStateHistory.bind(this)}
					extension={extensions[id]}
					withControl={this.props.withControl}
					key={index}
				/>
			);
			switch (extensions[id].type) {
				case 'extension':
					extensionList.push(x);
					break;
				case 'app':
					appList.push(x);
					break;
				case 'theme':
					themeList.push(x);
					break;
			}
		});
		const groupList = (this.props.groupList || []).map((group, index) => {
			return (
				<GroupBrief group={group} withControl={true} key={index}
					enable={this.groupToggle.bind(this, group.id, true)}
					disable={this.groupToggle.bind(this, group.id, false)}
					copy={this.groupCopy.bind(this, group.id)}
					remove={this.groupRemove.bind(this, group.id)}
				/>
			);
		});;
		const actionBar = !this.props.actionBar ? null : (
			<div id="actionBar">
				<select defaultValue={this.state.filterType} onChange={(e) => { this.setState({ filterType: e.target.value }) }} id="typeFilter">
					<option value="all">{GL('all')}</option>
					{selectGroup}
					<option value="app">{GL('app')}</option>
					<option value="extension">{GL('extension')}</option>
					<option value="theme">{GL('theme')}</option>
				</select>
				<input id="nameFilter" placeholder={GL('name')} ref={input => {this.nameFilter = input;}} value={this.state.filterName} onChange={(e) => { this.setState({ filterName: e.target.value })} } />
				<span id="clearNameFilter" onClick={()=>{this.setState({ filterName: '' }); this.nameFilter.focus(); }}><Cleary color={shared.themeSubColor} /></span>
				<button onClick={this.enable.bind(this)}>{GL('enable')}</button>
				<button onClick={this.disable.bind(this)}>{GL('disable')}</button>
				<button className={this.state.stateHistoryList.length > 0 ? '' : 'inActive'} onClick={this.undo.bind(this)}>{GL('undo')}</button>
				<button className={this.state.redoStateHistoryList.length > 0 ? '' : 'inActive'} onClick={this.redo.bind(this)}>{GL('redo')}</button>
			</div>
		);
		let appDiv, extensionDiv, themeDiv, groupDiv;
		if (appList.length > 0) {
			appDiv = <div id="appList"><h2>{GL('app')}</h2>{appList}</div>;
		}
		if (extensionList.length > 0) {
			extensionDiv = <div id="extensionList"><h2>{GL('extension')}</h2>{extensionList}</div>;
		}
		if (themeList.length > 0) {
			themeDiv = <div id="themeList"><h2>{GL('theme')}</h2>{themeList}</div>;
		}
		if (groupList.length > 0) {
			groupDiv = <div id="groupList"><h2>{GL('group')}</h2>{groupList}</div>;
		}
		let selectGroup;
		if (this.props.groupList) {
			selectGroup = <option value="group">{GL('group')}</option>;
		}
		return (
			<SelectorDiv>
				{actionBar}
				{groupDiv}
				{extensionDiv}
				{appDiv}
				{themeDiv}
			</SelectorDiv>
		);
	}
}

export default Selector;
