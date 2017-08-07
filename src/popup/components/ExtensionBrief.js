import React, { Component } from 'react';
import { Switchy, Optioney, Removy, Chromey } from '../../icons';
import { sendMessage } from '../../utils';
import styled, { css } from 'styled-components';

const ExtensionBriefDiv = styled.div`
	box-shadow: grey 0px 1px 1px;
	&:hover{
		box-shadow: grey 0px 1px 13px;
	}
	width: 86.66666px;
	height: 86.66666px;
	padding: 20px;
	float: left;
	overflow: hidden;
	.appBrief{
		width: 100%;
		height: 100%;
		position: relative;
		.appIcon, .nameFront, .appInfo{
			backface-visibility: hidden;
			transition: transform 0.309s;
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
		}
		.appIcon{
			width: 90%;
			margin: auto;
		}
		.nameFront{
			top: 86px;
			text-align: center;
		}
		.appIcon, .nameFront{
			transform: rotate(0deg);
		}
		.appInfo{
			text-align: center;
			transform: rotateY(180deg);
		}
	}
	&:hover{
		.appBrief{
			.appIcon, .nameFront{
				transform: rotateY(180deg);
			}
			.appInfo{
				transform: rotateY(0deg);
			}
		}
	}
	${props => props.disabled && css`
		.appIcon{
			filter: grayscale(100%);
		}
	`};
	${props => props.withControl && css`
		.appControl{
			position: relative;
			width: 109px;
			margin-left: -10px;
			img{
				width: 18px;
			}
			svg{
				cursor: pointer;
				width: 21px;
				height: 21px;
				margin: 3px;
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
		const appControl = !this.props.withControl ? null : (
			<div className="appControl">
				{switchy}
				{optioney}
				{removy}
				{chromey}
			</div>
		);
		return (
			<ExtensionBriefDiv disabled={disabled} withControl={this.props.withControl}>
				<div className="appBrief">
					<img className="appIcon" src={shared.icons[extension.icon]} />
					<span className="nameFront">{extension.name}</span>
					<div className="appInfo">
						{appControl}
						{extension.version}<br />
						{extension.name}
					</div>
				</div>
			</ExtensionBriefDiv>
		);
	}
}

export default ExtensionBrief;
