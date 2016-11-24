var React = require('react');
var Helmet = require('react-helmet');
module.exports = React.createClass({
  getInitialState: function(){
    return null;
  },
  componentDidMount: function(){
    <Helmet
      title="Options"
    />
  },
  render: function(){
    return(
      <p>Options</p>
    );
  }
});
