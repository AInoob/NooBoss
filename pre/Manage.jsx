import React from 'react';
import Helmet from 'react-helmet';
import AppBrief from './AppBrief.jsx';
import GroupBrief from './GroupBrief.jsx';
import { Link } from 'react-router';
import styled from 'styled-components';

const ManageDiv = styled.div`
  #header{
  }
  #changeView{
    position: absolute;
    right: 30px;
    top: 50px;
  }
  #actionBar{
    width: 100%;
  }
  #groupList{
    #changeIcon{
      display: none;
    }
    .app-holder{
      .app-brief{
        margin-left: 10%;
      }
    }
    #detail{
      #selected{
        img{
          height: 23px;
        }
      }
    }
  }
`;

module.exports = React.createClass({
  displayName: "Manage",
  getInitialState() {
    const type=(this.props.location.pathname.match(/\/manage\/(\w*)/)||[null,'all'])[1];
    return {
      filter:{ type, keyword: '' },
      listView: false,
      sortOrder: 'nameState',
      groupList: [],
      selectedGroup: -1,
      groupIconIndex: -1,
      icons: {},
      names: {},
      groupIcons: {},
    };
  },
  componentWillMount() {
    getDB('groupIcons', (groupIcons) => {
      this.setState({ groupIcons: groupIcons || {} });
    });
  },
  componentDidMount() {
    isOn('listView', () => {
      this.setState({ listView:true });
    });
    get('groupList', (groupList) => {
      this.setState({ groupList });
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
    this.setState((prevState) => {
      prevState.icons[appInfo.id] = iconUrl;
      prevState.names[appInfo.id] = appInfo.name;
    });
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
  toggleState(info, newAction) {
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
  saveGroupIcons() {
    console.log(this.state.groupIcons);
    setDB('groupIcons', this.state.groupIcons);
  },
  saveGroupList() {
    set('groupList', this.state.groupList, () => {
      chrome.runtime.sendMessage({job:'updateGroupList'});
    });
  },
  newGroup() {
    this.setState((prevState) => {
      prevState.groupList.push({
        name: '',
        appList: [],
        id: 'NooBoss-Group-'+(Math.random().toString(36)+'00000000000000000').slice(2, 19),
      });
      prevState.selectedGroup = prevState.groupList.length - 1;
      return prevState;
    }, this.saveGroupList.bind(this));
  },
  changeGroupName(index, e) {
    const newVal = e.target.value;
    this.setState((prevState) => {
      prevState.groupList[index].name = newVal;
      return prevState;
    }, this.saveGroupList.bind(this));
  },
  duplicateGroup(index) {
    this.setState((prevState) => {
      prevState.groupList.push(prevState.groupList[index]);
      prevState.groupList[prevState.groupList.length - 1].id = 'NooBoss-Group-'+(Math.random().toString(36)+'00000000000000000').slice(2, 19);
      return prevState;
    }, this.saveGroupList.bind(this));
  },
  showGroup(index) {
    this.setState((prevState) => {
      if(prevState.selectedGroup == index) {
        prevState.selectedGroup = -1;
      }
      else {
        prevState.selectedGroup = index;
      }
      return prevState;
    }, this.saveGroupList.bind(this));
  },
  removeGroup(index) {
    swal({
      title: "Are you sure?",
      text: 'Do you want to remove group '+this.state.groupList[index].name+'?',
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, delete it!",
      closeOnConfirm: true
    },
    () => {
      this.setState((prevState) => {
        prevState.groupList.splice(index, 1);
        return prevState;
      }, this.saveGroupList.bind(this));
    });
  },
  selectGroupApp(id) {
    this.setState((prevState) => {
      const group = prevState.groupList[prevState.selectedGroup];
      const index = group.appList.indexOf(id);
      if(index >= 0) {
        group.appList.splice(index, 1);
        console.log('1');
      }
      else {
        group.appList.push(id);
        console.log('2');
      }
      return prevState;
    }, this.saveGroupList.bind(this));
  },
  getAppIcons(index) {
    if(index != this.state.selectedGroup) {
      return null;
    }
    const group = this.state.groupList[this.state.selectedGroup];
    const selectedIcons = (group.appList || []).map((id, index) => {
      return <img key={index} title={this.state.names[id]} src={this.state.icons[id]}/>
    });
    return selectedIcons;
  },
  getAppList(index) {
    if(index != this.state.selectedGroup) {
      return null;
    }
    const includedAppList = this.state.groupList[this.state.selectedGroup].appList;
    const appList = this.getFilteredList().map((appInfo, index2) => {
      if(appInfo){
        let dimmer = 'dimmer';
        if(includedAppList.indexOf(appInfo.id) != -1) {
          dimmer = 'nonDimmer';
        }
        return (
            <AppBrief isMini={true} select={this.selectGroupApp.bind(this,appInfo.id)} dimmer={dimmer} key={index2} info={appInfo} />
        );
      }
    });
    return appList;
  },
  groupToggleAll(index, action) {
    const selected = this.state.groupList[index].appList;
    let appList = this.getFilteredList().filter((appInfo) => {
      return selected.indexOf(appInfo.id) >= 0;
    });
    for(let i = 0; i < appList.length; i ++) {
      this.toggleState(appList[i], action);
    }
  },
  getGroupIcon(id) {
    return this.state.groupIcons[id];
  },
  setGroupIcon(id, dataUrl) {
    this.setState((prevState) => {
      prevState.groupIcons[id] = dataUrl;
      return prevState;
    }, this.saveGroupIcons.bind(this));
  },
  groupChangeIcon(e) {
    const file = (e.target.files || e.dataTransfer.files)[0];
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      this.setGroupIcon(this.state.groupList[this.state.groupIconIndex].id, reader.result);
    }, false);
    if (file) {
      reader.readAsDataURL(file);
    }
  },
  changeGroupIconIndex(index) {
    this.setState({ groupIconIndex: index });
  },
  render() {
    const appList = this.getFilteredList().map((appInfo, index) => {
      if(appInfo){
        return (
            <AppBrief key={index} uninstall={this.uninstall.bind(this,appInfo)} toggle={this.toggleState.bind(this,appInfo,null)} optionsUrl={appInfo.optionsUrl} openOptions={this.openOptions.bind(this,appInfo.optionsUrl)} chromeOption={this.chromeOption.bind(this,appInfo.id,null)} info={appInfo} />
        );
      }
    });
    const groupList = this.state.groupList.map((groupInfo, index) => {
      return <GroupBrief onMore={index==this.state.selectedGroup} isLast={index+1==this.state.groupList.length} index={index} key={index} groupInfo={groupInfo} changeName={this.changeGroupName} duplicate={this.duplicateGroup} remove={this.removeGroup} showMore={this.showGroup} appList={this.getAppList(index)} appIcons={this.getAppIcons(index)} toggle={this.groupToggleAll} changeGroupIconIndex={this.changeGroupIconIndex} getIcon={this.getGroupIcon.bind(this, groupInfo.id)} />;
    });
    const type = (this.props.location.pathname.match(/\/manage\/(\w*)/)||[null,'all'])[1];
    return (
      <ManageDiv>
        <div id="manage" className="section container">
          <Helmet
            title="Manage"
          />
          <h5 id="header">{capFirst(GL('manage'))}</h5>
          <div id="changeView" className="changeView">
            <input type="checkbox" className="listView" checked={this.state.listView}  />
            <label className="viewGrid" onClick={this.toggleView}></label>
            <label className="viewList" onClick={this.toggleView}></label>
          </div>
          <div id="groupList">
            <input type="file" id="changeIcon" accept="image/*" onChange={this.groupChangeIcon} />
            {groupList}
          </div>
          <div id="actionBar" className="actionBar">
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
            <span id="newGroup" className="btn" onClick={this.newGroup}>{GL('new_group')}</span>
          </div>
          <input type="checkbox" className="listView" checked={this.state.listView}  />
          {appList}
        </div>
      </ManageDiv>
    );
  }
});
