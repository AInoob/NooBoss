var React= require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;
var Link = require('react-router').Link;
var browserHistory = ReactRouter.browserHistory;

ReactDOM.render(
  <Router history={browserHistory}>
    <Route component={require('./Core.jsx')}>
      <Route path="popup.html" component={require('./Home.jsx')} />
      <Route path="manage" component={require('./Manage.jsx')} />
      <Route path="related" component={require('./Related.jsx')} />
      <Route path="options" component={require('./Options.jsx')} />
      <Route path="update" component={require('./Update.jsx')} />
      <Route path="about" component={require('./About.jsx')} />
    </Route>
  </Router>
  ,
  document.getElementById('nooboss')
);
