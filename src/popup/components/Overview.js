import React, { Component } from 'react';
import { connect } from 'react-redux';
import { overviewUpdateBello } from '../actions';
import { GL } from '../../utils';
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
		};
	}
	componentDidMount() {
		shared.getAllExtensions();
		shared.getGroupList();
		shared.getAutoStateRuleList();
	}
	render() {
		const { extensions, groupList, autoStateRuleList } = this.props;
		const overview = {
			app: Object.keys(extensions).filter(id => extensions[id].isApp == true).length,
			extension: Object.keys(extensions).filter(id => extensions[id].type == 'extension').length,
			theme: Object.keys(extensions).filter(id => extensions[id].type == 'theme').length,
			group: groupList.length,
			autoStateRule: autoStateRuleList.length,
		};
		return (
			<OverviewDiv>
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
				<input 
					onChange={(e)=>{
						this.props.updateBello(e.target.value);
					}} 
					value={this.props.overview.bello}
				/>
			</OverviewDiv>
		);
	}
}

export default connect(
	mapStateToProps, 
	mapDispatchToProps
)(Overview);
