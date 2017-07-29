import React, { Component } from 'react';
import { connect } from 'react-redux';
import { } from '../actions';
import { GL, set, generateRGBAString, sendMessage } from '../../utils';
import { SketchPicker } from 'react-color';
import { optionsUpdateThemeMainColor, optionsUpdateThemeSubColor } from '../actions';
import styled from 'styled-components';

const OptionsDiv = styled.div`
	.colorPickerHolder{
		overflow: hidden;
		margin-left: 32px;
		float: left;
		margin-top: 6px;
		box-shadow: grey -1px -1px 3px 0px;
		&:focus{
			box-shadow: grey -1px -1px 8px 0px;
			outline: none;
		}
	}
	#themeMainColorPicker, #themeSubColorPicker{
		cursor: pointer;
		margin-top: 8px;
		margin-left: 32px;
		width: 36px;
		height: 16px;
		box-shadow: grey -1px -1px 3px 0px;
		&:hover{
			box-shadow: grey -1px -1px 8px 0px;
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
		margin-left: 32px;
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
			autoState: false,
			autoStateNotification: false,
		};
	}

	componentWillMount() {
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
			'notificationDuration_installation',
			'notificationDuration_autoState',
			'notificationDuration_removal',
			'notificationDuration_stateChange'
		];
		for(let i = 0; i < options.length; i++) {
			get(options[i], function(key, value) {
				this.setState({ key: value });
			}.bind(this, options[i]));
		}
	}

	generateRGBAString(rgbaObject) {
		return 'rgba('+rgbaObject.r+','+rgbaObject.g+','+rgbaObject.b+','+rgbaObject.a+')';
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

	getSwitch(name, key) {
		return (
			<div className="line">
			</div>
		);
	}

	render() {
		const themeMainColor = generateRGBAString(this.props.options.themeMainColor);
		const themeSubColor = generateRGBAString(this.props.options.themeSubColor);
		return (
			<OptionsDiv themeMainColor={themeMainColor} themeSubColor={themeSubColor}>
					<section>
						<h2>{GL('experience')}</h2>
						<section>
							<h3>{GL('theme')}</h3>
							<div className="line">
								<span className="left">{GL('main_color')}</span>
								<div className="left" id="themeMainColorPicker" onClick={this.updateColorPicker.bind(this, 'themeMainColor')} />
								{this.state.colorPicker == 'themeMainColor' ?
									<div
										ref={div => div && div.focus()}
										className="colorPickerHolder"
									 	tabIndex="-1"
										onBlur={()=>{this.setState({ colorPicker: null })}}
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
										onBlur={()=>{this.setState({ colorPicker: null })}}
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
						<h2>{GL('extensions')}</h2>
						<section>
							<h3>{GL('notifications')}</h3>
							{this.getSwitch('notify_state_change', 'notifyStateChange')}
						</section>

						<section>
							<h3>{GL('history')}</h3>
						</section>

						<section>
							<h3>{GL('auto_state')}</h3>
						</section>

						<section>
							<h3>{GL('join_community')}</h3>
						</section>
					</section>

					<section>
						<h2>{GL('userscripts')}</h2>
					</section>

					<section>
						<h2>{GL('advanced_settings')}</h2>
						<section>
							<h3>{GL('clear_history')}</h3>
						</section>
						<section>
							<h3>{GL('reset_everything')}</h3>
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
