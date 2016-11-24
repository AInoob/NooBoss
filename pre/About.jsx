var React = require('react');
var Helmet = require('react-helmet');
module.exports = React.createClass({
  getInitialState: function(){
    return null;
  },
  componentDidMount: function(){
    <Helmet
      title="About"
    />
  },
  render: function(){
    return(
      <p>About</p>
    );
  }
});
