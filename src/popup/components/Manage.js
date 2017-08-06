import React, { Component } from 'react';
import styled from 'styled-components';
import Selector from './Selector';

const ManageDiv = styled.div`
`;

class Manage extends Component{
	render() {
		return (
			<ManageDiv>
				<Selector extensions={this.props.extensions} withControl={true} />
			</ManageDiv>
		);
	}
}

export default Manage;
