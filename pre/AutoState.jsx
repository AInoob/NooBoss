import React from 'react';
import Helmet from 'react-helmet';
import AppBrief from './AppBrief.jsx';
import { Link, borwserHistory } from 'react-router';
import styled from 'styled-components';

const AutoStateDiv = styled.div`
  #match{
    height: initial !important;
    margin-top: 0px !important;
    margin-right: 0px !important;
    #matchingRuleDiv{
      float: left;
    }
    #currentWebsite{
      margin-left: 8px;
    }
  }
`;

module.exports = React.createClass({
  displayName: "AutoState",
  getInitialState() {
    return {
      filter:{ type:'all', keyword: '' },
      rule: {
        selected: {},
        action: 'enableOnly',
        match: '',
        isWildcard: false,
      },
      rules: [],
      icons: {},
      names: {}
    };
  },
  componentDidMount() {
    chrome.management.getAll((appInfoList) => {
      const names={};
      for(let i = 0; i < appInfoList.length; i++) {
        appInfoList[i].iconUrl = this.getIconUrl(appInfoList[i]);
        let action = 'disable';
        if(appInfoList[i].enabled) {
          action = 'enable';
        }
        names[appInfoList[i].id] = appInfoList[i].name;
      }
      this.setState({ appInfoList, names });
    });
    get('autoStateRules', (rules) => {
      this.setState({ rules: JSON.parse(rules) });
    });
    isOn('autoState', () => {
      chrome.permissions.contains({
        permissions: ['tabs']
      }, (result) => {
        if(!result){
          set('autoState',false,function(){
            swal(GL('ls_20'));
          });
        }
      });
    }, () => {
      swal(GL('ls_20'));
    })
  },
  getIconUrl(appInfo) {
    let iconUrl = undefined;
    if(appInfo.icons) {
      let maxSize = 0;
      for(let j = 0; j < appInfo.icons.length; j++) {
        let iconInfo = appInfo.icons[j];
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
    });
    return iconUrl;
  },
  getFilteredList() {
    return (this.state.appInfoList||[]).sort((a,b) => {
      if(a.enabled!=b.enabled){
        if(a.enabled){
          return -1;
        }
        else{
          return 1;
        }
      }
      else{
        return compare(a.name.toLowerCase(),b.name.toLowerCase());
      }
    }).map((appInfo) => {
      const filter=this.state.filter;
      const pattern=new RegExp(filter.keyword,'i');
      if((filter.type == 'all' || appInfo.type.indexOf(filter.type) != -1) && (filter.keyword == '' || pattern.exec(appInfo.name))) {
        return appInfo;
      }
      else {
        return null;
      }
    });
  },
  updateFilter(e) {
    const id = e.target.id;
    const value = e.target.value;
    this.setState((prevState) => {
      prevState.filter[id] = value;
      return prevState;
    });
  },
  select(id) {
    this.setState((prevState) => {
      prevState.rule.selected[id] = !prevState.rule.selected[id];
      return prevState;
    });
  },
  updateRule(e) {
    const id = e.target.id;
    const value = e.target.value;
    this.setState((prevState) => {
      prevState.rule[id] = value;
      return prevState;
    });
  },
  updateRuleIsWildcard(isWildcard) {
    this.setState((prevState) => {
      prevState.rule.isWildcard = isWildcard;
      return prevState;
    });
  },
  addRule() {
    const ids = [];
    const keys = Object.keys(this.state.rule.selected);
    if(keys.length == 0) {
      swal(GL('ls_32'));
      return;
    }
    else if(this.state.rule.match.length == 0) {
      swal(GL('ls_33'));
      return;
    }
    for(let i = 0; i < keys.length; i++) {
      const id = keys[i];
      if(this.state.rule.selected[id]) {
        ids.push(id);
      }
    }
    this.setState((prevState) => {
      if(!prevState.rules) {
        prevState.rules = [];
      }
      prevState.rules.push({
        ids: ids,
        action: prevState.rule.action,
        match: {
          url: prevState.rule.match,
          isWildcard: prevState.rule.isWildcard,
        }
      });
      prevState.rule.isWildcard = false;
      prevState.rule.selected = {};
      prevState.rule.action = 'enableOnly';
      prevState.rule.match = '';
      return prevState;
    }, () => {
      set('autoStateRules', JSON.stringify(this.state.rules),() => {
        chrome.runtime.sendMessage({job:'updateAutoStateRules'});
      });
    });
  },
  deleteRule(index) {
    swal({
      title: "Are you sure?",
      text: 'Do you want to remove rule #'+(index+1)+'?',
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, delete it!",
      closeOnConfirm: true
    },
    () => {
      this.setState((prevState) => {
        prevState.rules.splice(index,1);
        return prevState;
      }, () => {
        set('autoStateRules', JSON.stringify(this.state.rules), () => {
          chrome.runtime.sendMessage({job:'updateAutoStateRules'});
        });
      });
    });
  },
  editRule(index) {
    this.setState((prevState) => {
      const rule = prevState.rules.splice(index, 1)[0];
      prevState.rule.selected = {};
      for(let i = 0; i < rule.ids.length; i++) {
        prevState.rule.selected[rule.ids[i]] = true;
      }
      prevState.rule.action = rule.action;
      prevState.rule.match = rule.match.url;
      prevState.rule.isWildcard = rule.match.isWildcard;
    }, () => {
      set('autoStateRules',JSON.stringify(this.state.rules), () => {
        chrome.runtime.sendMessage({ job:'updateAutoStateRules' });
      });
    });
  },
  setCurrentWebsite() {
    chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, (tabs) => {
      let url = "";
      if(tabs[0]) {
        url = tabs[0].url;
      }
      this.setState((prevState) => {
        prevState.rule.isWildcard = false;
        prevState.rule.match=getA(url).origin;
        return prevState;
      });
    });
  },
  render() {
    const appList = this.getFilteredList().map((appInfo,index) => {
      if(appInfo) {
        let dimmer = 'dimmer';
        if(this.state.rule.selected[appInfo.id]) {
          dimmer = 'nonDimmer';
        }
        return (
            <AppBrief isMini={true} select={this.select.bind(this,appInfo.id)} dimmer={dimmer} key={index} info={appInfo} />
        );
      }
    });
    let preRuleList=[{ ids: [], action: "Hello", match: { url: GL('ls_3') } }];
    if(this.state.rules && this.state.rules.length > 0) {
      preRuleList = this.state.rules;
    }
    const ruleList = (preRuleList).map((rule, index) => {
      const icons=rule.ids.map((id,index) => {
        return <img key={index} title={this.state.names[id]} src={this.state.icons[id]}/>
      });
      return (
        <tr className="rule" key={index}>
          <td>{index+1}</td>
          <td>{icons}</td>
          <td>{GL(rule.action)}</td>
          <td>{rule.match.url}</td>
          <td onClick={CW.bind(null,this.editRule.bind(this,index),'AutoState','editRule','')}>{GL('edit')}</td>
          <td onClick={CW.bind(null,this.deleteRule.bind(this,index),'AutoState','deleteRule')}>{GL('delete')}</td>
        </tr>
      );
    });
    const selectedIcons = (Object.keys(this.state.rule.selected) || []).map((id, index) => {
      if(this.state.rule.selected[id])
        return <img key={index} title={this.state.names[id]} src={this.state.icons[id]}/>
    });
    return (
      <AutoStateDiv id="autoState">
        <Helmet
          title="Manage"
        />
        <div className="rules section container">
          <h5>{GL('rules')}</h5>
          <table className="autoState-table">
            <thead>
              <tr>
                <th>#</th>
                <th>{capFirst(GL('extension_s'))}</th>
                <th>{capFirst(GL('action'))}</th>
                <th>{capFirst(GL('match'))}</th>
              </tr>
            </thead>
            <tbody>
              {ruleList}
            </tbody>
          </table>
        </div>
        <div className="newRule section container">
          <h5>{GL('new_rule')}</h5>
          <div className="selectedApps">
            <div className="header">{capFirst(GL('app_s'))}:</div> <div className="selected">
            {selectedIcons}
            </div>
          </div>
          <div className="selectedAction">
            <div className="header">{capFirst(GL('action'))}:</div>
            <select value={this.state.rule.action} onChange={this.updateRule} id="action">
              <option value="enableOnly">{GL('only_enable_when_matched')}</option>
              <option value="disableOnly">{GL('only_disable_when_matched')}</option>
              <option value="enableWhen">{GL('enable_when_matched')}</option>
              <option value="disableWhen">{GL('disable_when_matched')}</option>
            </select>
          </div>
          <div id="match" className="match">
            <div className="header">
              {capFirst(GL('url'))}:
            </div>
            <input id="match" value={this.state.rule.match} onChange={this.updateRule} placeholder={GL('matching_pattern')} type="text" />
            <div id="matchingRuleDiv">
              <div>
                <input type="radio" id="matchingRule_1" name="matchingRule" checked={!this.state.rule.isWildcard} />
                <label onClick={this.updateRuleIsWildcard.bind(this, false)} htmlFor="matchingRule_1">{GL('regular_expression')}</label>
              </div>
              <div>
                <input type="radio" id="matchingRule_2" name="matchingRule" checked={this.state.rule.isWildcard} />
                <label onClick={this.updateRuleIsWildcard.bind(this, true)} htmlFor="matchingRule_2">{GL('wildcard')}</label>
              </div>
            </div>
            <div id="currentWebsite" className="btn" onClick={this.setCurrentWebsite}>{GL('currentWebsite')}
            </div>
          </div>
          <div className="addRule btn" onClick={CW.bind(null,this.addRule,'AutoState','addRule','')}>{GL('add_rule')}</div>
          <div className="actionBar autoState">
            <div className="type">
              <select onChange={this.updateFilter} id="type">
                <option value="all">{GL('all')}</option>
                <option value="app">{GL('app')}</option>
                <option value="extension">{GL('extension')}</option>
                <option value="theme">{GL('theme')}</option>
              </select>
            </div>
            <input id="keyword" onChange={this.updateFilter} type="text" placeholder={GL('filter')} />
          </div>
          {appList}
        </div>
      </AutoStateDiv>
    );
  }
});
