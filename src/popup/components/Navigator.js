import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateLocation } from '../actions';
import styled from 'styled-components';

const NavigatorDiv = styled.nav`
	a{
		color: blue;
	}
	a.active{
		color: green;
	}
`;

const mapStateToProps = (state, ownProps) => {
	return ({
		...ownProps,
		location: state.location,
		navigator: state.navigator
	});
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return ({
		...ownProps,
		updateLocation: (location) => {
			dispatch(updateLocation(location));
		}
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
			}}>
				{name}
			</a>
		);
	}
	render() {
		const links = this.props.navigator.linkList.map((name, index) => {
			if (this.props.location == name) {
				return this.getLink(name, index, true);
			}
			else {
				return this.getLink(name, index);
			}
		});
		return (
			<NavigatorDiv>
				{links}
			</NavigatorDiv>
		);
	}
}

export default connect(
	mapStateToProps, 
	mapDispatchToProps
)(Navigator);
