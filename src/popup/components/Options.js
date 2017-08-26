import React, { Component } from 'react';
import { connect } from 'react-redux';
import { } from '../actions';
import { alerty, GL, get, generateRGBAString, sendMessage } from '../../utils';
import { SketchPicker } from 'react-color';
import { optionsUpdateThemeMainColor, optionsUpdateThemeSubColor, optionsToggleDisplay } from '../actions';
import styled from 'styled-components';

const OptionsDiv = styled.div`
	user-select: none;
	section{
		font-size: 18px;
		section{
			font-size: 14px;
			section{
				font-size: 12px;
			}
		}
	}
	#upload{
		display: none;
	}
	.colorPickerHolder{
		overflow: hidden;
		margin-left: 88px;
		float: left;
		margin-top: 6px;
		box-shadow: ${() => shared.themeMainColor} -1px -1px 3px 0px;
		&:focus{
			box-shadow: ${() => shared.themeMainColor} -1px -1px 8px 0px;
			outline: none;
		}
	}
	.displayMore{
		display: none;
		& + label[class='displayToggle']{
			font-weight: bold;
			cursor: pointer;
			&:after{
				content: '▼';
				opacity: 0.3;
				margin-left: 6px;
			}
		}
		& ~ section{
			display: none;
		}
		& ~ .line{
			display: none;
		}
		&:checked{
			& + label[class='displayToggle']{
				&:after{
					content: '';
				}
			}
			& ~ section{
				display: block;
			}
			& ~ .line{
				display: block;
			}
		}
	}
	[type="checkbox"]{
		display: none;
		&:checked + label[class='checkbox']{
			&:before{
				top: -8px;
				left: -5px;
				width: 7px;
				height: 19px;
				border-top: 2px solid transparent;
				border-left: 2px solid transparent;
				border-right: 2px solid ${props => props.themeMainColor};
				border-bottom: 2px solid ${props => props.themeMainColor};
				transform: rotate(40deg);
				backface-visibility: hidden;
				transform-origin: 100% 100%;
			}
			& + span + .appending{
				display: inline-block;
			}
		}
		& + label[class='checkbox']{
			cursor: pointer;
			position: relative;
			&:before{
				content: '';
				position: absolute;
				top: -2px;
				left: 0;
				width: 13px;
				height: 13px;
				z-index: 0;
				border: 2px solid ${props => props.themeMainColor};
				border-radius: 1px;
				margin-top: 2px;
				transition: .2s;
			}
			& + span{
				margin-left: 30px;
				cursor: pointer;
				& + .appending{
					display: none;
					margin-left: 13px;
					cursor: default;
					input{
						border: none;
						outline: none;
						border-bottom: 1px solid ${props => props.themeMainColor};
						width: 33px;
						text-align: center;
						& + span{
							cursor: default;
						}
					}
				}
			}
		}
	}
	#themeMainColorPicker, #themeSubColorPicker{
		position: absolute;
		cursor: pointer;
		left: 132px;
		top: 9px;
		width: 36px;
		height: 16px;
		box-shadow: ${() => shared.themeMainColor} -1px -1px 3px 0px;
		&:hover{
			box-shadow: ${() => shared.themeMainColor} -1px -1px 8px 0px;
		}
		transition: box-shadow 0.309s;
	}
	#themeMainColorPicker{
		background-color: ${props => props.themeMainColor}
	}
	#themeSubColorPicker{
		background-color: ${props => props.themeSubColor}
	}
	.line{
		padding-left: 32px;
		position: relative;
	}
`;


const mapStateToProps = (state, ownProps) => {
	return ({
		...ownProps,
		options: state.options
	});
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return ({
		...ownProps,
		updateThemeMainColor: (color) => {
			dispatch(optionsUpdateThemeMainColor(color || { r: 195, g: 147, b: 220, a: 1 }));
		},
		updateThemeSubColor: (color) => {
			dispatch(optionsUpdateThemeSubColor(color || { r: 195, g: 147, b: 220, a: 1 }));
		},
		toggleDisplay: (name) => {
			dispatch(optionsToggleDisplay(name));
		},
	})
}

class Options extends Component{
	constructor(props) {
		super(props);
		this.state = {
			colorPicker: null,
			notificationDuration_autoState: 6,
			notificationDuration_installation: 6,
			notificationDuration_removal: 6,
			notificationDuration_stateChange: 6,
			historyInstall: false,
			historyRemove: false,
			historyUpdate: false,
			historyEnable: false,
			historyDisable: false,
			recoExtensions: false,
			notifyStateChange: false,
			notifyInstallation: false,
			notifyRemoval: false,
			recoExtensions: true,
			autoState: false,
			autoStateNotification: false,
			joinCommunity: false,
		};
		this.listener = this.listener.bind(this);
	}

	componentDidMount() {
		this.initiate();
		browser.runtime.onMessage.addListener(this.listener);
	}

	componentWillUnmount() {
		browser.runtime.onMessage.removeListener(this.listener);
	}

	listener(message, sender, sendResponse) {
		if (message) {
			switch (message.job) {
				case 'popupOptionsInitiate':
					this.initiate();
					break;
			}
		}
	}
	

	initiate() {
		const options=[
			'recoExtensions',
			'notifyStateChange',
			'notifyInstallation',
			'notifyRemoval',
			'autoState',
			'autoStateNotification',
			'historyInstall',
			'historyRemove',
			'historyUpdate',
			'historyEnable',
			'historyDisable',
			'recoExtensions',
			'notificationDuration_installation',
			'notificationDuration_autoState',
			'notificationDuration_removal',
			'notificationDuration_stateChange',
			'joinCommunity',
		];
		for(let i = 0; i < options.length; i++) {
			get(options[i], function(key, value) {
				const temp = {};
				temp[key] = value;
				this.setState(temp);
			}.bind(this, options[i]));
		}
	}

	updateColor(name, color) {
		color = color.rgb;
		switch (name) {
			case 'themeMainColor':
				this.props.updateThemeMainColor(color);
				break;
			case 'themeSubColor':
				this.props.updateThemeSubColor(color);
				break;
		}
	}

	setColor(name, color) {
		color = color.rgb;
		switch (name) {
			case 'themeMainColor':
				sendMessage({ job: 'set', key: 'mainColor', value: color });
				break;
			case 'themeSubColor':
				sendMessage({ job: 'set', key: 'subColor', value: color });
				break;
		}
	}

	updateColorPicker(name) {
		if (this.state.colorPicker == name) {
			this.setState({ colorPicker: null });
		}
		else {
			this.setState({ colorPicker: name });
		}
	}

	getDisplayLabel(name, htmlId) {
		return (
			<label htmlFor={'display_'+(htmlId || name)} className="displayToggle">{GL(name)}</label>
		);
	}

	getDisplayInput(name, id, htmlId) {
		id = id || name;
		return (
			<input id={'display_'+(htmlId || name)} type="checkbox" className="displayMore"
				checked={this.props.options.display[id]}
				onChange={this.props.toggleDisplay.bind(this, id)}
			/>
		);
	}

	getSwitch(name, key, name2, key2) {
		const appending = name2 ? (
			<div className="appending">
				<span>{GL('for_X_seconds').split('X')[0]}</span>
				<input value={this.state[key2]} onChange={this.changeOption.bind(this, key2)} />
				<span>{GL('for_X_seconds').split('X')[1]}</span>
			</div>
		): null;
		return (
			<div className="line">
				<input type="checkbox" readOnly checked={this.state[key]} />
				<label className="checkbox" onClick={this.toggleState.bind(this, key)} />
				<span onClick={this.toggleState.bind(this, key)}>{GL(name)}</span>
				{appending}
			</div>
		);
	}

	changeOption(key, e) {
		const temp = {};
		temp[key] = e.target.value;
		this.setState(temp);
		sendMessage({ job: 'set', key, value: temp[key] });
	}

	toggleState(key) {
		const temp = {};
		temp[key] = !this.state[key];
		if (key == 'joinCommunity') {
			shared.joinCommunity = temp[key];
		}
		this.setState(temp);
		sendMessage({ job: 'set', key, value: temp[key] });
	}

	emptyHistory() {
		alerty(
			GL('are_you_sure'),
			generateRGBAString(this.props.options.themeMainColor),
			() => {
				sendMessage({ job: 'emptyHistory' });
			}
		);
	}

	resetEverything() {
		alerty(
			GL('are_you_sure'),
			generateRGBAString(this.props.options.themeMainColor),
			() => {
				sendMessage({ job: 'reset' });
			}
		);
	}

	importOptions(e) {
		const file=e.target.files[0];
		const r = new FileReader();
		r.onload = (e) => {
			sendMessage({ job: 'importOptions', optionsString: e.target.result });
		}
		r.readAsText(file);
	}

	exportOptions() {
		sendMessage({ job: 'exportOptions' });
	}

	render() {
		const themeMainColor = generateRGBAString(this.props.options.themeMainColor);
		const themeSubColor = generateRGBAString(this.props.options.themeSubColor);
		return (
			<OptionsDiv themeMainColor={themeMainColor} themeSubColor={themeSubColor}>
					<section>
						{this.getDisplayInput('experience')}
						{this.getDisplayLabel('experience')}
						<section>
							{this.getDisplayInput('theme', 'experienceTheme')}
							{this.getDisplayLabel('theme')}
							<div className="line">
								<span className="left">{GL('main_color')}</span>
								<div className="left" id="themeMainColorPicker" onClick={this.updateColorPicker.bind(this, 'themeMainColor')} />
								{this.state.colorPicker == 'themeMainColor' ?
									<div
										ref={div => div && div.focus()}
										className="colorPickerHolder"
									 	tabIndex="-1"
										onBlur={()=>{setTimeout(() => {this.setState({ colorPicker: null })}, 88)}}
									>
										<SketchPicker
											color={this.props.options.themeMainColor}
											onChange={this.updateColor.bind(this, 'themeMainColor')}
											onChangeComplete={this.setColor.bind(this, 'themeMainColor')}
										/>
									</div> : null}
							</div>
							<div className="line">
								<span className="left">{GL('sub_color')}</span>
								<div className="left" id="themeSubColorPicker" onClick={this.updateColorPicker.bind(this, 'themeSubColor')} />
								{this.state.colorPicker == 'themeSubColor' ?
									<div
										ref={div => div && div.focus()}
										className="colorPickerHolder"
									 	tabIndex="-1"
										onBlur={()=>{setTimeout(() => {this.setState({ colorPicker: null })}, 88)}}
									>
										<SketchPicker
											color={this.props.options.themeSubColor}
											onChange={this.updateColor.bind(this, 'themeSubColor')}
											onChangeComplete={this.setColor.bind(this, 'themeSubColor')}
										/>
									</div> : null}
							</div>
						</section>
					</section>

					<section>
						{this.getDisplayInput('extensions')}
						{this.getDisplayLabel('extensions')}
						<section>
							{this.getDisplayInput('extensions', 'extensionsExtensions', 'extensionsSub')}
							{this.getDisplayLabel('extensions', 'extensionsSub')}
							{this.getSwitch('recommend_extensions', 'recoExtensions')}
						</section>
						<section>
							{this.getDisplayInput('notifications', 'extensionsNotifications')}
							{this.getDisplayLabel('notifications')}
							{this.getSwitch('notify_state_change', 'notifyStateChange', 'for_X_seconds', 'notificationDuration_stateChange')}
							{this.getSwitch('notify_installation', 'notifyInstallation', 'for_X_seconds', 'notificationDuration_installation')}
							{this.getSwitch('notify_removal', 'notifyRemoval', 'for_X_seconds', 'notificationDuration_removal')}
						</section>

						<section>
							{this.getDisplayInput('history', 'extensionsHistory')}
							{this.getDisplayLabel('history')}
							{this.getSwitch('record_installation', 'historyInstall')}
							{this.getSwitch('record_update', 'historyUpdate')}
							{this.getSwitch('record_removal', 'historyRemove')}
							{this.getSwitch('record_enable', 'historyEnable')}
							{this.getSwitch('record_disable', 'historyDisable')}
						</section>

						<section>
							{this.getDisplayInput('autoState', 'extensionsAutoState')}
							{this.getDisplayLabel('autoState')}
							{this.getSwitch('autoState', 'autoState')}
							{this.getSwitch('notify_extension_state_change', 'autoStateNotification', 'for_X_seconds', 'notificationDuration_autoState')}
						</section>
					</section>

					<section>
						{this.getDisplayInput('advanced')}
						{this.getDisplayLabel('advanced')}
						<section>
							{this.getDisplayInput('advanced', 'advancedBasics', 'advancedSub')}
							{this.getDisplayLabel('advanced', 'advancedSub')}
							{this.getSwitch('join_community', 'joinCommunity')}
						</section>
						<section>
							{this.getDisplayInput('clean', 'advancedClean')}
							{this.getDisplayLabel('clean')}
							<div className="line"><button onClick={this.emptyHistory.bind(this)}>{GL('empty_history')}</button></div>
							<div className="line"><button onClick={this.resetEverything.bind(this)}>{GL('reset_everything')}</button></div>
						</section>
						<section>
							{this.getDisplayInput('backup', 'advancedBackup')}
							{this.getDisplayLabel('backup')}
							<input id="upload" type="file" onChange={this.importOptions.bind(this)}/>
							<div className="line"><button><label htmlFor="upload">{GL('import_options')}</label></button></div>
							<div className="line"><button onClick={this.exportOptions.bind(this)}>{GL('export_options')}</button></div>
						</section>
					</section>
			</OptionsDiv>
		);
	}
}

export default connect(
	mapStateToProps, 
	mapDispatchToProps
)(Options);
