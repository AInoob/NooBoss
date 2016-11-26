var React = require('react');
var Helmet = require('react-helmet');
module.exports = React.createClass({
  getInitialState: function(){
    return {setting:{joinCommunity:false,showAds:false}};
  },
  componentDidMount: function(){
    var switchList=['joinCommunity','showAds'];
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
  getSwitch: function(id){
    return <div><input type="checkbox" onClick={this.toggleSetting.bind(this,id)} checked={this.state.setting[id]} />{getTextFromId(id)}</div>
  },
  render: function(){
    console.log(this.state);
    return(
      <div>
        <Helmet
          title="Options"
        />
        <p>Options</p>
        {this.getSwitch('joinCommunity')}
        {this.getSwitch('showAds')}
        <div onClick={this.clearHistory}>Clear History</div>
      </div>
    );
  }
});
