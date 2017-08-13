import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { GL } from '../../utils';
import Manage from './Manage.js';
import AutoState from './AutoState.js';

const ExtensionsDiv = styled.div`
	padding: 22px;
	padding-top: 10px;
	overflow: hidden;
	nav{
		width: 80%;
		margin: auto;
		overflow: hidden;
		box-shadow: ${() => shared.themeMainColor} 0px 0px 1px;
		&:hover{
			box-shadow: ${() => shared.themeMainColor} 0px 0px 8px;
		}
		margin-top: 10px;
		margin-bottom: 3px;
		transition: box-shadow 0.1s;
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
			height: 36px;
			line-height: 36px;
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
	})
}

class Extensions extends Component{

	componentDidMount() {
		shared.getAllExtensions();
		shared.getGroupList();
		shared.getAutoStateRuleList();
	}

	render() {
		let core;
		if (this.props.location.sub['extensions'] == 'manage') {
			core = (
				<Manage
					updateSubWindow={this.props.updateSubWindow}
					icons={this.props.icons}
					extensions={this.props.extensions}
					groupList={this.props.groupList}
				/>
			);
		}
		else if (this.props.location.sub['extensions'] == 'autoState') {
			core = (
				<AutoState
					autoStateRuleList={this.props.autoStateRuleList}
					icons={this.props.icons}
					extensions={this.props.extensions}
					groupList={this.props.groupList}
				/>
			);
		}
		return (
			<ExtensionsDiv themeMainColor={window.shared.themeMainColor} themeSubColor={window.shared.themeSubColor}>
				{core}
			</ExtensionsDiv>
		);
	}
}

export default connect(
	mapStateToProps, 
	mapDispatchToProps
)(Extensions);
