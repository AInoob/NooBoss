var React = require('react');
var Helmet = require('react-helmet');
module.exports = React.createClass({
  displayName: 'Options',
  getInitialState: function(){
    return {setting:{joinCommunity:false,showAds:false,notifyStateChange:false,notifyInstallation:false,notifyRemoval:false,autoState:false,autoStateNotification:false}};
  },
  componentDidMount: function(){
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
  showAds: function(){
    alert('wow, thank you for clicking this, but NooBoss is not in stable version yet, so no ADs will be shown! NooBoss is an open-sourced software with proud, you will always have the right to show or hide ADs that NooBoss might bring in the future');
  },
  joinCommunity: function(){
    if(this.state.setting.joinCommunity){
      var sadMove=confirm('You are about to leave NooBoss community, by doing so: AInoob(author) will no longer know if anyone is using NooBoss or not, thus he might slows down the NooBoss project or even shuts it down. However, this is your choice, click "OK" if you do not want to send your NooBoss usage data and extensions you are using to NooBox community.(NooBoss never track your personal information)');
      if(!sadMove){
        return;
      }
    }
    this.toggleSetting('joinCommunity');
  },
  autoState: function(){
    var change=function(value){
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
        {this.getSwitch('autoStateNotification')}
        <div className="header">Functions</div>
        {this.getSwitch('autoState',this.autoState)}
        <div className="header">Experience</div>
        {this.getSwitch('joinCommunity',this.joinCommunity)}
        {this.getSwitch('showAds',this.showAds)}
      </div>
    );
  }
});
