import React, { Component } from 'react';
import { Launchy, Switchy, Optioney, Removy, Chromey } from '../../icons';
import { sendMessage } from '../../utils';
import styled, { css } from 'styled-components';

const ExtensionBriefDiv = styled.div`
	box-shadow: ${() => shared.themeMainColor} 0px 0px 0px 1px;
	&:hover{
		box-shadow: ${() => shared.themeMainColor} 0px 0px 13px;
	}
	width: 76px;
	height: 76px;
	padding: 20px;
	margin-left: 1px;
	margin-top: 1px;
	position: relative;
	padding: 20px;
	float: left;
	overflow: hidden;
	.shadow{
		display: none;
	}
	.extensionBrief{
		margin-top: -8px;
		width: 100%;
		height: 100%;
		position: relative;
		.extensionIcon, .nameFront, .extensionInfo{
			backface-visibility: hidden;
			transition: transform 0.111s;
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
			#extensionName{
				color: ${() => shared.themeMainColor};
				cursor: pointer;
				width: 118px;
				margin-left: -20px;
				height: 64px;
				display: block;
			}
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
	${props => (props.selected == true || props.selected == false) && css `
		box-shadow: none !important;
		cursor: pointer;
		width: 49px;
		height: 49px;
		margin: 0px !important;
		&:hover{
			.shadow{
				background-color: rgba(0, 0, 0, ${props => props.selected ? '0.09' : '0.4'});
			}
		}
		.shadow{
			z-index: 1;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			transition: background-color 0.309s;
			background-color: rgba(0, 0, 0, ${props => props.selected ? '0' : '0.5'});
			position: absolute;
			display: block !important;
		}
		.nameFront{
			top: 48px !important;
			width: 76px !important;
			margin-left: -14px;
		}
		&:hover{
			.extensionBrief{
				.extensionIcon, .nameFront{
					transform: rotateY(0deg);
				}
				.extensionInfo{
					transform: rotateY(180deg);
				}
			}
		}
	`}
	${props => props.viewMode === 'tile' && css `
		&:hover{
			.extensionBrief{
			    .extensionIcon {
			      display: none;
			    }
			}
		}
	`}

	${props => props.viewMode === 'bigTile' && css `
		width: 212px;
		height: 66px;
		padding: 6px;
		margin: 6px;
		margin-bottom: 12px;
		box-shadow: none;
		transition: none !important;
		&:hover{
			box-shadow: ${() => shared.themeMainColor} 0px 0px 6px 0px;
		}
		.nameFront{
			display: none;
		}
		.extensionInfo, .extensionIcon{
			transform: rotateY(0deg) !important;
		}
		.extensionControl{
			position: absolute;
			left: 86px;
			top: 36px;
			svg{
				float: left;
			}
		}
		.extensionBrief{
			margin-top: 0px;
			.extensionIcon{
				cursor: pointer;
				position: absolute;
				margin-top: 4px;
				margin-left: 4px;
				width: 53px;
			}
			#extensionName{
				position: absolute;
				height: initial !important;
				margin-left: 0px;
				left: 95px;
				top: 0px;
				text-align: left;
				overflow: hidden;
				width: 145px !important;
			}
			#extensionVersion{
				position: absolute;
				left: 400px;
			}
		}
	`}
	${props => props.viewMode === 'list' && css `
		width: 100%;
		height: 33px;
		padding: 0px;
		padding-top: 6px;
		box-shadow: none;
		transition: none !important;
		&:hover{
			box-shadow: ${() => shared.themeMainColor} 0px 0px 0px 1px;
		}
		.nameFront{
			display: none;
		}
		.extensionInfo, .extensionIcon{
			transform: rotateY(0deg) !important;
		}
		.extensionControl{
			#switchy{
				left: 16px;
			}
			#launchy{
				left: 540px;
			}
			#optioney{
				left: 570px;
			}
			#removy{
				left: 600px;
			}
			#chromey{
				left: 630px;
			}
			svg{
				position: absolute;
				top: 2px;
			}
		}
		.extensionBrief{
			margin-top: 0px;
			.extensionIcon{
				position: absolute;
				margin-top: 0px;
				margin-left: 36px;
				width: 26px;
			}
			#extensionName{
				position: absolute;
				margin-left: 0px;
				left: 90px;
				top: 0;
				text-align: left;
				overflow: hidden;
				line-height: 26px;
				width: 346px !important;
				height: 20px !important;
			}
			#extensionVersion{
				position: absolute;
				left: 400px;
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
			switchyRGBA = 'rgba(-155,-155,-155,-0.6)';
		}
		let launchy, switchy, optioney, removy, chromey;
		if (extension.isApp) {
			launchy=<Launchy id="launchy" onClick={sendMessage.bind(null, { job: 'launchApp', id: extension.id }, ()=>{})} color={shared.themeMainColor} />;
		}
		if (extension.type != 'theme') {
			switchy = <Switchy id="switchy" onClick={() => {
				const stateHistory = {};
				stateHistory[extension.id] = extension.enabled;
				this.props.addStateHistory(stateHistory);
				sendMessage({ job: 'extensionToggle', id: extension.id })
			}} color={shared.themeMainColor} changeRGBA={switchyRGBA} />;
		}
		if (extension.optionsUrl && extension.optionsUrl.length > 0) {
			optioney = <Optioney id="optioney" onClick={sendMessage.bind(null, { job: 'extensionOptions', id: extension.id }, () => {})} color={shared.themeMainColor} />;
		}
		removy = <Removy id="removy" onClick={sendMessage.bind(null, { job: 'extensionRemove', id: extension.id }, () => {})} color={shared.themeMainColor} />;
		chromey = <Chromey id="chromey" onClick={sendMessage.bind(null, { job: 'extensionBrowserOptions', id: extension.id }, () => {})} color={shared.themeMainColor} />;
		const extensionControl = !this.props.withControl ? null : (
			<div className="extensionControl">
				{launchy}
				{switchy}
				{optioney}
				{removy}
				{chromey}
			</div>
		);
		let updateSubWindow = function() {};
		if (this.props.updateSubWindow) {
			updateSubWindow = this.props.updateSubWindow.bind(null, 'extension', extension.id);
		}
		let icon;
		if (extension.icons && extension.icons.length > 0) {
			icon = extension.icons[extension.icons.length - 1].url;
		}
		if (!icon) {
			icon = this.props.icon;
		}
		return (
			<ExtensionBriefDiv viewMode={this.props.viewMode} onClick={this.props.onClick} selected={this.props.selected} disabled={disabled} withControl={this.props.withControl}>
				<div className="shadow"></div>
				<div className="extensionBrief">
					<img onClick={updateSubWindow} className="extensionIcon" src={icon} />
					<span className="nameFront">{extension.name}</span>
					<div className="extensionInfo">
						{extensionControl}
						<span id="extensionVersion">{extension.version}</span><br />
						<span id="extensionName" onClick={updateSubWindow}>{extension.name}</span>
					</div>
				</div>
			</ExtensionBriefDiv>
		);
	}
}

export default ExtensionBrief;
