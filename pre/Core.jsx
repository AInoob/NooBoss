var React = require('react');
var Helmet = require('react-helmet');
var Link = require('react-router').Link;

module.exports = React.createClass({
  render: function(){
    return(
      <div id="NooBoss-Core">
        <nav>
          <ul>
            <li><Link to="/overview">Overview</Link></li>
            <li><Link to="/manage">Manage</Link></li>
            <li><Link to="/discover">Discover</Link></li>
            <li><Link to="/history">History</Link></li>
          </ul>
        </nav>
        <div className="headerPad"></div>
        <Helmet
          title="Core"
        />
        {this.props.children}
        <div className="footerPad"></div>
        <div className="footer">
          <ul>
            <li><Link to="/options">Options</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>
        </div>
      </div>
    );
  }
});

