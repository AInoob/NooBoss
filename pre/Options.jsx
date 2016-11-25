var React = require('react');
var Helmet = require('react-helmet');
module.exports = React.createClass({
  getInitialState: function(){
    return null;
  },
  componentDidMount: function(){
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
  render: function(){
    return(
      <div>
        <Helmet
          title="Options"
        />
        <p>Options</p>
        <div onClick={this.clearHistory}>Clear History</div>
      </div>
    );
  }
});
