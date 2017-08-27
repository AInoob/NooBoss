import React, { Component } from 'react';
import styled from 'styled-components';
import { isZh, sendMessage, GL, getDB, generateRGBAString } from '../../utils';
import { Closey } from '../../icons';
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
			.name{
				cursor: pointer;
				color: ${() => shared.themeMainColor};
			}
			.icon{
				img{
					margin-top: 3px;
					width: 22px;
					height: 22px;
				}
			}
			.remove{
				svg{
					display: none;
					margin-top: 4px;
					width: 15px;
					height: 15px;
					cursor: pointer;
				}
			}
			&:hover{
				background-color: #eeeeee;
				.remove{
					svg{
						display: table-row;
					}
				}
			}
		}
	}
`;

class History extends Component{
	constructor(props) {
		super(props);
		this.state = {
			maxRecords: 30,
			isZh: false,
		};
	}
	async componentDidMount() {
		this.props.updateScrollChild(this);
		this.props.getRecordList();
		this.setState({ isZh: await isZh() });
	}

	componentWillUnmount() {
		this.props.updateScrollChild(null);
	}
	onScroll(e) {
		const noobossDiv = document.getElementById('noobossDiv');
		if (noobossDiv.scrollHeight - (noobossDiv.scrollTop + noobossDiv.clientHeight) < 200) {
			this.setState({ maxRecords: this.state.maxRecords + 20 });
		}
	}

	render() {
		const icons = this.props.icons;
		const recordList = this.props.recordList.sort((a, b) => {
			return b.date - a.date
		}).filter((elem, index) => index < this.state.maxRecords).map((record, index) => {
			return (
				<tr key={index} className="record">
					<td><TimeAgo datetime={record.date} locale={this.state.isZh ? 'zh_CN' : 'en'} /></td>
					<td>{GL(record.event)}</td>
					<td className="icon"><img src={icons[record.icon]} /></td>
					<td className="name" onClick={this.props.updateSubWindow.bind(null, 'extension', record.id)}>{record.name}</td>
					<td>{record.version}</td>
					<td className="remove"><Closey onClick={sendMessage.bind(null, { job: 'historyRemoveRecord', index }, ()=>{})} color={shared.themeMainColor} /></td>
				</tr>
			);
		});
		return (
			<HistoryDiv
				themeMainColor={window.shared.themeMainColor}
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
