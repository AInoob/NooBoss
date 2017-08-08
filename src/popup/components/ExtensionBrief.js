import React, { Component } from 'react';
import { Switchy, Optioney, Removy, Chromey } from '../../icons';
import { sendMessage } from '../../utils';
import styled, { css } from 'styled-components';

const ExtensionBriefDiv = styled.div`
	box-shadow: ${() => shared.themeMainColor} 0px 0px 0px 1px;
	&:hover{
		box-shadow: ${() => shared.themeMainColor} 0px 0px 13px;
	}
	width: 78px;
	height: 78px;
	padding: 20px;
	margin-left: 1px;
	margin-top: 1px;
	padding: 20px;
	float: left;
	overflow: hidden;
	.extensionBrief{
		margin-top: -8px;
		width: 100%;
		height: 100%;
		position: relative;
		.extensionIcon, .nameFront, .extensionInfo{
			backface-visibility: hidden;
			transition: transform 0.309s;
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
		}
		.extensionIcon{
			width: 80%;
			margin-left: 10%;
			margin-top: 6px;
		}
		.nameFront{
			top: 80px;
			height: 20px;
			overflow: hidden;
			text-align: center;
		}
		.extensionIcon, .nameFront{
			transform: rotate(0deg);
		}
		.extensionInfo{
			text-align: center;
			transform: rotateY(180deg);
		}
	}
	&:hover{
		.extensionBrief{
			.extensionIcon, .nameFront{
				transform: rotateY(180deg);
			}
			.extensionInfo{
				transform: rotateY(0deg);
			}
		}
	}
	${props => props.disabled && css`
		.extensionIcon{
			filter: grayscale(100%);
		}
	`};
	${props => props.withControl && css`
		.extensionControl{
			position: relative;
			width: 109px;
			margin-left: -12px;
			img{
				width: 18px;
			}
			svg{
				cursor: pointer;
				width: 21px;
				height: 21px;
				margin-right: 3px;
			}
		}
	`}
`;

class ExtensionBrief extends Component{
	render() {
		const extension = this.props.extension;
		let switchyRGBA = undefined;
		let disabled = false;
		if (!extension.enabled) {
			disabled = true;
			switchyRGBA = 'rgba(-155,-155,-155,-0.8)';
		}
		let switchy, optioney, removy, chromey;
		if (extension.type != 'theme') {
			switchy = <Switchy onClick={() => {
				const stateHistory = {};
				stateHistory[extension.id] = extension.enabled;
				this.props.addStateHistory(stateHistory);
				sendMessage({ job: 'extensionToggle', id: extension.id })
			}} color={shared.themeMainColor} changeRGBA={switchyRGBA} />;
		}
		if (extension.optionsUrl && extension.optionsUrl.length > 0) {
			optioney = <Optioney onClick={sendMessage.bind(null, { job: 'extensionOptions', id: extension.id }, () => {})} color={shared.themeMainColor} />;
		}
		removy = <Removy onClick={sendMessage.bind(null, { job: 'extensionRemove', id: extension.id }, () => {})} color={shared.themeMainColor} />;
		chromey = <Chromey onClick={sendMessage.bind(null, { job: 'extensionBrowserOptions', id: extension.id }, () => {})} color={shared.themeMainColor} />;
		const extensionControl = !this.props.withControl ? null : (
			<div className="extensionControl">
				{switchy}
				{optioney}
				{removy}
				{chromey}
			</div>
		);
		return (
			<ExtensionBriefDiv disabled={disabled} withControl={this.props.withControl}>
				<div className="extensionBrief">
					<img className="extensionIcon" src={shared.icons[extension.icon]} />
					<span className="nameFront">{extension.name}</span>
					<div className="extensionInfo">
						{extensionControl}
						{extension.version}<br />
						{extension.name}
					</div>
				</div>
			</ExtensionBriefDiv>
		);
	}
}

export default ExtensionBrief;
