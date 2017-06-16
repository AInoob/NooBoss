import React from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router';

module.exports = React.createClass({
  render() {
    const activeList = {};
    activeList[(this.props.location.pathname.match(/(\w+)/) || [null,null])[1]] = 'active';
    return (
      <div id="core">
        <nav>
          <ul>
            <li className={activeList.overview}><Link to="/overview">{capFirst(GL('overview'))}</Link></li>
            <li className={activeList.manage}><Link to="/manage">{capFirst(GL('manage'))}</Link></li>
            <li className={activeList.autoState}><Link to="/autoState">{capFirst(GL('autoState'))}</Link></li>
            <li className={activeList.history}><Link to="/history">{capFirst(GL('history'))}</Link></li>
            <li className={activeList.options}><Link to="/options">{capFirst(GL('options'))}</Link></li>
            <li className={activeList.about}><Link to="/about">{capFirst(GL('about'))}</Link></li>
          </ul>
        </nav>
        <div className="headerPad"></div>
        <Helmet
          title="Core"
        />
        {this.props.children}
      </div>
    );
  }
});
