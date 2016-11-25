var React = require('react');
var Helmet = require('react-helmet');
var AppBrief = require('./AppBrief.jsx');
module.exports = React.createClass({
  getInitialState: function(){
    return this.state||{};
  },
  componentDidMount: function(){
    chrome.management.getAll(function(appInfoList){
      for(var i=0;i<appInfoList.length;i++){
        appInfoList[i].iconUrl=this.getIconUrl(appInfoList[i]);
      }
      this.setState({appInfoList:appInfoList});
    }.bind(this));
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
    return iconUrl;
  },
  toggleState: function(info){
    var action='enable';
    if(info.enabled){
      action='disable';
    }
    newCommunityRecord(true,['_trackEvent', 'manage', action, info.id]);
    chrome.management.setEnabled(info.id,!info.enabled,function(){
      var result='enabled';
      if(info.enabled){
        result='disabled';
      }
      newCommunityRecord(true,['_trackEvent', 'result', result, info.id]);
      this.setState(function(prevState){
        for(var i=0;i<prevState.appInfoList.length;i++){
          if(info.id==prevState.appInfoList[i].id){
            prevState.appInfoList[i].enabled=!info.enabled;
            break;
          }
        }
        return prevState;
      });
    }.bind(this));
  },
  uninstall: function(info){
    var result='removal_success';
    newCommunityRecord(true,['_trackEvent', 'manage', 'removal', info.id]);
    chrome.management.uninstall(info.id,function(){
      if(chrome.runtime.lastError){
        action='removal_fail';
        console.log(chrome.runtime.lastError);
        chrome.notifications.create({
          type:'basic',
          iconUrl: '/images/icon_128.png',
          title: 'Removal calcelled',
          message: 'You have cancelled the removal of '+info.name,
          imageUrl: info.icon
        });
      }
      else{
        this.setState(function(prevState){
          for(var i=0;i<prevState.appInfoList.length;i++){
            if(info.id==prevState.appInfoList[i].id){
              prevState.appInfoList.splice(i,1);
              break;
            }
          }
          return prevState;
        });
      }
      newCommunityRecord(true,['_trackEvent', 'result', result, info.id]);
    }.bind(this));
  },
  openOptions:function(url){
    chrome.tabs.create({url:url});
  },
  render: function(){
    var appList=(this.state.appInfoList||[]).map(function(appInfo,index){
      return (
        <AppBrief key={index} uninstall={this.uninstall.bind(this,appInfo)} toggle={this.toggleState.bind(this,appInfo)} optionsUrl={appInfo.optionsUrl} openOptions={this.openOptions.bind(this,appInfo.optionsUrl)} info={appInfo} />
        );
    }.bind(this));
    return(
      <div className="NooBoss-body">
        <Helmet
          title="Manage"
        />
        {appList}
      </div>
    );
  }
});
