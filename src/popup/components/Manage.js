import React, { Component } from 'react';
import styled from 'styled-components';
import Selector from './Selector';

const ManageDiv = styled.div`
`;

class Manage extends Component{
	render() {
		return (
			<ManageDiv>
				<Selector groupList={this.props.groupList} extensions={this.props.extensions} actionBar={true} withControl={true} />
			</ManageDiv>
		);
	}
}

export default Manage;
