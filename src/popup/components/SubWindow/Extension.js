import React, { Component } from 'react';
import styled from 'styled-components';
import { Extensiony } from '../../../icons';
import { ajax, promisedGet, getChromeVersion } from '../../../utils';

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
		this.state = {
			crxUrl: '',
			crxVersion: '',
			rating: '? / 5',
			appInfoWeb: { tags: [], upVotes: 0, downVotes: 0 },
			tags: {},
			joinCommunity: false,
			userId: 'notBelloed',
		};
	}
	async componentDidMount() {
		const id = this.props.id;
		const joinCommunity = await promisedGet('joinCommunity');
		let data;
		if (joinCommunity) {
			this.setState({ joinCommunity });
			const userId = await promisedGet('userId');
			this.setState({ userId });
			data = await ajax({
				type: 'POST',
				contentType: "application/json",
				data: JSON.stringify({ userId, appId: id }),
				url:'https://ainoob.com/api/nooboss/app'
			});
			data = JSON.parse(data);
			const tags = {};
			for (let i = 0; i < data.tags.length; i++) {
				tags[data.tags[i].tag] = data.tags[i].tagged;
			}
			this.setState({ appInfoWeb: data.appInfo, tags });
		}
		data = await ajax({
			url: 'https://clients2.google.com/service/update2/crx?prodversion=' + getChromeVersion() + '&x=id%3D' + id + '%26installsource%3Dondemand%26uc'
		});
		const crxUrl = data.match('codebase=\"\([^ ]*)\"')[1];
		const crxVersion = data.slice(20).match('version=\"\([^ ]*)\"')[1];
		this.setState({ crxUrl, crxVersion });
		data = await ajax({
			url: 'https://chrome.google.com/webstore/detail/'+id,
		});
		const rating = parseFloat(data.match(/g:rating_override=\"([\d.]*)\"/)[1]).toFixed(3)+' / 5';
		this.setState({ rating });
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
