import React from 'react';
import Helmet from 'react-helmet';
import AppBrief from './AppBrief.jsx';
import { Link } from 'react-router';

module.exports = React.createClass({
  displayName: "Manage",
  getInitialState() {
    const type=(this.props.location.pathname.match(/\/manage\/(\w*)/)||[null,'all'])[1];
    return {
      filter:{ type, keyword: '' },
      listView: false,
      sortOrder: 'nameState'
    };
  },
  componentDidMount() {
    isOn('listView', () => {
      this.setState({ listView:true });
    });
    get('sortOrder', (sortOrder) => {this.setState({ sortOrder });});
    chrome.management.getAll((appInfoList) => {
      const originalStates={};
      for(let i = 0; i < appInfoList.length; i++) {
        appInfoList[i].iconUrl = this.getIconUrl(appInfoList[i]);
        let action = 'disable';
        if(appInfoList[i].enabled) {
          action = 'enable';
        }
        originalStates[appInfoList[i].id] = action;
      }
      this.setState({ appInfoList, originalStates });
    });
  },
  getIconUrl(appInfo) {
    let iconUrl = undefined;
    if(appInfo.icons) {
      let maxSize = 0;
      for(let j = 0; j < appInfo.icons.length; j++) {
        const iconInfo = appInfo.icons[j];
        if(iconInfo.size > maxSize) {
          maxSize = iconInfo.size;
          iconUrl = iconInfo.url;
        }
      }
    }
    if(!iconUrl) {
      const canvas = document.createElement("canvas");
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      ctx.font = "120px Arial";
      ctx.fillStyle = "grey";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      ctx.fillText(appInfo.name[0], 22, 110);
      iconUrl = canvas.toDataURL();
    }
    return iconUrl;
  },
  enableAll() {
    newCommunityRecord(true, ['_trackEvent', 'Manage', 'enableAll','']);
    const appList = this.getFilteredList();
    for(let i = 0; i < appList.length; i++) {
      if(!appList[i] || appList[i].type.match(/theme/i)) {
        continue;
      }
      this.toggleState(appList[i], 'enable');
    }
  },
  disableAll() {
    newCommunityRecord(true, ['_trackEvent', 'Manage', 'disableAll', '']);
    const appList = this.getFilteredList();
    for(let i = 0; i < appList.length; i++) {
      if(!appList[i] || appList[i].type.match(/theme/i)) {
        continue;
      }
      this.toggleState(appList[i], 'disable');
    }
  },
  undoAll() {
    newCommunityRecord(true, ['_trackEvent', 'Manage', 'undoAll', '']);
    const appList = this.getFilteredList();
    for(let i = 0; i < appList.length; i++) {
      if(appList[i]) {
        this.toggleState(appList[i], this.state.originalStates[appList[i].id]);
      }
    }
  },
  orderByNameState(a, b) {
    if(a.enabled != b.enabled) {
      if(a.enabled) {
        return -1;
      }
      else {
        return 1;
      }
    }
    else {
      return compare(a.name.toLowerCase(), b.name.toLowerCase());
    }
  },
  getFilteredList() {
    const orderFunc=this.orderByNameState;
    return (this.state.appInfoList||[]).sort(orderFunc).map((appInfo) => {
      const filter = this.state.filter;
      const pattern = new RegExp(filter.keyword, 'i');
      if((filter.type == 'all' || appInfo.type.indexOf(filter.type) != -1) && (filter.keyword == '' || pattern.exec(appInfo.name))) {
        return appInfo;
      }
      else {
        return null;
      }
    });
  },
  toggleState(info,newAction) {
    if(!info || info.id == 'aajodjghehmlpahhboidcpfjcncmcklf' || info.id == 'mgehojanhfgnndgffijeglgahakgmgkj') {
      return;
    }
    let action = 'enable';
    if(info.enabled) {
      action = 'disable';
    }
    if(newAction && newAction != action) {
      return;
    }
    chrome.management.setEnabled(info.id, !info.enabled, () => {
      let result='enabled';
      if(info.enabled) {
        result = 'disabled';
      }
      this.setState((prevState) => {
        for(let i = 0; i < prevState.appInfoList.length; i++) {
          if(info.id == prevState.appInfoList[i].id) {
            prevState.appInfoList[i].enabled = !info.enabled;
            break;
          }
        }
        return prevState;
      });
    });
  },
  uninstall(info) {
    const result='removal_success';
    if(info.id == 'aajodjghehmlpahhboidcpfjcncmcklf' || info.id == 'mgehojanhfgnndgffijeglgahakgmgkj') {
      if(!confirm(GL('ls_21'))) {
        return;
      }
    }
    chrome.management.uninstall(info.id, () => {
      if(chrome.runtime.lastError) {
        action = 'removal_fail';
        console.log(chrome.runtime.lastError);
        chrome.notifications.create({
          type: 'basic',
          iconUrl: '/images/icon_128.png',
          title: (GL('ls_22')),
          message: (GL('ls_23'))+info.name,
          imageUrl: info.icon
        });
      }
      else {
        this.setState((prevState) => {
          for(let i = 0; i < prevState.appInfoList.length; i++) {
            if(info.id==prevState.appInfoList[i].id){
              prevState.appInfoList.splice(i, 1);
              break;
            }
          }
          return prevState;
        });
      }
    });
  },
  openOptions(url) {
    chrome.tabs.create({ url });
  },
  chromeOption(id) {
    chrome.tabs.create({url:'chrome://extensions/?id='+id});
  },
  updateFilter(e) {
    const id = e.target.id;
    const value=e.target.value;
    this.setState((prevState) => {
      prevState.filter[id]=value;
      return prevState;
    });
  },
  toggleView() {
    const listView=!this.state.listView;
    if(listView){
      set('listView','1');
    }
    else{
      set('listView','-1');
    }
    this.setState({ listView });
  },
  render() {
    const appList = this.getFilteredList().map((appInfo,index) => {
      if(appInfo){
        return (
            <AppBrief key={index} uninstall={this.uninstall.bind(this,appInfo)} toggle={this.toggleState.bind(this,appInfo,null)} optionsUrl={appInfo.optionsUrl} openOptions={this.openOptions.bind(this,appInfo.optionsUrl)} chromeOption={this.chromeOption.bind(this,appInfo.id,null)} info={appInfo} />
        );
      }
    });
    const type = (this.props.location.pathname.match(/\/manage\/(\w*)/)||[null,'all'])[1];
    return (
      <div id="manage" className="section container">
        <Helmet
          title="Manage"
        />
        <h5>{capFirst(GL('manage'))}</h5>
        <div className="actionBar">
          <select defaultValue={type} onChange={this.updateFilter} id="type">
            <option value="all">{GL('all')}</option>
            <option value="app">{GL('app')}</option>
            <option value="extension">{GL('extension')}</option>
            <option value="theme">{GL('theme')}</option>
          </select>
          <input id="keyword" onChange={this.updateFilter} type="text" placeholder={GL('filter')}/>
          <span id="enableAll" className="btn" onClick={this.enableAll}>{GL('enable_all')}</span>
          <span id="disableAll" className="btn" onClick={this.disableAll}>{GL('disable_all')}</span>
          <span id="undo" className="btn" onClick={this.undoAll}>{GL('undo_all')}</span>
          <div className="changeView">
            <input type="checkbox" className="listView" checked={this.state.listView}  />
            <label className="viewGrid" onClick={this.toggleView}></label>
            <label className="viewList" onClick={this.toggleView}></label>
          </div>
        </div>
        <input type="checkbox" className="listView" checked={this.state.listView}  />
        {appList}
      </div>
    );
  }
});
