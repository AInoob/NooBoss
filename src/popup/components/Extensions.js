import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { updateSubLocation } from '../actions';
import { GL } from '../../utils';
import Selector from './Selector';

const ExtensionsDiv = styled.div`
	nav{
		width: 80%;
		margin: auto;
		a{
			width: 50%;
			display: block;
			float: left;
			text-align: center;
			font-size: 18px;
			background-color: white;
			color: ${props => props.themeMainColor};
			opacity: 0.4;
			cursor: pointer;
		}
		a.active{
			opacity: 1;
			cursor: default;
		}
	}
`;
const mapStateToProps = (state, ownProps) => {
	return ({
		...ownProps,
		location: state.location,
	});
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return ({
		...ownProps,
		updateSubLocation: (mainLocation, subLocation) => {
			dispatch(updateSubLocation(mainLocation, subLocation));
		},
	})
}

class Extensions extends Component{
	constructor(props) {
		super(props);
		this.state = {
			extensions: {},
			groupList: [],
			autoStateRuleList: [],
		};
		chrome.runtime.sendMessage({ job: 'getAllExtensions' }, extensions => {
			this.setState({ extensions });
		});
		chrome.runtime.sendMessage({ job: 'getGroupList' }, groupList => {
			this.setState({ groupList });
		});
		chrome.runtime.sendMessage({ job: 'getAutoStateRuleList' }, autoStateRuleList => {
			this.setState({ autoStateRuleList });
		});
		setTimeout(() => {console.log(this.state)}, 1000 );
	}

	render() {
		const subAddressList = ['manage', 'autoState'];
		const subNavigator = subAddressList.map((elem, index) => {
			let active = '';
			if(this.props.location.sub['extensions'] == elem) {
				active = 'active';
			}
			return <a className={active} onClick={this.props.updateSubLocation.bind(this, 'extensions', elem)} key={index}>{GL(elem)}</a>
		});
		return (
			<ExtensionsDiv themeMainColor={this.props.shared.themeMainColor} themeSubColor={this.props.shared.themeSubColor}>
				<nav>
					{subNavigator}
				</nav>
				<Selector />
			</ExtensionsDiv>
		);
	}
}

export default connect(
	mapStateToProps, 
	mapDispatchToProps
)(Extensions);
