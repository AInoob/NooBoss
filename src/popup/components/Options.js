import React, { Component } from 'react';
import { connect } from 'react-redux';
import { } from '../actions';
import { GL, set, generateRGBAString } from '../utils';
import { SketchPicker } from 'react-color';
import { optionsUpdateThemeMainColor, optionsUpdateThemeSubColor} from '../actions';
import styled from 'styled-components';

const OptionsDiv = styled.div`
	.sketch-picker{
		margin-left: 32px;
		float: left;
		margin-top: 6px;
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
			colorPicker: null
		};
	}

	generateRGBAString(rgbaObject) {
		return 'rgba('+rgbaObject.r+','+rgbaObject.g+','+rgbaObject.b+','+rgbaObject.a+')';
	}

	updateColor(name, color) {
		color = color.rgb;
		switch (name) {
			case 'themeMainColor':
				this.props.updateThemeMainColor(color);
				console.log(color);
				set('mainColor', color);
				break;
			case 'themeSubColor':
				this.props.updateThemeSubColor(color);
				console.log(color);
				set('subColor', color);
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

	render() {
		const themeMainColor = generateRGBAString(this.props.options.themeMainColor);
		const themeSubColor = generateRGBAString(this.props.options.themeSubColor);
		return (
			<OptionsDiv themeMainColor={themeMainColor} themeSubColor={themeSubColor}>
				<section>
					<h2>{GL('experience')}</h2>
					<section>
						<h3>{GL('theme')}</h3>
						<section>
							<div className="line">
								<span className="left">{GL('main_color')}</span>
								<div className="left" id="themeMainColorPicker" onClick={this.updateColorPicker.bind(this, 'themeMainColor')} />
								{this.state.colorPicker == 'themeMainColor' ?
									<SketchPicker
										className="color-picker"
										color={this.props.options.themeMainColor}
										onChange={this.updateColor.bind(this, 'themeMainColor')}
									/> : null}
							</div>
							<div className="line">
								<span className="left">{GL('sub_color')}</span>
								<div className="left" id="themeSubColorPicker" onClick={this.updateColorPicker.bind(this, 'themeSubColor')} />
								{this.state.colorPicker == 'themeSubColor' ?
									<SketchPicker
										className="color-picker"
										color={this.props.options.themeSubColor}
										onChange={this.updateColor.bind(this, 'themeSubColor')}
									/> : null}
							</div>
						</section>
					</section>

					<h2>{GL('extensions')}</h2>
					<section>
						<h3>{GL('notifications')}</h3>
						<h3>{GL('history')}</h3>
						<h3>{GL('auto_state')}</h3>
						<h3>{GL('join_community')}</h3>
					</section>

					<h2>{GL('userscripts')}</h2>

					<h2>{GL('advanced_settings')}</h2>
						<section>
						<h3>{GL('clear_history')}</h3>
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
