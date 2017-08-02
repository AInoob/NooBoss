import React, { Component } from 'react';
import styled from 'styled-components';
import { GL, getDB, generateRGBAString } from '../../utils';
import TimeAgo from 'timeago-react';

const HistoryDiv = styled.div`
	padding: 16px;
	padding-left: 32px;
	padding-right: 32px;
	table{
		width: 100%;
		border-collapse: collapse;
		#when{
			width: 116px;
		}
		#event{
			width: 80px;
		}
		#icon{
			width: 50px;
		}
		#name{
			width: 333px;
		}
		#version{
		}
		td, th{
			text-align: left;
		}
		.record{
			& + .record{
				border-top: ${props => props.themeMainColor} solid 1px;
			}
			.icon{
				img{
					margin-top: 3px;
					width: 22px;
					height: 22px;
				}
			}
		}
	}
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
				if (!this.props.shared.icons[record.icon]) {
					await this.props.getIcon(record.icon);
				}
			}
		});
	}

	render() {
		const recordList = (this.state.recordList || []).map((record, index) => {
			return (
				<tr key={index} className="record">
					<td><TimeAgo datetime={record.date} locale={this.props.language} /></td>
					<td>{record.event}</td>
					<td className="icon"><img src={this.props.shared.icons[record.icon]} /></td>
					<td>{record.name}</td>
					<td>{record.version}</td>
				</tr>
			);
		});
		return (
			<HistoryDiv
				themeMainColor={this.props.shared.themeMainColor}
			>
				<table>
					<thead>
						<tr>
							<th id="when">{GL('when')}</th>
							<th id="event">{GL('event')}</th>
							<th id="icon">{GL('icon')}</th>
							<th id="name">{GL('name')}</th>
							<th id="version">{GL('version')}</th>
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
