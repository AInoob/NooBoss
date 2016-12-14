var React = require('react');
var Helmet= require('react-helmet');
module.exports = React.createClass({
  getInitializeState: function(){
  },
  compenentDidMount: function(){
  },
  render: function(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      console.log(tabs[0]);
    });
    return(
      <div>
        <Helmet
          title="Discover"
        />
        <p>Discover function is not available yet, sorry about this</p>
      </div>
    );
  }
});
