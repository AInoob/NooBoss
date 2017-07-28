import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateLocation, navigatorUpdateHoverPosition } from '../actions';
import styled from 'styled-components';
import { GL, generateRGBAString } from '../utils';

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
		background-color: ${props => props.themeSubColor};
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
		&:hover{
			color: ${props => props.themeMainColor};
		}
	}
	a.active{
		color: ${props => props.themeMainColor};
	}
`;

const mapStateToProps = (state, ownProps) => {
	return ({
		...ownProps,
		location: state.location,
		navigator: state.navigator,
		options: state.options
	});
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return ({
		...ownProps,
		updateLocation: (location) => {
			dispatch(updateLocation(location));
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
					this.props.updateLocation(name);
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
			if (this.props.location == name) {
				activePosition = index;
				return this.getLink(name, index, true);
			}
			else {
				return this.getLink(name, index);
			}
		});
		return (
			<NavigatorDiv
				themeMainColor={generateRGBAString(this.props.options.themeMainColor || {"r":195,"g":147,"b":220,"a":1})}
				themeSubColor={generateRGBAString(this.props.options.themeSubColor || {"r":255,"g":255,"b":255,"a":1})}
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
