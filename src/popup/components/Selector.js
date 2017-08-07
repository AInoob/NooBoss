import React, { Component } from 'react';
import styled from 'styled-components';
import ExtensionBrief  from './ExtensionBrief';
import { GL, sendMessage } from '../../utils';

const SelectorDiv = styled.div`
	overflow: hidden;
	#actionBar{
		width: 460px;
		margin: auto;
		margin-top: 10px;
		margin-bottom: 10px;
		#nameFilter, #typeFilter{
			width: 100px;
			border: none;
			box-shadow: grey 0px 0px 1px;
			&:hover{
				box-shadow: grey 0px 0px 8px;
			}
			background-color: white;
		}
		*{
			margin-right: 16px;
		}
	}
`;

class Selector extends Component{
	constructor(props) {
		super(props);
		this.state = {
			filterName: '',
			filterType: 'all',
			stateHistoryList: [],
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
			Object.keys(stateHistory).map(id => {
				sendMessage({ job: 'extensionToggle', id, enabled: stateHistory[id] });
			});
			return prevState;
		});
	}

	addStateHistory(stateHistory) {
		this.setState(prevState => {
			prevState.stateHistoryList.push(stateHistory);
			return prevState;
		});
	}

	getFiltered() {
		const extensions = this.props.extensions;
		return Object.keys(extensions).filter(elem => {
			const extension = extensions[elem];
			let pass = true;
			if (extension.name.toLowerCase().indexOf(this.state.filterName) == -1) {
				pass = false;
			}
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
			return pass;
		});
	}

	render() {
		const extensions = this.props.extensions;
		const extensionList = this.getFiltered().map((elem, index) => {
			return <ExtensionBrief addStateHistory={this.addStateHistory.bind(this)} extension={extensions[elem]} withControl={this.props.withControl} key={index} />
		});
		let selectGroup;
		if (this.props.groupList) {
			selectGroup = <option value="group">{GL('group')}</option>;
		}
		return (
			<SelectorDiv>
				<div id="actionBar">
					<select defaultValue={this.state.filterType} onChange={(e) => { this.setState({ filterType: e.target.value }) }} id="typeFilter">
						<option value="all">{GL('all')}</option>
						{selectGroup}
						<option value="app">{GL('app')}</option>
						<option value="extension">{GL('extension')}</option>
						<option value="theme">{GL('theme')}</option>
					</select>
					<input id="nameFilter" placeholder={GL('name')} value={this.state.filterName} onChange={(e) => { this.setState({ filterName: e.target.value })} } />
					<button onClick={this.enable.bind(this)}>{GL('enable')}</button>
					<button onClick={this.disable.bind(this)}>{GL('disable')}</button>
					<button onClick={this.undo.bind(this)}>{GL('undo')}</button>
				</div>
				{extensionList}
			</SelectorDiv>
		);
	}
}

export default Selector;
