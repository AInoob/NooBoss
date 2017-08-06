import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { Switchy, Optioney, Removy } from '../../icons';
import { sendMessage } from '../../utils';

const SelectorDiv = styled.div`
	.extension{
		width: 100px;
		height: 100px;
		padding: 10px;
		float: left;
		overflow: hidden;
		.appBrief{
			width: 100%;
			height: 100%;
			position: relative;
			.appIcon, .appInfo{
				backface-visibility: hidden;
				transition: transform 0.309s;
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
			}
			.appIcon{
				transform: rotate(0deg);
			}
			.appInfo{
				text-align: center;
				transform: rotateY(180deg);
			}
		}
		&:hover{
			.appBrief{
				.appIcon{
					transform: rotateY(180deg);
				}
				.appInfo{
					transform: rotateY(0deg);
				}
			}
		}
	}
	.disabled{
		.appIcon{
			filter: grayscale(100%);
		}
	}
	${props => props.withControl && css`
		.extension{
			.appBrief{
				width: 77px;
				height: 77px;
			}
			.appControl{
				position: absolute;
				left: 80px;
				svg{
					cursor: pointer;
					width: 22px;
					height: 22px;
				}
			}
		}
	`}
`;

class Selector extends Component{
	render() {
		const extensionList = Object.keys(this.props.extensions).map((elem, index) => {
			const extension = this.props.extensions[elem];
			let switchyRGBA = undefined;
			let disabled;
			if (!extension.enabled) {
				disabled = 'disabled';
				switchyRGBA = 'rgba(-100,-100,-100,-0.618)';
			}
			let switchy, optioney, removy, chromey;
			if (extension.type != 'theme') {
				switchy = <Switchy onClick={sendMessage.bind(null, { job: 'extensionToggle', id: extension.id }, () => {})} color={shared.themeMainColor} changeRGBA={switchyRGBA} />;
			}
			if (extension.optionsUrl && extension.optionsUrl.length > 0) {
				optioney = <Optioney onClick={sendMessage.bind(null, { job: 'extensionOptions', id: extension.id }, () => {})} color={shared.themeMainColor} />;
			}
			removy = <Removy onClick={sendMessage.bind(null, { job: 'extensionRemove', id: extension.id }, () => {})} color={shared.themeMainColor} />;
			chromey = <img onClick={sendMessage.bind(null, { job: 'extensionBrowserOptions', id: extension.id }, () => {})} src="./images/chrome.svg" />;
			const appControl = !this.props.withControl ? null : (
				<div className="appControl">
					{switchy}
					{optioney}
					{removy}
					{chromey}
				</div>
			);
			return (
				<div className={'extension '+disabled} key={index}>
					<div className="appBrief">
						<img className="appIcon" src={shared.icons[extension.icon]} />
						<div className="appInfo">
							{extension.version}<br />
							{extension.name}
						</div>
						{appControl}
					</div>
				</div>
			);
		});
		return (
			<SelectorDiv withControl={this.props.withControl}>
				{extensionList}
			</SelectorDiv>
		);
	}
}

export default Selector;
