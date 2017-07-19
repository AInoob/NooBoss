import React from 'react';
import Helmet from 'react-helmet';

module.exports = React.createClass({
  getInitialState() {
    return { tags: {}, joinCommunity: false, appInfo: { enabled: true } };
  },
  componentDidMount() {
    const id = getParameterByName('id');
    const chromeVersion = getChromeVersion();
    isOn('joinCommunity', () => {
      this.setState((prevState) => {
        prevState.joinCommunity=true;
        return prevState;
      });
      get('userId', (userId) => {
        this.setState({ userId });
        $.ajax({
          type: 'POST',
          contentType: "application/json",
          data: JSON.stringify({userId:userId,appId:id}),
          url:'https://ainoob.com/api/nooboss/app'
        }).done((data) => {
          const tags={};
          for(let i = 0; i < data.tags.length; i++) {
            tags[data.tags[i].tag] = data.tags[i].tagged;
          }
          this.setState({ appInfoWeb: data.appInfo, tags });
        });
      });
    });
    $.ajax({
      dataType: 'xml',
      url: 'https://clients2.google.com/service/update2/crx?prodversion='+chromeVersion+'&x=id%3D'+id+'%26installsource%3Dondemand%26uc'
    }).done((data) => {
      const crxUrl = $(data).find('updatecheck').attr('codebase');
      const crxVersion = $(data).find('updatecheck').attr('version');
      this.setState({ crxUrl, crxVersion });
    });
    $.ajax({
      url:'https://chrome.google.com/webstore/detail/'+id
    }).done((data) => {
      this.setState({
        rating: parseFloat(data.match(/g:rating_override=\"([\d.]*)\"/)[1]).toFixed(3)+' / 5'
      });
    });
    getDB(id, (appInfo) => {
      chrome.management.get(id, (appInfo2) => {
        console.log(appInfo2);
        if(chrome.runtime.lastError) {
          appInfo.state = 'removed';
        }
        else{
          appInfo.enabled = appInfo2.enabled;
          if(appInfo2.enabled) {
            appInfo.state = 'enabled';
          }
          else{
            appInfo.state = 'disabled';
          }
        }
      });
      this.setState({ appInfo: appInfo });
      console.log(appInfo);
    });
  },
  toggleState(info) {
    info = this.state.appInfo;
    let action = 'enable';
    if(info.enabled) {
      action = 'disable';
    }
    newCommunityRecord(true, ['_trackEvent', 'manage', action]);
    chrome.management.setEnabled(info.id,!info.enabled, () => {
      let result = 'enabled';
      if(info.enabled) {
        result = 'disabled';
      }
      this.setState((prevState) => {
        prevState.appInfo.enabled = !info.enabled;
        if(prevState.appInfo.enabled) {
          prevState.appInfo.state = 'enabled';
        }
        else{
          prevState.appInfo.state = 'disabled';
        }
        return prevState;
      });
    });
  },
  toggleTag(tag) {
    let inc = 1;
    let tagged = true;
    let action = 'tag';
    const appId = this.state.appInfo.id;
    if(this.state.tags && this.state.tags[tag]) {
      action = 'unTag';
      tagged = false;
      inc = -1;
    }
    CW(() => {}, 'Community', 'addTag', action);
    const reco = {
      userId:this.state.userId,
      appId,
      tag,
      action
    };
    $.ajax({
      type: 'POST',
      url: 'https://ainoob.com/api/nooboss/reco/app/tag',
      contentType: 'application/json',
      data: JSON.stringify(reco)
    }).done((data) => {
      this.setState((prevState) => {
        if(!prevState.appInfoWeb) {
          prevState.appInfoWeb = { appId, tags:{} };
        }
        if(!prevState.appInfoWeb.tags[tag]) {
          prevState.appInfoWeb.tags[tag] = 1;
        }
        else {
          prevState.appInfoWeb.tags[tag] += inc;
        }
        if(!prevState.tags) {
          prevState.tags = {};
        }
        prevState.tags[tag] = tagged;
        return prevState;
      });
    });
  },
  uninstall(info) {
    let result = 'removal_success';
    newCommunityRecord(true, ['_trackEvent', 'manage', 'removal', info.id]);
    chrome.management.uninstall(this.state.appInfo.id, () => {
      if(chrome.runtime.lastError) {
        action = 'removal_fail';
        console.log(chrome.runtime.lastError);
        chrome.notifications.create({
          type: 'basic',
          iconUrl: '/images/icon_128.png',
          title: 'Removal calcelled',
          message: 'You have cancelled the removal of ' + info.name,
          imageUrl: info.icon
        });
      }
      else {
        this.setState((prevState) => {
          prevState.appInfo.enabled = false;
          prevState.appInfo.state = 'removed';
          return prevState;
        });
        newCommunityRecord(true, ['_trackEvent', 'result', result, info.id]);
      }
    });
  },
  launchApp() {
    chrome.management.launchApp(this.state.appInfo.id);
    window.close();
  },
  render() {
    const appInfo = this.state.appInfo;
    let launch = null;
    if(appInfo.isApp) {
      launch=<div className="app-launcher button" onClick={CW.bind(null,this.launchApp,'App','launch','')}>{GL('Launch')}</div>;
    }
    let launchType = null;
    if(appInfo.launchType) {
      launchType=<tr><td>{GL('launch_type')}</td><td>{appInfo.launchType}</td></tr>
    }
    let  permissions = null;
    const permissionList = (appInfo.permissions || []).map((elem,index) => {
      return <li key={index}>{elem}</li>;
    });
    permissions = <tr><td>{GL('permissions')}</td><td><ul>{permissionList}</ul></td></tr>;
    let hostPermissions = null;
    const hostPermissionList = (appInfo.hostPermissions || []).map((elem,index) => {
      return <li key={index}>{elem}</li>
    });
    hostPermissions = <tr><td>{GL('host_permissions')}</td><td><ul>{hostPermissionList}</ul></td></tr>;
    let options = null;
    if(appInfo.optionsUrl) {
      options = <span className="app-options" onClick={CLR.bind(null,appInfo.optionsUrl,'Manage','option','')}></span>;
    }
    let toggle = null;
    if(appInfo.type && !appInfo.type.match('theme')) {
        toggle = <label onClick={CW.bind(null,this.toggleState,'Manage','switch','')} className="app-switch"></label>;
    }
    let chromeOption = null;
    chromeOption = <label title="default Chrome manage page" onClick={CLR.bind(null,'chrome://extensions/?id='+appInfo.id,'Manage','chromeOption','')} className="app-chromeOption"></label>;
    let config = null;
    if(appInfo.state != 'removed') {
      config = (
        <div className="config">
          <input type="checkbox" className="app-status-checkbox" readOnly  checked={(appInfo.enabled)} />
          {toggle}
          {options}
          <label onClick={CW.bind(null,this.uninstall,'Manage','uninstall','')} className="app-remove"></label>
          {chromeOption}
        </div>
      );
    }
    else {
      config = (
        <div className="config">
          <a onClick={CL.bind(null,'https://chrome.google.com/webstore/detail/'+appInfo.id,'App','app-link')} title={'https://chrome.google.com/webstore/detail/'+appInfo.id}><label className='app-add'></label></a>
        </div>
      );
    }
    let crxName=null;
    if(this.state.crxVersion) {
      crxName = 'extension_' + (this.state.crxVersion.replace(/\./g,'_') + '.crx');
    }
    const manifestUrl='chrome-extension://'+appInfo.id+'/manifest.json';
    const nb_rating=<tr><td>{capFirst('NB-Rating')}</td><td>{this.state.nb_rating}</td></tr>;
    let tags=null;
    if(this.state.joinCommunity) {
      appInfoWeb = this.state.appInfoWeb || { tags: [], upVotes: 0, downVotes: 0 };
      const active = {};
      const temp = Object.keys(this.state.tags || {});
      for(let j = 0; j < temp.length; j++) {
        if(this.state.tags[temp[j]]) {
          active[temp[j]] = 'active';
        }
      }
      const tags=(
        <div className="tags">
          <div className="tagColumn">
            <div onClick={this.toggleTag.bind(this,'useful')} className={"tag wtf "+active['useful']}>{GL('useful')}<br />{appInfoWeb.tags['useful']||0}</div>
            <div onClick={this.toggleTag.bind(this,'working')} className={"tag wtf "+active['working']}>{GL('working')}<br />{appInfoWeb.tags['working']||0}</div>
          </div>
          <div className="tagColumn">
            <div onClick={this.toggleTag.bind(this,'laggy')} className={"tag soso "+active['laggy']}>{GL('laggy')}<br />{appInfoWeb.tags['laggy']||0}</div>
            <div onClick={this.toggleTag.bind(this,'buggy')} className={"tag soso "+active['buggy']}>{GL('buggy')}<br />{appInfoWeb.tags['buggy']||0}</div>
          </div>
          <div className="tagColumn">
            <div onClick={this.toggleTag.bind(this,'not_working')} className={"tag bad "+active['not_working']}>{GL('not_working')}<br />{appInfoWeb.tags['not_working']||0}</div>
            <div onClick={this.toggleTag.bind(this,'ASM')} className={"tag bad "+active['ASM']}>{GL('ASM')}<br />{appInfoWeb.tags['ASM']||0}</div>
          </div>
        </div>
      );
    }
    return (
      <div id="app">
        <Helmet
          title="App"
        />
        <div className="section container">
          <a title={'https://chrome.google.com/webstore/detail/'+appInfo.id} className="app-icon" onClick={CL.bind(null,'https://chrome.google.com/webstore/detail/'+appInfo.id,'App','app-link')}><img src={appInfo.icon} /></a>
          {config}
          {launch}
          <h4><a title={'https://chrome.google.com/webstore/detail/'+appInfo.id} onClick={CL.bind(null,'https://chrome.google.com/webstore/detail/'+appInfo.id,'App','app-link')} className="app-name">{appInfo.name}</a></h4>
          <table className="app-brief">
            <tbody>
              <tr><td>{GL('version')}</td><td>{appInfo.version}</td></tr>
              <tr><td>{GL('state')}</td><td><span className={'noTransTime '+(this.state.appInfo||{}).state}>{capFirst((this.state.appInfo||{}).state)}</span></td></tr>
              <tr><td>{GL('rating')}</td><td>{this.state.rating}</td></tr>
              <tr><td>{GL('description')}</td><td>{appInfo.description}</td></tr>
            </tbody>
          </table>
          {tags}
        </div>
        <div className="section container">
          <h5>{capFirst(GL('detail'))}</h5>
          <table className="app-detail">
            <tbody>
              <tr><td>{GL('last_update')}</td><td>{capFirst(new timeago().format(appInfo.lastUpdateDate))}</td></tr>
              <tr><td>{GL('first_installed')}</td><td>{capFirst(new timeago().format(appInfo.installedDate))}</td></tr>
              <tr><td>{GL('enabled')}</td><td>{capFirst(appInfo.enabled)}</td></tr>
              <tr><td>{GL('homepage_url')}</td><td><a title={appInfo.homepageUrl} onClick={CL.bind(null,appInfo.homepageUrl,'App','app-link')}>{appInfo.homepageUrl}</a></td></tr>
              <tr><td>{capFirst('id')}</td><td>{appInfo.id}</td></tr>
              <tr><td>{GL('short_name')}</td><td>{appInfo.shortName}</td></tr>
              <tr><td>{GL('type')}</td><td>{capFirst(appInfo.type)}</td></tr>
              {launchType}
              <tr><td>{GL('offline_enabled')}</td><td>{capFirst(getString(appInfo.offlineEnabled))}</td></tr>
              <tr><td>{GL('download_crx')}</td><td><a title={this.state.crxUrl} onClick={CL.bind(null,this.state.crxUrl,'App','app-link')}>{crxName}</a></td></tr>
              <tr><td>{capFirst('update_url')}</td><td><a title={appInfo.updateUrl} onClick={CL.bind(null,appInfo.updateUrl,'App','app-link')}>{appInfo.updateUrl}</a></td></tr>
              <tr><td>{capFirst('manifest_file')}</td><td><a onClick={CL.bind(null,manifestUrl,'App','manifest')} title={manifestUrl}>manifest.json</a></td></tr>
              <tr><td>{capFirst('may_disable')}</td><td>{capFirst(getString(appInfo.mayDisable))}</td></tr>
              <tr><td>{capFirst('install_type')}</td><td>{capFirst(appInfo.installType)}</td></tr>
              {hostPermissions}
              {permissions}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
});
