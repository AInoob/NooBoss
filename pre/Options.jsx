var React = require('react');
var Helmet = require('react-helmet');
module.exports = React.createClass({
  displayName: 'Options',
  getInitialState: function(){
    return {setting:{joinCommunity:false,showAds:false,notifyStateChange:false,notifyInstallation:false,notifyRemoval:false,autoState:false,autoStateNotification:false,defaultPage:'overview'}};
  },
  componentDidMount: function(){
    get('defaultPage',function(url){
      this.setState(function(prevState){
        this.state.setting.defaultPage=url;
        return prevState;
      });
    }.bind(this));
    var switchList=['joinCommunity','recoExtensions','showAds','notifyStateChange','notifyInstallation','notifyRemoval','autoState','autoStateNotification'];
    for(var i=0;i<switchList.length;i++){
      isOn(
        switchList[i],
        function(ii){
          this.setState(function(prevState){
            prevState.setting[switchList[ii]]=true;
            return prevState;
          });
        }.bind(this,i),
        function(ii){
          this.setState(function(prevState){
            prevState.setting[switchList[ii]]=false;
            return prevState;
          });
        }.bind(this,i)
      );
    }
  },
  reset: function(){
    var result=confirm(GL('ls_4'));
    if(result){
      chrome.runtime.sendMessage({job:'reset'});
    }
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
  cleanHistory: function(){
    var result=confirm(GL('ls_5'));
    if(result){
      setDB('history_records',null,function(){
        chrome.notifications.create({
          type:'basic',
          iconUrl: '/images/icon_128.png',
          title: GL('history_cleaned'),
          message: GL('ls_6'),
        });
      });
    }
  },
  toggleSetting: function(id){
    var newValue=!this.state.setting[id];
    set(id,newValue,function(){
      this.setState(function(prevState){
        prevState.setting[id]=newValue;
        return prevState;
      });
    }.bind(this));
  },
  getSwitch: function(id,handler){
    return <div className="switch">
      <input type="checkbox" onChange={CW.bind(null,(handler||this.toggleSetting.bind(this,id)),'Options','option-switch',id)} checked={this.state.setting[id]} id={id} />
      <label htmlFor={id} className="checkbox"></label><span>{GL(id)}</span>
    </div>;
  },
  showAds: function(){
    alert(GL('ls_13'));
  },
  joinCommunity: function(){
    if(this.state.setting.joinCommunity){
      var sadMove=confirm(GL('ls_19'));
      if(!sadMove){
        return;
      }
    }
    this.toggleSetting('joinCommunity');
  },
  autoState: function(){
    var change=function(value){
      if(value){
        newCommunityRecord(true,['_trackEvent', 'AutoState', 'on']);
        chrome.runtime.sendMessage({job:'autoState'});
        chrome.notifications.create({
          type:'basic',
          iconUrl: '/images/icon_128.png',
          title: GL('ls_7'),
          message: GL('ls_8')
        });
      }
      else{
        newCommunityRecord(true,['_trackEvent', 'AutoState', 'off']);
        chrome.notifications.create({
          type:'basic',
          iconUrl: '/images/icon_128.png',
          title: GL('ls_9'),
          message: GL('ls_10')
        });
      }
      set('autoState',value,function(){
        this.setState(function(prevState){
          prevState.setting.autoState=value;
          return prevState;
        });
      }.bind(this))
    }.bind(this);
    if(!this.state.setting.autoState){
      chrome.permissions.contains({
        permissions: ['tabs']
      },function(result){
        if(result){
          change(true);
        }
        else{
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
      prevState.setting.defaultPage=url;
      return prevState;
    });
    newCommunityRecord(true,['_trackEvent', 'Options', 'defaultPage', url]);
    set('defaultPage',url);
  },
  render: function(){
    return(
      <div id="options">
        <Helmet
          title="Options"
        />
        <div className="section container">
          <h5>{capFirst(GL('clean'))}</h5>
          <div className="btn space" onClick={CW.bind(null,this.cleanHistory,'Options','cleanHistory','')}>{GL('clean_history')}</div><br />
          <div className="btn space" onClick={CW.bind(null,this.reset,'Options','reset','')}>{GL('reset_everything')}</div>
        </div>
        <div className="section container">
          <h5>{GL('notification')}</h5>
          {this.getSwitch('notifyStateChange')}
          {this.getSwitch('notifyInstallation')}
          {this.getSwitch('notifyRemoval')}
          {this.getSwitch('autoStateNotification')}
        </div>
        <div className="section container">
          <h5>{GL('functions')}</h5>
          {this.getSwitch('autoState',this.autoState)}
          {this.getSwitch('recoExtensions')}
        </div>
        <div className="section container">
          <h5>{GL('experience')}</h5>
          <span className="defaultPage">{GL('default_page')}</span>
          <select value={this.state.setting.defaultPage} onChange={this.updateDefaultPage} id="type">
            <option value="overview">{GL('overview')}</option>
            <option value="manage">{GL('manage')}</option>
            <option value="autoState">{GL('autoState')}</option>
            <option value="history">{GL('history')}</option>
          </select>
          {this.getSwitch('joinCommunity',this.joinCommunity)}
          {this.getSwitch('showAds',this.showAds)}
          <input id="upload" className="hide" type="file" onChange={CW.bind(null,this.importOptions,'Options','importOptions','')}/>
          <label htmlFor="upload" className="btn space">{GL('import_settings')}</label><br />
          <div className="btn space" onClick={CW.bind(null,this.exportOptions,'Options','exportOptions','')}>{GL('export_settings')}</div><br />
        </div>
      </div>
    );
  }
});
