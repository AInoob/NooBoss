import React, { Component } from 'react';
import { Optioney, Switchy, Removy, Copyy, Groupy } from '../../icons';
import { sendMessage } from '../../utils';
import styled, { css } from 'styled-components';

const GroupBriefDiv = styled.div`
	box-shadow: ${() => shared.themeMainColor} 0px 0px 0px 1px;
	&:hover{
		box-shadow: ${() => shared.themeMainColor} 0px 0px 13px;
	}
	position: relative;
	width: 76px;
	height: 76px;
	padding: 20px;
	margin-left: 1px;
	margin-top: 1px;
	padding: 20px;
	float: left;
	overflow: hidden;
	.groupBrief{
		margin-top: -8px;
		width: 100%;
		height: 100%;
		position: relative;
		.groupIcon, .nameFront, .groupInfo{
			backface-visibility: hidden;
			transition: transform 0.309s;
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
		}
		.groupIcon{
			max-width: 100%;
			max-height: 100%;
		}
		svg.groupIcon{
			height: 100%;
		}
		#optioney{
			display: none;
		}
		.nameFront{
			top: 80px;
			height: 20px;
			overflow: hidden;
			text-align: center;
		}
		.groupIcon, .nameFront{
			transform: rotate(0deg);
		}
		.groupInfo{
			text-align: center;
			transform: rotateY(180deg);
			#groupName{
				display: block;
				margin-top: 10px;
				height: 71px;
				width: 118px;
				margin-left: -20px;
				color: ${() => shared.themeMainColor};
				cursor: pointer;
			}
		}
	}
	&:hover{
		.groupBrief{
			.groupIcon, .nameFront{
				transform: rotateY(180deg);
			}
			.groupInfo{
				transform: rotateY(0deg);
			}
		}
	}
	${props => props.withControl && css`
		.groupControl{
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
			.groupBrief{
				.groupIcon, .nameFront{
					transform: rotateY(0deg);
				}
				.groupInfo{
					transform: rotateY(180deg);
				}
			}
		}
	`}
	${props => props.viewMode == 'bigTile' && css `
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
		.groupInfo, .groupIcon{
			transform: rotateY(0deg) !important;
		}
		.groupControl{
			position: absolute;
			left: 86px;
			top: 36px;
			svg{
				float: left;
			}
		}
		.groupBrief{
			margin-top: 0px;
			.groupIcon{
				cursor: pointer;
				position: absolute;
				margin-top: 0px;
				margin-left: 0px;
				width: 64px;
			}
			#groupName{
				position: absolute;
				height: initial !important;
				margin-left: 0px;
				left: 95px;
				top: 0px;
				text-align: left;
				overflow: hidden;
				width: 145px !important;
			}
			#groupVersion{
				position: absolute;
				left: 400px;
			}
		}
	`}
	${props => props.viewMode == 'list' && css `
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
		.groupInfo, .groupIcon{
			transform: rotateY(0deg) !important;
		}
		.groupControl{
			#switchyEnable{
				left: 16px;
			}
			#switchyDisable{
				left: 44px;
			}
			#copyy{
				left: 540px;
			}
			#optioney{
				display: inline-block;
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
		.groupBrief{
			margin-top: 0px;
			.groupIcon{
				position: absolute;
				margin-top: 0px;
				margin-left: 63px;
				width: 26px;
				height: 26px !important;
			}
			#groupName{
				position: absolute;
				margin-left: 0px;
				margin-top: 0px !important;
				line-height: 26px;
				left: 119px;
				top: 0;
				text-align: left;
				overflow: hidden;
				width: 346px !important;
				height: 20px !important;
			}
			#groupVersion{
				position: absolute;
				left: 400px;
			}
		}
	`}
`;

class GroupBrief extends Component{
	render() {
		const group = this.props.group;
		let updateSubWindow = function() {};
		if (this.props.updateSubWindow) {
			updateSubWindow = this.props.updateSubWindow.bind(null, 'group', group.id);
		}
		let switchyEnable, switchyDisable, removy, copyy, optioney;
    switchyEnable = <Switchy id="switchyEnable" onClick={this.props.enable} color={shared.themeMainColor} />;
		switchyDisable = <Switchy id="switchyDisable" onClick={this.props.disable} color={shared.themeMainColor} changeRGBA='rgba(-155,-155,-155,-0.6)' />;
		optioney = <Optioney id="optioney" onClick={updateSubWindow} color={shared.themeMainColor} />
		copyy = <Copyy id="copyy" onClick={this.props.copy} color={shared.themeMainColor} />
		removy = <Removy id="removy" onClick={this.props.remove} color={shared.themeMainColor} />;
		const groupControl = !this.props.withControl ? null : (
			<div className="groupControl">
				{switchyEnable}
				{switchyDisable}
				{copyy}
				{optioney}
				{removy}
			</div>
		);
		return (
			<GroupBriefDiv viewMode={this.props.viewMode} onClick={this.props.onClick} selected={this.props.selected} withControl={this.props.withControl}>
				<div className="shadow"></div>
				<div className="groupBrief">
					{this.props.icon ? <img className="groupIcon" onClick={updateSubWindow} src={this.props.icon} /> : <Groupy className="groupIcon" onClick={updateSubWindow} color={shared.themeMainColor} />}
					<span className="nameFront">{group.name}</span>
					<div className="groupInfo">
						{groupControl}
						<span id="groupName" onClick={updateSubWindow}>{group.name}</span>
					</div>
				</div>
			</GroupBriefDiv>
		);
	}
}

export default GroupBrief;
