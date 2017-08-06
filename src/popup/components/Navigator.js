import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateMainLocation, navigatorUpdateHoverPosition } from '../actions';
import styled from 'styled-components';
import { GL } from '../../utils';

const NavigatorDiv = styled.nav`
	position: relative;
	width: 100%;
	overflow: hidden;
	&:hover{
		box-shadow: grey -2px -2px 6px 0px;
	}
	transition: box-shadow 0.309s;
	background-color: ${props => props.themeMainColor};
	z-index: 0;
	#selector{
		position: absolute;
		width: ${props => (100 / props.numOfLinks) + '%'};
		height: 33px;
		background-color: white;
		z-index: -1;
		margin-left: ${props => (props.hoverPosition * 100 / props.numOfLinks) + '%'};
		transition: margin-left 0.309s;
	}
	a{
		user-select: none;
		color: white;
		display: block;
		float: left;
		font-size: large;
		text-align: center;
		width: ${props => (100 / props.numOfLinks) + '%'};
		transition: color 0.309s;
		cursor: pointer;
		height: 33px;
		line-height: 33px;
		&:nth-child(${props => props.hoverPosition + 2}){
			color: ${props => props.themeMainColor};
		}
	}
	a.active{
		cursor: default;
	}
`;

const mapStateToProps = (state, ownProps) => {
	return ({
		...ownProps,
		location: state.location,
		navigator: state.navigator,
	});
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return ({
		...ownProps,
		updateMainLocation: (location) => {
			dispatch(updateMainLocation(location));
		},
		navigatorUpdateHoverPosition: (position) => {
			dispatch(navigatorUpdateHoverPosition(position));
		},
	})
}

class Navigator extends Component{
	constructor(props) {
		super(props);
	}
	getLink(name, index, isActive) {
		return (
			<a key={index}
				className={(isActive ? 'active' : '')}
				onClick={() => {
					this.props.updateMainLocation(name);
					this.props.navigatorUpdateHoverPosition(index);
				}}
				onMouseOver={() => {
					this.props.navigatorUpdateHoverPosition(index);
				}}
			>
				{GL(name)}
			</a>
		);
	}
	render() {
		let activePosition = 0;
		const links = this.props.navigator.linkList.map((name, index) => {
			if (this.props.location.main == name) {
				activePosition = index;
				return this.getLink(name, index, true);
			}
			else {
				return this.getLink(name, index);
			}
		});
		return (
			<NavigatorDiv
				themeMainColor={window.shared.themeMainColor}
				themeSubColor={window.shared.themeSubColor}
				numOfLinks={links.length}
				hoverPosition={this.props.navigator.hoverPosition}
				onMouseOut={() => {
					this.props.navigatorUpdateHoverPosition(activePosition);
				}}
			>
				<div id="selector" />
				{links}
			</NavigatorDiv>
		);
	}
}

export default connect(
	mapStateToProps, 
	mapDispatchToProps
)(Navigator);
