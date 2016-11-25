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
  openUrl: function(url){
    chrome.tabs.create({url: url});
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
    var launchType=null;
    if(appInfo.launchType){
      launchType=<tr><td>{'launch type'}</td><td>{appInfo.launchType}</td></tr>
    }
    var permissions=null;
    var permissionList=(appInfo.permissions||[]).map(function(elem,index){
      return <li key={index}>{elem}</li>
    });
    permissions=<tr><td>{'permissions'}</td><td><ul>{permissionList}</ul></td></tr>
    var hostPermissions=null;
    var hostPermissionList=(appInfo.hostPermissions||[]).map(function(elem,index){
      return <li key={index}>{elem}</li>
    });
    hostPermissions=<tr><td>{'host permissions'}</td><td><ul>{hostPermissionList}</ul></td></tr>
    var options=null;
    if(appInfo.optionsUrl){
      options=<span target="_blank" className="app-options" onClick={this.openUrl.bind(null,appInfo.optionsUrl)} href={appInfo.optionsUrl}>Options</span>
    }
    return(
      <div className="NooBoss-body">
        <Helmet
          title="App"
        />
        <div className="app">
          <div className="app-icon">
            <a href={'https://chrome.google.com/webstore/detail/'+appInfo.id}><img src={appInfo.icon} /></a>
            {options}
          </div>
          <div className="app-main">
            <a target="_blank" href={'https://chrome.google.com/webstore/detail/'+appInfo.id} className="app-name">{appInfo.name}</a>
            {launch}
            <table className="app-brief">
              <tbody>
                <tr><td>{'version'}</td><td>{appInfo.version}</td></tr>
                <tr><td>{'status'}</td><td>{appInfo.status}</td></tr>
                <tr><td>{'rating'}</td><td>{'*&&*'}</td></tr>
                <tr><td>{'description'}</td><td>{appInfo.description}</td></tr>
              </tbody>
            </table>
            <table className="app-detail">
              <tbody>
                <tr><td>{'last update'}</td><td>{new timeago().format(appInfo.lastUpdateDate)}</td></tr>
                <tr><td>{'installed'}</td><td>{new timeago().format(appInfo.installedDate)}</td></tr>
                <tr><td>{'enabled'}</td><td>{appInfo.enabled}</td></tr>
                <tr><td>{'homepage url'}</td><td><a href={appInfo.homepageUrl}>{appInfo.homepageUrl}</a></td></tr>
                <tr><td>{'id'}</td><td>{appInfo.id}</td></tr>
                <tr><td>{'short name'}</td><td>{appInfo.shortName}</td></tr>
                <tr><td>{'type'}</td><td>{appInfo.type}</td></tr>
                {launchType}
                <tr><td>{'offline enabled'}</td><td>{getString(appInfo.offlineEnabled)}</td></tr>
                <tr><td>{'may disable'}</td><td>{getString(appInfo.mayDisable)}</td></tr>
                <tr><td>{'install type'}</td><td>{appInfo.installType}</td></tr>
                {hostPermissions}
                {permissions}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
});
