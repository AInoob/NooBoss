var React = require('react');
var Helmet = require('react-helmet');
module.exports = React.createClass({
  getInitialState: function(){
    return null;
  },
  componentDidMount: function(){
    <Helmet
      title="Update"
    />
  },
  render: function(){
    return(
      <p>Update</p>
    );
  }
});
