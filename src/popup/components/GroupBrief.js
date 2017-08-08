import React, { Component } from 'react';
import { Switchy, Removy, Copyy } from '../../icons';
import { sendMessage } from '../../utils';
import styled, { css } from 'styled-components';

const GroupBriefDiv = styled.div`
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
		.groupIcon, .nameFront{
			transform: rotate(0deg);
		}
		.groupInfo{
			text-align: center;
			transform: rotateY(180deg);
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
`;

class GroupBrief extends Component{
	render() {
		const group = this.props.group;
		let switchyEnable, switchyDisable, removy, copyy;
    switchyEnable = <Switchy onClick={this.props.enable} color={shared.themeMainColor} />;
		switchyDisable = <Switchy onClick={this.props.disable} color={shared.themeMainColor} changeRGBA='rgba(-155,-155,-155,-0.8)' />;
		copyy = <Copyy onClick={this.props.copy} color={shared.themeMainColor} />
		removy = <Removy onClick={this.props.remove} color={shared.themeMainColor} />;
		const groupControl = !this.props.withControl ? null : (
			<div className="groupControl">
				{switchyEnable}
				{switchyDisable}
				{copyy}
				{removy}
			</div>
		);
		return (
			<GroupBriefDiv withControl={this.props.withControl}>
				<div className="groupBrief">
					<img className="groupIcon" src={shared.icons[group.icon]} />
					<span className="nameFront">{group.name}</span>
					<div className="groupInfo">
						{groupControl}
						{group.name}
					</div>
				</div>
			</GroupBriefDiv>
		);
	}
}

export default GroupBrief;
