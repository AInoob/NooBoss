import React, { Component } from 'react';
import styled from 'styled-components';
import { GL, getDB } from '../../utils';

const HistoryDiv = styled.div`
`;

class History extends Component{
	constructor(props) {
		super(props);
		this.state = {
			recordList: [],
			icons: {},
		};
		getDB('history_records', async (recordList=[]) => {
			this.setState({ recordList });
			for(let i = 0; i < recordList.length; i++) {
				const record = recordList[i];
				if (!this.props.icons[record.icon]) {
					await this.props.getIcon(record.icon);
				}
			}
		});
	}

	render() {
		const recordList = (this.state.recordList || []).map((record, index) => {
			return (
				<tr key={index}>
					<th>{record.date}</th>
					<th>{record.event}</th>
					<th><img src={this.props.icons[record.icon]} /></th>
					<th>{record.name}</th>
					<th>{record.version}</th>
				</tr>
			);
		});
		return (
			<HistoryDiv>
				<table>
					<thead>
						<tr>
							<th>GL('when')</th>
							<th>GL('event')</th>
							<th>GL('icon')</th>
							<th>GL('name')</th>
							<th>GL('version')</th>
						</tr>
					</thead>
					<tbody>
						{recordList}
					</tbody>
				</table>
			</HistoryDiv>
		);
	}
}

export default History;
