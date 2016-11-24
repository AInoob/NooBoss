var React = require('react');
var Helmet = require('react-helmet');
var AppBrief = require('./AppBrief.jsx');
module.exports = React.createClass({
  getInitialState: function(){
    return this.state||{};
  },
  componentDidMount: function(){
    <Helmet
      title="Manage"
    />
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
    chrome.management.setEnabled(info.id,!info.enabled,function(){
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
    chrome.management.uninstall(info.id,function(){
      if(chrome.runtime.lastError){
        console.log(chrome.runtime.lastError);
        chrome.notifications.create({
          type:'basic',
          iconUrl: info.iconUrl,
          title: 'Uninstallation calcelled',
          message: 'You have cancel the uninstallation of '+info.name
        });
      }
      else{
        chrome.notifications.create({
          type:'basic',
          iconUrl: info.iconUrl,
          title: info.name+'Uninstallation compelte',
          message: info.name+' is now uninstalled'
        });
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
    }.bind(this));
  },
  render: function(){
    var appList=(this.state.appInfoList||[]).map(function(appInfo,index){
      return (
        <AppBrief key={index} uninstall={this.uninstall.bind(this,appInfo)} toggle={this.toggleState.bind(this,appInfo)} info={appInfo} />
        );
    }.bind(this));
    return(
      <div className="NooBoss-body">
        {appList}
      </div>
    );
  }
});
