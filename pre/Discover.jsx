var React = require('react');
var Helmet= require('react-helmet');
module.exports = React.createClass({
  getInitializeState: function(){
  },
  compenentDidMount: function(){
  },
  render: function(){
    return(
      <div>
        <Helmet
          title="Discover"
        />
        <p>Discover new apps</p>
      </div>
    );
  }
});
