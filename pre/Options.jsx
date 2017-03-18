var React = require('react');
var Helmet = require('react-helmet');
module.exports = React.createClass({
  displayName: 'Options',
  getInitialState: function(){
    return {settings:{notificationDuration_autoState:6,notificationDuration_installation:6,notificationDuration_removal:6,notificationDuration_stateChange:6,recoExtensions:false,notifyStateChange:false,notifyInstallation:false,notifyRemoval:false,autoState:false,autoStateNotification:false,defaultPage:'overview'}};
  },
  componentDidMount: function(){
    chrome.permissions.contains({
      permissions: ['tabs']
    },function(result){
      if(!result){
        set('autoState',false,function(){
        });
      }
    });
    get('defaultPage',function(url){
      this.setState(function(prevState){
        this.state.settings.defaultPage=url;
        return prevState;
      });
    }.bind(this));
    var switchList=['recoExtensions','notifyStateChange','notifyInstallation','notifyRemoval','autoState','autoStateNotification'];
    for(var i=0;i<switchList.length;i++){
      isOn(
        switchList[i],
        function(ii){
          this.setState(function(prevState){
            prevState.settings[switchList[ii]]=true;
            return prevState;
          });
        }.bind(this,i),
        function(ii){
          this.setState(function(prevState){
            prevState.settings[switchList[ii]]=false;
            return prevState;
          });
        }.bind(this,i)
      );
    }
    var keyList=['notificationDuration_installation','notificationDuration_autoState','notificationDuration_removal','notificationDuration_stateChange'];
    for(var i=0;i<keyList.length;i++){
      get(
        keyList[i],
        function(ii,value){
          this.setState(function(prevState){
            prevState.settings[keyList[ii]]=value;
            console.log(keyList[ii]+' '+value);
            return prevState;
          });
        }.bind(this,i)
      );
    }
  },
  reset: function(){
    swal({
        title: GL('are_you_sure'),
        text: GL('ls_4'),
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: GL('ls_29'),
        cancelButtonText: GL('cancel'),
        closeOnConfirm: true
    },
    function(){
      chrome.runtime.sendMessage({job:'reset'});
      chrome.notifications.create({
        type:'basic',
        iconUrl: '/images/icon_128.png',
        title: ' ',
        message: GL('ls_31'),
      });
    });
  },
  importOptions: function(e){
    var f=e.target.files[0];
    var r=new FileReader();
    var error=function(){
      chrome.notifications.create({
        type:'basic',
        iconUrl: '/images/icon_128.png',
        title: GL('options'),
        message: GL('ls_24'),
      });
    }
    var success=function(){
      chrome.notifications.create({
        type:'basic',
        iconUrl: '/images/icon_128.png',
        title: GL('options'),
        message: GL('ls_25'),
      });
      window.location.href = "/popup.html?page=options";
    }
    r.onload=function(e) {
      var options=null;
      if(!e.target.result.match(/^NooBoss-Options/)){
        error();
        return;
      }
      try{
        options=JSON.parse(e.target.result.substr(16));
      }
      catch(e){
        console.log(e);
        error();
        return;
      }
      if(!options){
        error();
        return;
      }
      chrome.storage.sync.set(options);
      success();
    }
    r.readAsText(f);
  },
  exportOptions: function(){
    chrome.storage.sync.get(function(data){
      dataURI='data:text;charset=utf-8,NooBoss-Options:'+JSON.stringify(data);
      var a = document.createElement('a');
      a.href = dataURI;
      a.download = 'NooBoss.options';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
    });
  },
  clearHistory: function(){
    swal({
        title: GL('are_you_sure'),
        text: GL('ls_5'),
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: GL('ls_29'),
        cancelButtonText: GL('cancel'),
        closeOnConfirm: true
    },
    function(){
      setDB('history_records',null,function(){
        chrome.runtime.sendMessage({job:'clearHistory'});
        chrome.notifications.create({
          type:'basic',
          iconUrl: '/images/icon_128.png',
          title: GL('history_cleared'),
          message: GL('ls_6'),
        });
        getDB('history_records',function(recordList){
          this.setState({recordList:recordList});
        }.bind(this));
      }.bind(this));
    });
  },
  toggleSetting: function(id){
    var newValue=!this.state.settings[id];
    console.log(this.state.settings[id]);
    console.log(newValue);
    set(id,newValue,function(){
      this.setState(function(prevState){
        prevState.settings[id]=newValue;
        return prevState;
      });
    }.bind(this));
  },
  getSwitch: function(id,handler){
    return <div className="switch">
      <input type="checkbox" onChange={CW.bind(null,(handler||this.toggleSetting.bind(this,id)),'Options','option-switch',id)} checked={this.state.settings[id]} id={id} />
      <label htmlFor={id} className="checkbox"></label><span>{GL(id)}</span>
    </div>;
  },
  autoState: function(){
    var change=function(value){
      if(value){
        newCommunityRecord(true,['_trackEvent', 'AutoState', 'on']);
        chrome.runtime.sendMessage({job:'autoState'});
        chrome.notifications.create('autoStateSwitch',{
          type:'basic',
          iconUrl: '/images/icon_128.png',
          title: GL('ls_7'),
          message: GL('ls_8')
        });
      }
      else{
        newCommunityRecord(true,['_trackEvent', 'AutoState', 'off']);
        chrome.notifications.create('autoStateSwitch',{
          type:'basic',
          iconUrl: '/images/icon_128.png',
          title: GL('ls_9'),
          message: GL('ls_10')
        });
      }
      set('autoState',value,function(){
        this.setState(function(prevState){
          prevState.settings.autoState=value;
          return prevState;
        });
      }.bind(this))
    }.bind(this);
    if(!this.state.settings.autoState){
      change(true);
      chrome.permissions.contains({
        permissions: ['tabs']
      },function(result){
        if(!result){
          chrome.notifications.create({
            type:'basic',
            iconUrl: '/images/icon_128.png',
            title: GL('ls_11'),
            message: GL('ls_12')
          });
          chrome.permissions.request({
            permissions: ['tabs']
          },function(granted){
            if(granted){
              change(true);
            }
            else{
              change(false);
            }
          });
        }
      });
    }
    else{
      change(false);
    }
  },
  updateDefaultPage: function(e){
    var url=e.target.value;
    this.setState(function(prevState){
      prevState.settings.defaultPage=url;
      return prevState;
    });
    newCommunityRecord(true,['_trackEvent', 'Options', 'defaultPage', url]);
    set('defaultPage',url);
  },
  setNotification: function(e){
    var key=e.target.id;
    var value=e.target.value;
    if(!isNaN(value)){
      set(key,value,function(){
      }.bind(this));
    }
    this.setState(function(prevState){
      prevState.settings[key]=value;
      return prevState;
    });
  },
  render: function(){
    return(
      <div id="options">
        <Helmet
          title="Options"
        />
        <div className="section container">
          <h5>{capFirst(GL('clear'))}</h5>
          <div className="btn space" onClick={CW.bind(null,this.clearHistory,'Options','clearHistory','')}>{GL('clear_history')}</div><br />
          <div className="btn space" onClick={CW.bind(null,this.reset,'Options','reset','')}>{GL('reset_everything')}</div>
        </div>
        <div className="section container">
          <h5>{GL('notification')}</h5>
          <span className="switchWithFollow"></span>{this.getSwitch('notifyStateChange')}<input type="checkbox" className="follow" checked={this.state.settings['notifyStateChange']} /><div className="followInput"><span>{GL('for')}</span><input id='notificationDuration_stateChange' value={this.state.settings.notificationDuration_stateChange} onChange={this.setNotification} /><span>{GL('s')}</span></div>
          <span className="switchWithFollow"></span>{this.getSwitch('notifyInstallation')}<input type="checkbox" className="follow" checked={this.state.settings['notifyInstallation']} /><div className="followInput"><span>{GL('for')}</span><input id='notificationDuration_installation' value={this.state.settings.notificationDuration_installation} onChange={this.setNotification} /><span>{GL('s')}</span></div>
          <span className="switchWithFollow"></span>{this.getSwitch('notifyRemoval')}<input type="checkbox" className="follow" checked={this.state.settings['notifyRemoval']} /><div className="followInput"><span>{GL('for')}</span><input id='notificationDuration_removal' value={this.state.settings.notificationDuration_removal} onChange={this.setNotification} /><span>{GL('s')}</span></div>
          <span className="switchWithFollow"></span>{this.getSwitch('autoStateNotification')}<input type="checkbox" className="follow" checked={this.state.settings['autoStateNotification']} /><div className="followInput"><span>{GL('for')}</span><input id='notificationDuration_autoState' value={this.state.settings.notificationDuration_autoState} onChange={this.setNotification} /><span>{GL('s')}</span></div>
        </div>
        <div className="section container">
          <h5>{GL('functions')}</h5>
          {this.getSwitch('autoState',this.autoState)}
          {this.getSwitch('recoExtensions')}
        </div>
        <div className="section container">
          <h5>{GL('experience')}</h5>
          <span className="defaultPage">{GL('default_page')}</span>
          <select value={this.state.settings.defaultPage} onChange={this.updateDefaultPage} id="type">
            <option value="overview">{GL('overview')}</option>
            <option value="manage">{GL('manage')}</option>
            <option value="autoState">{GL('autoState')}</option>
            <option value="history">{GL('history')}</option>
          </select>
          <br />
          <br />
          <input id="upload" className="hide" type="file" onChange={CW.bind(null,this.importOptions,'Options','importOptions','')}/>
          <label htmlFor="upload" className="btn space">{GL('import_settings')}</label><br />
          <div className="btn space" onClick={CW.bind(null,this.exportOptions,'Options','exportOptions','')}>{GL('export_settings')}</div><br />
        </div>
      </div>
    );
  }
});
