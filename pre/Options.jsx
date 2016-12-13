var React = require('react');
var Helmet = require('react-helmet');
module.exports = React.createClass({
  displayName: 'Options',
  getInitialState: function(){
    return {setting:{joinCommunity:false,showAds:false,notifyStateChange:false,notifyInstallation:false,notifyRemoval:false,autoStateManage:false}};
  },
  componentDidMount: function(){
    var switchList=['joinCommunity','showAds','notifyStateChange','notifyInstallation','notifyRemoval','autoStateManage'];
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
  clearHistory: function(){
    var result=confirm('Do you want to clear the History?');
    if(result){
      setDB('history_records',null,function(){
        chrome.notifications.create({
          type:'basic',
          iconUrl: '/images/icon_128.png',
          title: 'History cleaned',
          message: 'App history cleared',
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
  reset: function(){
    var result=confirm('Do you want to reset and clearn everything?');
    if(result){
      chrome.runtime.sendMessage({job:'reset'});
    }
  },
  getSwitch: function(id,handler){
    return <div className="switch"><input type="checkbox" onChange={handler||this.toggleSetting.bind(this,id)} checked={this.state.setting[id]} />{getTextFromId(id)}</div>
  },
  autoStateManage: function(){
    var change=function(value){
      set('autoStateManage',value,function(){
        this.setState(function(prevState){
          prevState.setting.autoStateManage=value;
          return prevState;
        });
      }.bind(this))
    }.bind(this);
    if(!this.state.setting.autoStateManage){
      chrome.permissions.contains({
        permissions: ['tabs']
      },function(result){
        if(result){
          change(true);
          chrome.notifications.create({
            type:'basic',
            iconUrl: '/images/icon_128.png',
            title: 'Auto state manage: Enabled',
            message: 'Now you can set rules so NooBoss will enable extensions only when they are needed'
          });
        }
        else{
          chrome.notifications.create({
            type:'basic',
            iconUrl: '/images/icon_128.png',
            title: 'Auto state manage: Requesting permission',
            message: 'NooBoss needs to see which page you are visiting to dicide whether enable or disable an extension'
          });
          chrome.permissions.request({
            permissions: ['tabs']
          },function(granted){
            if(granted){
              change(true);
              chrome.notifications.create({
                type:'basic',
                iconUrl: '/images/icon_128.png',
                title: 'Auto state manage: Enabled',
                message: 'Now you can set rules so NooBoss will enable extensions only when they are needed'
              });
            }
            else{
              change(false);
              chrome.notifications.create({
                type:'basic',
                iconUrl: '/images/icon_128.png',
                title: 'Auto state manage: Disabled',
                message: 'Now NooBoss will not audo manage your extensions'
              });
            }
          });
        }
      });
    }
    else{
      change(false);
      chrome.notifications.create({
        type:'basic',
        iconUrl: '/images/icon_128.png',
        title: 'Auto state manage: Disabled',
        message: 'Now NooBoss will not audo manage your extensions'
      });
    }
  },
  render: function(){
    return(
      <div className="Options">
        <Helmet
          title="Options"
        />
        <div className="header">Clean</div>
        <div className="button" onClick={this.clearHistory}>Clear History</div>
        <div className="button" onClick={this.reset}>Reset everything (careful!)</div>
        <div className="header">Notification</div>
        {this.getSwitch('notifyStateChange')}
        {this.getSwitch('notifyInstallation')}
        {this.getSwitch('notifyRemoval')}
        <div className="header">Functions</div>
        {this.getSwitch('autoStateManage',this.autoStateManage)}
        <div className="header">Experience</div>
        {this.getSwitch('joinCommunity')}
        {this.getSwitch('showAds')}
      </div>
    );
  }
});
