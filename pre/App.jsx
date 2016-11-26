var React = require('react');
var Helmet = require('react-helmet');
module.exports = React.createClass({
  getInitialState: function(){
    return this.state||{};
  },
  componentDidMount: function(){
    var id=getParameterByName('id');
    getDB(id,function(appInfo){
      if(appInfo.enabled){
        appInfo.state='enabled';
      }
      else{
        appInfo.state='disabled';
      }
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
    permissions=<tr><td>{capFirst('permissions')}</td><td><ul>{permissionList}</ul></td></tr>
    var hostPermissions=null;
    var hostPermissionList=(appInfo.hostPermissions||[]).map(function(elem,index){
      return <li key={index}>{elem}</li>
    });
    hostPermissions=<tr><td>{capFirst('host permissions')}</td><td><ul>{hostPermissionList}</ul></td></tr>
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
            <a target="_blank" title={'https://chrome.google.com/webstore/detail/'+appInfo.id} href={'https://chrome.google.com/webstore/detail/'+appInfo.id}><img src={appInfo.icon} /></a>
            {options}
          </div>
          <div className="app-main">
            <a target="_blank" title={'https://chrome.google.com/webstore/detail/'+appInfo.id} href={'https://chrome.google.com/webstore/detail/'+appInfo.id} className="app-name">{appInfo.name}</a>
            {launch}
            <table className="app-brief">
              <tbody>
                <tr><td>{capFirst('version')}</td><td>{appInfo.version}</td></tr>
                <tr><td>{capFirst('state')}</td><td><span className={(this.state.appInfo||{}).state}>{(this.state.appInfo||{}).state}</span></td></tr>
                <tr><td>{capFirst('rating')}</td><td>{'*&&*'}</td></tr>
                <tr><td>{capFirst('description')}</td><td>{appInfo.description}</td></tr>
              </tbody>
            </table>
            <table className="app-detail">
              <tbody>
                <tr><td>{capFirst('last update')}</td><td>{capFirst(new timeago().format(appInfo.lastUpdateDate))}</td></tr>
                <tr><td>{capFirst('installed')}</td><td>{capFirst(new timeago().format(appInfo.installedDate))}</td></tr>
                <tr><td>{capFirst('enabled')}</td><td>{capFirst(appInfo.enabled)}</td></tr>
                <tr><td>{capFirst('homepage url')}</td><td><a href={appInfo.homepageUrl}>{appInfo.homepageUrl}</a></td></tr>
                <tr><td>{capFirst('id')}</td><td>{appInfo.id}</td></tr>
                <tr><td>{capFirst('short name')}</td><td>{appInfo.shortName}</td></tr>
                <tr><td>{capFirst('type')}</td><td>{capFirst(appInfo.type)}</td></tr>
                {launchType}
                <tr><td>{capFirst('offline enabled')}</td><td>{capFirst(getString(appInfo.offlineEnabled))}</td></tr>
                <tr><td>{capFirst('may disable')}</td><td>{capFirst(getString(appInfo.mayDisable))}</td></tr>
                <tr><td>{capFirst('install type')}</td><td>{capFirst(appInfo.installType)}</td></tr>
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
