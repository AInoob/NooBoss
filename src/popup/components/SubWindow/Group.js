import React, { Component } from 'react';
import styled from 'styled-components';
import { Sunny } from '../../../icons';
import { sendMessage } from '../../../utils';
import Selector from '../Selector';

const GroupDiv = styled.div`
	width: 100%;
	height: 100%;
	overflow-y: scroll;
	display: flex;
	#name{
		font-size: 36px;
		height: 36px;
		width: initial;
	}
`;

class Group extends Component{
	constructor(props) {
		super(props);
		this.listener = this.listener.bind(this);
	}
	listener(message, sender, sendResponse) {
		if (message) {
			if (message.job == 'groupUpdated' || message.job == 'extensionUpdated') {
				this.forceUpdate();
			}
		}
	}
	componentDidMount() {
		browser.runtime.onMessage.addListener(this.listener);
		const myInterval = setInterval(() => {
			console.log(Object.keys(shared.extensions).length);
			console.log(Object.keys(shared.icons).length);
			if (Object.keys(shared.extensions).length + Object.keys(shared.groupList).length == Object.keys(shared.icons).length ) {
				clearInterval(myInterval);
				this.forceUpdate();
			}
		}, 200);
	}
	componentWillUnmount() {
		browser.runtime.onMessage.removeListener(this.listener);
	}
	getGroup() {
		return shared.groupList.filter(group => { return group.id == this.props.id })[0];
	}
	change(type, e) {
		const group = JSON.parse(JSON.stringify(this.getGroup()));
		switch (type) {
			case 'name':
				group.name = e.target.value;
				break;
			case 'selectExtension':
				const id = e;
				let index = group.appList.indexOf(id);
				if ( index == -1) {
					group.appList.push(id);
				}
				else {
					group.appList.splice(index, 1);
				}
				break;
		}
		sendMessage({ job: 'groupUpdate', group });
	}
	render() {
		if (!shared || !shared.groupList) {
			return <GroupDiv><Sunny id="loader" color={shared.themeMainColor} /></GroupDiv>;
		}
		const group = this.getGroup();
		return (
			<GroupDiv>
				<section>
					<input id="name" onChange={this.change.bind(this, 'name')} value={group.name} />
					<Selector
						extensions={shared.extensions}
						selectedList={group.appList}
						select={this.change.bind(this, 'selectExtension')}
					/>
				</section>
			</GroupDiv>
		);
	}
}

export default Group;
