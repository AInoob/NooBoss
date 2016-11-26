var React = require('react');
var Helmet = require('react-helmet');
module.exports = React.createClass({
  getInitialState: function(){
    return {setting:{joinCommunity:false,showAds:false}};
  },
  componentDidMount: function(){
    var switchList=['joinCommunity','showAds','notifyStateChange','notifyInstallation','notifyRemoval'];
    for(var i=0;i<switchList.length;i++){
      isOn(
        switchList[i],
        function(ii){
          this.setState(function(prevState){
            console.log(prevState);
            prevState.setting[switchList[ii]]=true;
            console.log(prevState);
            return prevState;
          });
        }.bind(this,i),
        function(ii){
          this.setState(function(prevState){
            console.log(prevState);
            prevState.setting[switchList[ii]]=false;
            console.log(prevState);
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
  getSwitch: function(id){
    return <div className="switch"><input type="checkbox" onClick={this.toggleSetting.bind(this,id)} checked={this.state.setting[id]} />{getTextFromId(id)}</div>
  },
  render: function(){
    console.log(this.state);
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
        <div className="header">Experience</div>
        {this.getSwitch('joinCommunity')}
        {this.getSwitch('showAds')}
      </div>
    );
  }
});
