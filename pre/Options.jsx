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
  cleanHistory: function(){
    var result=confirm('Do you want to clean the History?');
    if(result){
      setDB('history_records',null,function(){
        chrome.notifications.create({
          type:'basic',
          iconUrl: '/images/icon_128.png',
          title: 'History cleaned',
          message: 'App history cleaned',
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
    return <div className="switch"><input type="checkbox" onChange={CW.bind(null,(handler||this.toggleSetting.bind(this,id)),'Options','option-switch',id)} checked={this.state.setting[id]} />{GL(id)}</div>
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
      if(value){
        newCommunityRecord(true,['_trackEvent', 'AutoState', 'on']);
        chrome.notifications.create({
          type:'basic',
          iconUrl: '/images/icon_128.png',
          title: 'Auto state manage: Enabled',
          message: 'Now you can set rules for NooBoss to auto manage your extensions'
        });
      }
      else{
        newCommunityRecord(true,['_trackEvent', 'AutoState', 'off']);
        chrome.notifications.create({
          type:'basic',
          iconUrl: '/images/icon_128.png',
          title: 'Auto state manage: Disabled',
          message: 'Now NooBoss will not auto manage your extensions'
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
            title: 'Auto state manage: Requesting permission',
            message: 'NooBoss needs to see which page you are visiting to dicide whether enable or disable an extension'
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
      <div className="Options">
        <Helmet
          title="Options"
        />
        <div className="header">{capFirst(GL('clean'))}</div>
        <div className="button" onClick={CW.bind(null,this.cleanHistory,'Options','cleanHistory','')}>{GL('clean_history')}</div>
        <div className="header">{GL('notification')}</div>
        {this.getSwitch('notifyStateChange')}
        {this.getSwitch('notifyInstallation')}
        {this.getSwitch('notifyRemoval')}
        {this.getSwitch('autoStateNotification')}
        <div className="header">{GL('functions')}</div>
        {this.getSwitch('autoState',this.autoState)}
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
    );
  }
});
