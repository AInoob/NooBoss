import React from 'react';
import ReactDOM from 'react-dom';
import ReactRouter from 'react-router';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';

function logPageView(){
  newCommunityRecord(true,['_trackPageview']);
}

ReactDOM.render(
  <Router history={browserHistory} onUpdate={logPageView}>
    <Route component={require('./Core.jsx')}>
      <Route path="popup.html" component={require('./Overview.jsx')} />
      <Route path="overview" component={require('./Overview.jsx')} />
      <Route path="app" component={require('./App.jsx')} />
      <Route path="manage" component={require('./Manage.jsx')} />
      <Route path="manage/*" component={require('./Manage.jsx')} />
      <Route path="autoState" component={require('./AutoState.jsx')} />
      <Route path="options" component={require('./Options.jsx')} />
      <Route path="history" component={require('./History.jsx')} />
      <Route path="about" component={require('./About.jsx')} />
    </Route>
  </Router>
  ,
  document.getElementById('nooboss')
);
