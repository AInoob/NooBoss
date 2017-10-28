import React, { Component } from 'react';
import styled from 'styled-components';
import { Extensiony, Launchy, Switchy, Removy, Optioney, Chromey, Addy } from '../../../icons';
import { copy, ajax, promisedGet, getChromeVersion, GL, capFirst, getString, sendMessage } from '../../../utils';
import TimeAgo from 'timeago-react';

const ExtensionDiv = styled.div`
	width: 100%;
	height: 100%;
	position: relative;
	cursor: initial;
	display: ${props => props.display || 'block'};
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
  a{
		color: ${props => window.shared.themeMainColor} !important;
  }
  #actions{
    margin-top: 16px;
    margin-left: 16px;
    width: 100%;
    #icon{
      cursor: pointer;
      float: left;
      width: 80px;
      height: 80px;
      display: block;
      img{
        width: 100%;
      }
    }
    svg{
      cursor: pointer;
      float: left;
      width: 60px;
      height: 60px;
      margin-top: 20px;
      margin-left: 40px;
      & + svg{
        margin-left: 10px;
      }
    }
  }
  #title{
    overflow: hidden;
    font-size: 30px;
    display: block;
    width: 574px;
    margin: auto;
    text-decoration: none;
    color: ${props => shared.themeMainColor};
    height: 35px;
    border-bottom: 1px solid ${props => shared.themeMainColor};
    clear: left;
  }
  #appBrief, #appDetail{
    width: 95%;
    margin: auto;
    font-size: 1.2em;
    table-layout: fixed;
    tbody{
      tr{
        td{
          ul{
            padding-left: 0px;
            li{
              list-style-type: none;
            }
          }
          word-wrap: break-word;
          padding: 5px;
          &:nth-child(1){
            width: 100px;
          }
        }
      }
    }
  }
  #detailText{
    margin-left: 18px;
  }
  #tagsText{
    width: 100px;
    float: left;
    display: block;
  }
  #tags{
    float: left;
    width: 400px;
    margin: auto;
    .tagColumn{
      width: 111px;
      float: left;
      margin-left: 16px;
      .tag{
        filter: invert(50%);
        width: 100%;
        text-align: center;
        cursor: pointer;
        color: ${() => shared.themeMainColor};
        box-shadow: ${() => shared.themeMainColor} 0px 0px 0px 1px;
        &:hover{
          box-shadow: ${() => shared.themeMainColor} 0px 0px 13px;
        }
        margin-top: 16px;
      }
      .tag.active{
        font-weight: bold;
        border: 1px solid ${() => shared.themeMainColor};
        filter: invert(0%);
      }
    }
  }
`;

class Extension extends Component{
	constructor(props) {
		super(props);
		this.state = {
			crxUrl: '',
			crxVersion: '',
			rating: '? / 5',
			extensionWeb: { tags: {}, upVotes: 0, downVotes: 0 },
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
			this.setState({ extensionWeb: data.appInfo, tags });
		}
		try {
      data = await ajax({
        url: 'https://clients2.google.com/service/update2/crx?prodversion=' + getChromeVersion() + '&x=id%3D' + id + '%26installsource%3Dondemand%26uc'
      });
      const crxUrl = data.match('codebase=\"\([^ ]*)\"')[1];
      const crxVersion = data.slice(20).match('version=\"\([^ ]*)\"')[1];
      const crxName = crxUrl.substr(crxUrl.lastIndexOf('/') + 1);
      this.setState({ crxUrl, crxVersion, crxName });
      data = await ajax({
        url: 'https://chrome.google.com/webstore/detail/'+id,
      });
      const rating = parseFloat(data.match(/g:rating_override=\"([\d.]*)\"/)[1]).toFixed(3)+' / 5';
      this.setState({ rating });
    } catch(e) {
      this.setState({ joinCommunity: false });
    }
    setTimeout(() => {
      if (!this.props.extension) {
        sendMessage({ job: 'getExtensionFromDB', id: this.props.id });
      }
    }, 233);
	}
	async toggleTag(tag) {
    let inc = 1;
    let tagged = true;
    let action = 'tag';
    const appId = this.props.extension.id;
    if(this.state.tags && this.state.tags[tag]) {
      action = 'unTag';
      tagged = false;
      inc = -1;
    }
    const reco = {
      userId: this.state.userId,
      appId,
      tag,
      action
    };
    await ajax({
      type: 'POST',
      url: 'https://ainoob.com/api/nooboss/reco/app/tag',
      contentType: 'application/json',
      data: JSON.stringify(reco)
    });
    this.setState(prevState => {
      if (!prevState.extensionWeb) {
        prevState.extensionWeb = { appId, tags: {} };
      }
      if (!prevState.extensionWeb.tags[tag]) {
        prevState.extensionWeb.tags[tag] = 1;
      }
      else {
        prevState.extensionWeb.tags[tag] += inc;
      }
      if (!prevState.tags) {
        prevState.tags = {};
      }
      prevState.tags[tag] = tagged;
      prevState.tags = copy(prevState.tags);
      prevState.extensionWeb = copy(prevState.extensionWeb);
      return prevState;
    });
  }
  getIcon() {
    let icon;
    const extension = this.props.extension;
		if (!extension) {
      console.log(1);
			return;
		}
		if (extension.icons && extension.icons.length > 0) {
      console.log(2);
      icon = extension.icons[extension.icons.length - 1].url;
      console.log(icon);
		}
		else {
      console.log(3);
			icon = this.props.icons[id + '_' + extension.version + '_icon'];
      console.log(icon);
		}
		return icon;
	}
	render() {
    const extension = this.props.extension;
		if (!extension) {
			return <ExtensionDiv display='flex'><Extensiony id="loader" color={shared.themeMainColor} /></ExtensionDiv>;
    }
    let state = extension.state || (extension.enabled ? GL('enabled') : GL('disabled'));
    if (extension && extension.uninstalledDate > extension.lastUpdateDate) {
      state = 'removed';
    }
		let switchyRGBA = undefined;
		if (!extension.enabled) {
			switchyRGBA = 'rgba(-155,-155,-155,-0.8)';
		}
    let launchy, switchy, optioney, removy, chromey, addy;
    if (state != 'removed') {
      if (extension.isApp) {
        launchy=<Launchy onClick={sendMessage.bind(null, { job: 'launchApp', id: extension.id }, ()=>{})} color={shared.themeMainColor} />;
      }
      if (extension.type != 'theme') {
        switchy = <Switchy onClick={() => {
          sendMessage({ job: 'extensionToggle', id: extension.id }, ()=>{})
        }} color={shared.themeMainColor} changeRGBA={switchyRGBA} />;
      }
      if (extension.optionsUrl && extension.optionsUrl.length > 0) {
        optioney = <Optioney onClick={sendMessage.bind(null, { job: 'extensionOptions', id: extension.id }, ()=>{})} color={shared.themeMainColor} />;
      }
      removy = <Removy onClick={sendMessage.bind(null, { job: 'extensionRemove', id: extension.id }, ()=>{})} color={shared.themeMainColor} />;
      chromey = <Chromey onClick={sendMessage.bind(null, { job: 'extensionBrowserOptions', id: extension.id }, ()=>{})} color={shared.themeMainColor} />;
    } else {
      addy = <Addy onClick={sendMessage.bind(null, { job: 'openWebStore', id: extension.id }, ()=>{})} color={shared.themeMainColor} />;
    }
    let launchType = null;
    if(extension.launchType) {
      launchType=<tr><td>{GL('launch_type')}</td><td>{extension.launchType}</td></tr>
    }
    let  permissions = null;
    const permissionList = (extension.permissions || []).map((elem,index) => {
      return <li key={index}>{elem}</li>;
    });
    permissions = <tr><td>{GL('permissions')}</td><td><ul>{permissionList}</ul></td></tr>;
    let hostPermissions = null;
    let hostPermissionList = GL('none');
    if (extension.hostPermissions && extension.hostPermissions.length > 0) {
      hostPermissionList = extension.hostPermissions.map((elem,index) => {
        return <li key={index}>{elem}</li>
      });
    }
    hostPermissions = <tr><td>{GL('host_permissions')}</td><td><ul>{hostPermissionList}</ul></td></tr>;
    const manifestUrl='chrome-extension://'+extension.id+'/manifest.json';
    const active = {};
    const tags = this.state.tags;
    Object.keys(tags).map(elem => {
      if (tags[elem]) {
        active[elem] = ' active';
      }
    })
    const extensionWeb = this.state.extensionWeb;
    let extensionTags = null;
    if (this.state.joinCommunity) {
      extensionTags = (
        <tr><td>{GL('nooboss_tags')}</td>
          <td>
            <div id="tags">
              <div className="tagColumn">
                <div onClick={this.toggleTag.bind(this, 'useful')} className={"tag " + active['useful']}>{GL('useful')}<br />{extensionWeb.tags['useful'] || 0}</div>
                <div onClick={this.toggleTag.bind(this, 'working')} className={"tag " + active['working']}>{GL('working')}<br />{extensionWeb.tags['working'] || 0}</div>
              </div>
              <div className="tagColumn">
                <div onClick={this.toggleTag.bind(this, 'laggy')} className={"tag " + active['laggy']}>{GL('laggy')}<br />{extensionWeb.tags['laggy'] || 0}</div>
                <div onClick={this.toggleTag.bind(this, 'buggy')} className={"tag " + active['buggy']}>{GL('buggy')}<br />{extensionWeb.tags['buggy'] || 0}</div>
              </div>
              <div className="tagColumn">
                <div onClick={this.toggleTag.bind(this, 'not_working')} className={"tag " + active['not_working']}>{GL('not_working')}<br />{extensionWeb.tags['not_working'] || 0}</div>
                <div onClick={this.toggleTag.bind(this, 'ASM')} className={"tag " + active['ASM']}>{GL('ASM')}<br />{extensionWeb.tags['ASM'] || 0}</div>
              </div>
            </div>
          </td>
        </tr>
      );
    }
    return (
      <ExtensionDiv>
        <div id="actions">
          <a id="icon" title={'https://chrome.google.com/webstore/detail/'+extension.id} target="_blank" href={'https://chrome.google.com/webstore/detail/'+extension.id}>
            <img src={this.getIcon()} />
          </a>
          {addy}
          {launchy}
          {switchy}
          {optioney}
          {removy}
          {chromey}
        </div>
        <a id="title" title={'https://chrome.google.com/webstore/detail/'+extension.id} target="_blank" href={'https://chrome.google.com/webstore/detail/'+extension.id}>{extension.name}</a>
        <table id="appBrief">
          <tbody>
            <tr><td>{GL('version')}</td><td>{extension.version}</td></tr>
            <tr><td>{GL('state')}</td><td>{capFirst(state)}</td></tr>
            <tr><td>{GL('official_rating')}</td><td>{this.state.rating}</td></tr>
            <tr><td>{GL('description')}</td><td>{extension.description}</td></tr>
            {extensionTags}
          </tbody>
        </table>
        <h2 id="detailText">{GL('detail')}</h2>
        <table id="appDetail">
          <tbody>
            <tr><td>{GL('last_update')}</td><td><TimeAgo datetime={extension.lastUpdateDate} locale={this.props.language} /></td></tr>
            <tr><td>{GL('first_installed')}</td><td><TimeAgo datetime={extension.installedDate} locale={this.props.language} /></td></tr>
            <tr><td>{GL('enabled')}</td><td>{capFirst(extension.enabled)}</td></tr>
            <tr><td>{GL('homepage_url')}</td><td><a title={extension.homepageUrl} target="_blank" href={extension.homepageUrl}>{extension.homepageUrl}</a></td></tr>
            <tr><td>{GL('id')}</td><td>{extension.id}</td></tr>
            <tr><td>{GL('short_name')}</td><td>{extension.shortName}</td></tr>
            <tr><td>{GL('type')}</td><td>{capFirst(extension.type)}</td></tr>
            {launchType}
            <tr><td>{GL('offline_enabled')}</td><td>{capFirst(getString(extension.offlineEnabled))}</td></tr>
            <tr><td>{GL('download_crx')}</td><td><a title={this.state.crxUrl} target="_blank" href={this.state.crxUrl}>{this.state.crxName}</a></td></tr>
            <tr><td>{capFirst('update_url')}</td><td><a title={extension.updateUrl} target="_blank" href={extension.updateUrl}>{extension.updateUrl}</a></td></tr>
            <tr><td>{capFirst('manifest_file')}</td><td><a target="_blank" onClick={sendMessage.bind(null, { job: 'openManifest', id: extension.id }, ()=>{})} href={manifestUrl} title={manifestUrl}>manifest.json</a></td></tr>
            <tr><td>{capFirst('may_disable')}</td><td>{capFirst(getString(extension.mayDisable))}</td></tr>
            <tr><td>{capFirst('install_type')}</td><td>{capFirst(extension.installType)}</td></tr>
            {hostPermissions}
            {permissions}
          </tbody>
        </table>
      </ExtensionDiv>
    );
	}
}

export default Extension;
