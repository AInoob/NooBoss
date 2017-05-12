var React = require('react');
var Helmet = require('react-helmet');
var AppBrief = require('./AppBrief.jsx');
var Link = require('react-router').Link;
var browserHistory = require('react-router').browserHistory;
module.exports = React.createClass({
  displayName: "AutoState",
  getInitialState: function(){
    return {
      filter:{type:'all',keyword: ''},
      rule:{
        selected:{},
        action: 'enableOnly',
        match: ''
      },
      rules: [],
      icons: {},
      names: {}
    };
  },
  componentDidMount: function(){
    chrome.management.getAll(function(appInfoList){
      var names={};
      for(var i=0;i<appInfoList.length;i++){
        appInfoList[i].iconUrl=this.getIconUrl(appInfoList[i]);
        var action='disable';
        if(appInfoList[i].enabled){
          action='enable';
        }
        names[appInfoList[i].id]=appInfoList[i].name;
      }
      this.setState({appInfoList:appInfoList,names:names});
    }.bind(this));
    get('autoStateRules',function(rules){
      this.setState({rules:JSON.parse(rules)});
    }.bind(this));
    isOn('autoState',function(){
      chrome.permissions.contains({
        permissions: ['tabs']
      },function(result){
        if(!result){
          set('autoState',false,function(){
            swal(GL('ls_20'));
          });
        }
      });
    },function(){
      swal(GL('ls_20'));
    })
  },
  getIconUrl: function(appInfo){
    var iconUrl=undefined;
    if(appInfo.icons){
      var maxSize=0;
      for(var j=0;j<appInfo.icons.length;j++){
        var iconInfo=appInfo.icons[j];
        if(iconInfo.size>maxSize){
          maxSize=iconInfo.size;
          iconUrl=iconInfo.url;
        }
      }
    }
    if(!iconUrl){
      var canvas=document.createElement("canvas");
      canvas.width=128;
      canvas.height=128;
      var ctx=canvas.getContext('2d');
      ctx.font="120px Arial";
      ctx.fillStyle="grey";
      ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle="white";
      ctx.fillText(appInfo.name[0],22,110);
      iconUrl=canvas.toDataURL();
    }
    this.setState(function(prevState){
      prevState.icons[appInfo.id]=iconUrl;
    });
    return iconUrl;
  },
  getFilteredList: function(){
    return (this.state.appInfoList||[]).sort(function(a,b){
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
    }).map(function(appInfo){
      var filter=this.state.filter;
      var pattern=new RegExp(filter.keyword,'i');
      if((filter.type=='all'||appInfo.type.indexOf(filter.type)!=-1)&&(filter.keyword==''||pattern.exec(appInfo.name))){
        return appInfo;
      }
      else{
        return null;
      }
    }.bind(this));
  },
  updateFilter: function(e){
    var id=e.target.id;
    var value=e.target.value;
    this.setState(function(prevState){
      prevState.filter[id]=value;
      return prevState;
    });
  },
  select: function(id){
    this.setState(function(prevState){
      prevState.rule.selected[id]=!prevState.rule.selected[id];
      return prevState;
    });
  },
  updateRule: function(e){
    var id=e.target.id;
    var value=e.target.value;
    this.setState(function(prevState){
      prevState.rule[id]=value;
      return prevState;
    });
  },
  addRule: function(){
    var ids=[];
    var keys=Object.keys(this.state.rule.selected);
    if(keys.length==0){
      swal(GL('ls_32'));
      return;
    }
    else if(this.state.rule.match.length==0){
      swal(GL('ls_33'));
      return;
    }
    for(var i=0;i<keys.length;i++){
      var id=keys[i];
      if(this.state.rule.selected[id]){
        ids.push(id);
      }
    }
    this.setState(function(prevState){
      if(!prevState.rules){
        prevState.rules=[];
      }
      prevState.rules.push({
        ids: ids,
        action: prevState.rule.action,
        match: {
          url: prevState.rule.match
        }
      });
      prevState.rule.selected={};
      prevState.rule.action='enableOnly';
      prevState.rule.match='';
      return prevState;
    },function(){
      set('autoStateRules',JSON.stringify(this.state.rules),function(){
        chrome.runtime.sendMessage({job:'updateAutoStateRules'});
      });
    });
  },
  deleteRule: function(index){
    var decision=confirm('Do you want to remove rule #'+(index+1)+'?');
    if(decision){
      this.setState(function(prevState){
        prevState.rules.splice(index,1);
      },function(){
        set('autoStateRules',JSON.stringify(this.state.rules),function(){
          chrome.runtime.sendMessage({job:'updateAutoStateRules'});
        });
      });
    }
  },
  editRule: function(index){
    this.setState(function(prevState){
      var rule=prevState.rules.splice(index,1)[0];
      prevState.rule.selected={};
      for(var i=0;i<rule.ids.length;i++){
        prevState.rule.selected[rule.ids[i]]=true;
      }
      prevState.rule.action=rule.action;
      prevState.rule.match=rule.match.url;
    },function(){
      set('autoStateRules',JSON.stringify(this.state.rules),function(){
        chrome.runtime.sendMessage({job:'updateAutoStateRules'});
      });
    });
  },
  setCurrentWebsite: function(){
    var rule=this.state.rule;
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
      var url="";
      if(tabs[0])
      url = tabs[0].url;
      this.setState(function(prevState){
        prevState.rule.match=getA(url).origin;
        return prevState;
      });
    }.bind(this));
  },
  render: function(){
    var appList=this.getFilteredList().map(function(appInfo,index){
      if(appInfo){
        var dimmer='dimmer';
        if(this.state.rule.selected[appInfo.id]){
          dimmer='nonDimmer';
        }
        return (
            <AppBrief isAutoState="true" select={this.select.bind(this,appInfo.id)} dimmer={dimmer} key={index} info={appInfo} />
        );
      }
    }.bind(this));
    var preRuleList=[{ids:[],action:"Hello",match:{url:GL('ls_3')}}];
    if(this.state.rules&&this.state.rules.length>0){
      preRuleList=this.state.rules;
    }
    var ruleList=(preRuleList).map(function(rule,index){
      var icons=rule.ids.map(function(id,index){
        return <img key={index} title={this.state.names[id]} src={this.state.icons[id]}/>
      }.bind(this));
      return(
        <tr className="rule" key={index}>
          <td>{index+1}</td>
          <td>{icons}</td>
          <td>{GL(rule.action)}</td>
          <td>{rule.match.url}</td>
          <td onClick={CW.bind(null,this.editRule.bind(this,index),'AutoState','editRule','')}>{GL('edit')}</td>
          <td onClick={CW.bind(null,this.deleteRule.bind(this,index),'AutoState','deleteRule')}>{GL('delete')}</td>
        </tr>
      );
    }.bind(this));
    var selectedIcons=(Object.keys(this.state.rule.selected)||[]).map(function(id,index){
      if(this.state.rule.selected[id])
        return <img key={index} title={this.state.names[id]} src={this.state.icons[id]}/>
    }.bind(this));
    return(
      <div id="autoState">
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
            <div className="header">{capFirst(GL('action'))}:</div><select value={this.state.rule.action} onChange={this.updateRule} id="action">
              <option value="enableOnly">{GL('only_enable_when_matched')}</option>
              <option value="disableOnly">{GL('only_disable_when_matched')}</option>
              <option value="enableWhen">{GL('enable_when_matched')}</option>
              <option value="disableWhen">{GL('disable_when_matched')}</option>
            </select>
          </div>
          <div className="match">
            <div className="header">{capFirst(GL('url'))}:</div><input id="match" value={this.state.rule.match} onChange={this.updateRule} placeholder="RegExp matching" type="text" /><div className="btn" onClick={this.setCurrentWebsite}>{GL('currentWebsite')}</div>
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
      </div>
    );
  }
});
