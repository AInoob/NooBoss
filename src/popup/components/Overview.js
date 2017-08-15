import React, { Component } from 'react';
import { connect } from 'react-redux';
import { overviewUpdateBello } from '../actions';
import { GL, getDomainFromUrl, getCurrentUrl, ajax, promisedGet } from '../../utils';
import styled from 'styled-components';

const OverviewDiv = styled.div`
	padding-left: 16px;
`;

const mapStateToProps = (state, ownProps) => {
	return ({
		...ownProps,
		overview: state.overview
	});
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return ({
		...ownProps,
		updateBello: (bello) => {
			dispatch(overviewUpdateBello(bello));
		}
	})
}

class Overview extends Component{
	constructor(props) {
		super(props);
		this.state = {
			recommendedExtensionList: [],
			currentWebsite: 'ainoob.com',
		};
		this.initialize();
	}
	async initialize() {
		const url = await getCurrentUrl();
		const userId = await promisedGet('userId');
		this.setState({ userId });
		let domain = getDomainFromUrl(url);
		let currentWebsite = domain;
		if (domain.indexOf('.') == -1) {
			domain = 'all_websites';
			currentWebsite = GL(domain);
		}
		this.setState({ currentWebsite });
		let data = await ajax({
			type: 'POST',
			contentType: "application/json",
			data: JSON.stringify({ website: domain, userId }),
			url: 'https://ainoob.com/api/nooboss/website'
		});
		data = JSON.parse(data);
		const recommendedExtensionList = [];
		for (let i = 0; i < data.appInfos.length; i++) {
			const extensionInfo = data.appInfos[i];
			recommendedExtensionList.push({
				id: extensionInfo.appId,
				tags: extensionInfo.tags,
				votes: data.recos[extensionInfo.appId],
			});
		}
		const tags = {};
		for(let i = 0; i < data.tags.length; i ++) {
			const tag = data.tags[i];
			tags[tag.appId] = tags[tag.appId] || {};
			tags[tag.appId][tag.tag] = tag.tagged;
		}
		const votes = {};
		for(let i = 0; i < data.votes.length; i ++) {
			const vote = data.votes[i];
			votes[vote.appId] = vote.action;
		}
		this.setState({ recommendedExtensionList, tags, votes });
	}
	componentDidMount() {
		shared.getAllExtensions();
		shared.getGroupList();
		shared.getAutoStateRuleList();
	}
	toggleTag(id, tag) {
	}
	render() {
		console.log(this.state);
		const { extensions, groupList, autoStateRuleList } = this.props;
		const overview = {
			app: Object.keys(extensions).filter(id => extensions[id].isApp == true).length,
			extension: Object.keys(extensions).filter(id => extensions[id].type == 'extension').length,
			theme: Object.keys(extensions).filter(id => extensions[id].type == 'theme').length,
			group: groupList.length,
			autoStateRule: autoStateRuleList.length,
		};
		const recommendedExtensionList = this.state.recommendedExtensionList.map((elem, index) => {
			const active = {};
			const extensionWeb = {tags: {}};
			return (
				<div id="tags">
					<div className="tagColumn">
						<div onClick={this.toggleTag.bind(this, elem.id, 'useful')} className={"tag " + active['useful']}>{GL('useful')}<br />{extensionWeb.tags['useful'] || 0}</div>
						<div onClick={this.toggleTag.bind(this, elem.id, 'working')} className={"tag " + active['working']}>{GL('working')}<br />{extensionWeb.tags['working'] || 0}</div>
					</div>
					<div className="tagColumn">
						<div onClick={this.toggleTag.bind(this, elem.id, 'laggy')} className={"tag " + active['laggy']}>{GL('laggy')}<br />{extensionWeb.tags['laggy'] || 0}</div>
						<div onClick={this.toggleTag.bind(this, elem.id, 'buggy')} className={"tag " + active['buggy']}>{GL('buggy')}<br />{extensionWeb.tags['buggy'] || 0}</div>
					</div>
					<div className="tagColumn">
						<div onClick={this.toggleTag.bind(this, elem.id, 'not_working')} className={"tag " + active['not_working']}>{GL('not_working')}<br />{extensionWeb.tags['not_working'] || 0}</div>
						<div onClick={this.toggleTag.bind(this, elem.id, 'ASM')} className={"tag " + active['ASM']}>{GL('ASM')}<br />{extensionWeb.tags['ASM'] || 0}</div>
					</div>
				</div>
			);
		});
		return (
			<OverviewDiv>
				<input 
					onChange={(e)=>{
						this.props.updateBello(e.target.value);
					}} 
					value={this.props.overview.bello}
				/>
				<h2>
					{GL('you_have')}
				</h2>
				<div className="line">
					<span>{overview.extension + ' ' + GL('extension_s')}</span>,
					<span>{' ' + overview.app + ' ' + GL('app_s')}</span>,
					<span>{' ' + overview.theme + ' ' + GL('theme')}</span>
				</div>
				<div className="line">
					<span>{overview.group + ' ' + GL('group_s')}</span>
				</div>
				<div className="line">
					<span>{overview.autoStateRule + ' ' + GL('autoState_rule_s')}</span>
				</div>
				<h2>
					{GL('recommended_for').replace('X', this.state.currentWebsite)}
				</h2>
			</OverviewDiv>
		);
	}
}

export default connect(
mapStateToProps, 
mapDispatchToProps
)(Overview);
