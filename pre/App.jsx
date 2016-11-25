var React = require('react');
var Helmet = require('react-helmet');
module.exports = React.createClass({
  getInitialState: function(){
    return this.state||{};
  },
  componentDidMount: function(){
    var id=getParameterByName('id');
    getDB(id,function(appInfo){
      this.setState({appInfo: appInfo});
      console.log(appInfo);
    }.bind(this));
  },
  launchApp: function(){
    chrome.management.launchApp(this.state.appInfo.id);
    window.close();
  },
  render: function(){
    var appInfo=this.state.appInfo||{};
    var launch=null;
    if(appInfo.isApp){
      launch=<div className="app-launcher" onClick={this.launchApp}>Launch</div>;
    }
    return(
      <div className="NooBoss-body">
        <Helmet
          title="App"
        />
        <div className="app">
          <div className="app-icon">
            <img src={appInfo.icon} />
          </div>
          <div className="app-main">
            <div className="app-brief">
              <div className="app-name">{appInfo.name}</div>
              <div>{appInfo.version}</div>
              <div>{appInfo.status}</div>
              <div>{'Rating: &*&^'}</div>
            </div>
            {launch}
            <div className="app-detail">
              <div>{'Last update -- '+new timeago().format(appInfo.lastUpdateDate)}</div>
              <div>{'Installed ----- '+new timeago().format(appInfo.installedDate)}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
