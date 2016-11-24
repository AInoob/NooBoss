var React = require('react');
var Helmet = require('react-helmet');
module.exports = React.createClass({
  getInitialState: function(){
    return null;
  },
  componentDidMount: function(){
    <Helmet
      title="Home"
    />
  },
  render: function(){
    return(
      <p>Home</p>
    );
  }
});
