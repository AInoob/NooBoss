var React = require('react');
var Helmet = require('react-helmet');
var Link = require('react-router').Link;

module.exports = React.createClass({
  render: function(){
    var activeList={};
    activeList[this.props.location.pathname.match(/\/(\w+)/)[1]]='active'
    return(
      <div id="NooBoss-Core">
        <nav>
          <ul>
            <li className={activeList.overview}><Link to="/overview">Overview</Link></li>
            <li className={activeList.manage}><Link to="/manage">Manage</Link></li>
            <li className={activeList.discover}><Link to="/discover">Discover</Link></li>
            <li className={activeList.history}><Link to="/history">History</Link></li>
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
            <li className={activeList.options}><Link to="/options">Options</Link></li>
            <li className={activeList.about}><Link to="/about">About</Link></li>
          </ul>
        </div>
      </div>
    );
  }
});

