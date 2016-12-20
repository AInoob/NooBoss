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
    var switchList=['joinCommunity','showAds','notifyStateChange','notifyInstallation','notifyRemoval','autoState','autoStateNotification'];
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
      <label htmlFor={id} className="checkbox"></label>{GL(id)}
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
        <div className="section">
          <div className="header">{capFirst(GL('clean'))}</div>
          <div className="button space" onClick={CW.bind(null,this.cleanHistory,'Options','cleanHistory','')}>{GL('clean_history')}</div><br />
          <div className="button space" onClick={CW.bind(null,this.reset,'Options','reset','')}>Reset everything (careful!)</div>
        </div>
        <div className="section">
          <div className="header">{GL('notification')}</div>
          {this.getSwitch('notifyStateChange')}
          {this.getSwitch('notifyInstallation')}
          {this.getSwitch('notifyRemoval')}
          {this.getSwitch('autoStateNotification')}
        </div>
        <div className="section">
          <div className="header">{GL('functions')}</div>
          {this.getSwitch('autoState',this.autoState)}
        </div>
        <div className="section">
          <div className="header">{GL('experience')}</div>
          <div className="selector">
            Default page: <select value={this.state.setting.defaultPage} onChange={this.updateDefaultPage} id="type">
              <option value="overview">{GL('overview')}</option>
              <option value="manage">{GL('manage')}</option>
              <option value="autoState">{GL('autoState')}</option>
              <option value="history">{GL('history')}</option>
            </select>
          </div>
          {this.getSwitch('joinCommunity',this.joinCommunity)}
          {this.getSwitch('showAds',this.showAds)}
        </div>
      </div>
    );
  }
});
