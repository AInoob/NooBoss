import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { updateSubLocation } from '../actions';
import { GL } from '../../utils';
import Manage from './Manage.js';
import AutoState from './AutoState.js';

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
	}

	componentDidMount() {
		chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
			if (message) {
				console.log(message.job);
				switch (message.job) {
					case 'extensionToggled':
						console.log('yay');
						this.setState(prevState => {
							if (prevState.extensions[message.id]) {
								prevState.extensions[message.id].enabled = message.enabled;
							}
							return prevState;
						});
						break;
				}
			}
		});
		chrome.runtime.sendMessage({ job: 'getAllExtensions' }, extensions => {
			this.setState({ extensions });
			const keyList = Object.keys(extensions);
			for(let i = 0; i < keyList.length; i++) {
				if (!window.shared.icons[extensions[keyList[i]].icon]) {
					this.props.getIcon(extensions[keyList[i]].icon);
				}
			}
		});
		chrome.runtime.sendMessage({ job: 'getGroupList' }, groupList => {
			this.setState({ groupList });
		});
		chrome.runtime.sendMessage({ job: 'getAutoStateRuleList' }, autoStateRuleList => {
			this.setState({ autoStateRuleList });
		});
	}

	render() {
		const subAddressList = ['manage', 'autoState'];
		const subNavigator = subAddressList.map((elem, index) => {
			let active = '';
			if (this.props.location.sub['extensions'] == elem) {
				active = 'active';
			}
			return <a className={active} onClick={this.props.updateSubLocation.bind(this, 'extensions', elem)} key={index}>{GL(elem)}</a>
		});
		let core;
		if (this.props.location.sub['extensions'] == 'manage') {
			core = <Manage extensions={this.state.extensions} groupList={this.state.groupList} />
		}
		else if (this.props.location.sub['extensions'] == 'autoState') {
			core = <AutoState autoStateRuleList={this.state.autoStateRuleList} extensions={this.state.extensions} groupList={this.state.groupList} />
		}
		return (
			<ExtensionsDiv themeMainColor={window.shared.themeMainColor} themeSubColor={window.shared.themeSubColor}>
				<nav>
					{subNavigator}
				</nav>
				{core}
			</ExtensionsDiv>
		);
	}
}

export default connect(
	mapStateToProps, 
	mapDispatchToProps
)(Extensions);
