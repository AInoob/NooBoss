import React, { Component } from 'react';
import styled from 'styled-components';
import Selector from './Selector';

const ManageDiv = styled.div`
`;

class Manage extends Component{
	render() {
		return (
			<ManageDiv>
				<Selector
					viewMode={this.props.viewMode}
					updateSubWindow={this.props.updateSubWindow}
					icons={this.props.icons}
					groupList={this.props.groupList}
					extensions={this.props.extensions}
					actionBar={true}
					withControl={true}
				/>
			</ManageDiv>
		);
	}
}

export default Manage;
