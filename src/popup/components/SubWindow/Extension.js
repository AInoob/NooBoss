import React, { Component } from 'react';
import styled from 'styled-components';
import { Extensiony } from '../../../icons';

const ExtensionDiv = styled.div`
	width: 100%;
	height: 100%;
	position: relative;
	cursor: initial;
	display: flex;
	overflow-y: scroll;
	&::-webkit-scrollbar-track{
		background: white;
	}
	&::-webkit-scrollbar{
		width: 5px;
	}
	&::-webkit-scrollbar-thumb{
		background: ${props => window.shared.themeMainColor};
	}
`;

class Extension extends Component{
	constructor(props) {
		super(props);
	}
	render() {
		const extension = this.props.extension;
		if (!extension || !this.props.icons[extension.icon]) {
			return <ExtensionDiv><Extensiony id="loader" color={shared.themeMainColor} /></ExtensionDiv>;
		}
		return (
			<ExtensionDiv>
				<section>
					<h1><a>{extension.name}</a></h1>
				</section>
			</ExtensionDiv>
		);
	}
}

export default Extension;
