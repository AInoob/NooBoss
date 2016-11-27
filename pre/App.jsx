var React = require('react');
var Helmet = require('react-helmet');
module.exports = React.createClass({
  getInitialState: function(){
    return this.state||{};
  },
  componentDidMount: function(){
    var id=getParameterByName('id');
    var chromeVersion=getChromeVersion();
    $.ajax({
      dataType: 'xml',
      url:'https://clients2.google.com/service/update2/crx?prodversion='+chromeVersion+'&x=id%3D'+id+'%26installsource%3Dondemand%26uc'
    }).done(function(data){
      crxUrl=$(data).find('updatecheck').attr('codebase');
      crxVersion=$(data).find('updatecheck').attr('version');
      this.setState({crxUrl:crxUrl,crxVersion:crxVersion});
    }.bind(this))
    getDB(id,function(appInfo){
      if(appInfo.state!='removed'){
        if(appInfo.enabled){
          appInfo.state='enabled';
        }
        else{
          appInfo.state='disabled';
        }
        chrome.management.get(id,function(){
          if(chrome.runtime.lastError){
            appInfo.state='removed';
            setDB(id,appInfo);
            this.setState(function(prevState){
              prevState.appInfo.state='removed';
              return prevState;
            });
          }
        }.bind(this));
      }
      this.setState({appInfo: appInfo});
      console.log(appInfo);
    }.bind(this));
  },
  openUrl: function(url){
    chrome.tabs.create({url: url});
  },
  toggleState: function(info){
    var info=this.state.appInfo;
    var action='enable';
    if(info.enabled){
      action='disable';
    }
    newCommunityRecord(true,['_trackEvent', 'manage', action, info.id]);
    chrome.management.setEnabled(info.id,!info.enabled,function(){
      var result='enabled';
      if(info.enabled){
        result='disabled';
      }
      newCommunityRecord(true,['_trackEvent', 'result', result, info.id]);
      this.setState(function(prevState){
        prevState.appInfo.enabled=!info.enabled;
        if(prevState.appInfo.enabled){
          prevState.appInfo.state='enabled';
        }
        else{
          prevState.appInfo.state='disabled';
        }
        return prevState;
      });
    }.bind(this));
  },
  uninstall: function(info){
    var result='removal_success';
    newCommunityRecord(true,['_trackEvent', 'manage', 'removal', info.id]);
    chrome.management.uninstall(this.state.appInfo.id,function(){
      if(chrome.runtime.lastError){
        action='removal_fail';
        console.log(chrome.runtime.lastError);
        chrome.notifications.create({
          type:'basic',
          iconUrl: '/images/icon_128.png',
          title: 'Removal calcelled',
          message: 'You have cancelled the removal of '+info.name,
          imageUrl: info.icon
        });
      }
      else{
        this.setState(function(prevState){
          prevState.appInfo.enabled=false;
          prevState.appInfo.state='removed';
          return prevState;
        });
        newCommunityRecord(true,['_trackEvent', 'result', result, info.id]);
      }
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
      options=<span target="_blank" className="app-options" onClick={this.openUrl.bind(null,appInfo.optionsUrl)} href={appInfo.optionsUrl}></span>
    }
    var config=null;
    if(appInfo.state!='removed'){
      config=
        <div className="config">
          <label onClick={this.toggleState} className="app-switch"></label>
          {options}
          <label onClick={this.uninstall} className="app-remove"></label>
        </div>
    }
    else{
      config=
        <div className="config">
          <a target="_blank" title={'https://chrome.google.com/webstore/detail/'+appInfo.id} href={'https://chrome.google.com/webstore/detail/'+appInfo.id}><label className='app-add'></label></a>
        </div>
    }
    var crxName=null;
    if(this.state.crxVersion){
      crxName='extension_'+(this.state.crxVersion.replace(/\./g,'_')+'.crx');
    }
    var manifestUrl='chrome-extension://'+appInfo.id+'/manifest.json';
    return(
      <div className="NooBoss-body">
        <Helmet
          title="App"
        />
        <div className="app">
          <div className="app-icon">
            <a target="_blank" title={'https://chrome.google.com/webstore/detail/'+appInfo.id} href={'https://chrome.google.com/webstore/detail/'+appInfo.id}><img src={appInfo.icon} /></a>
            {config}
          </div>
          <div className="app-main">
            <a target="_blank" title={'https://chrome.google.com/webstore/detail/'+appInfo.id} href={'https://chrome.google.com/webstore/detail/'+appInfo.id} className="app-name">{appInfo.name}</a>
            {launch}
            <table className="app-brief">
              <tbody>
                <tr><td>{capFirst('version')}</td><td>{appInfo.version}</td></tr>
                <tr><td>{capFirst('state')}</td><td><span className={'noTransTime '+(this.state.appInfo||{}).state}>{capFirst((this.state.appInfo||{}).state)}</span></td></tr>
                <tr><td>{capFirst('rating')}</td><td>{'*&&*'}</td></tr>
                <tr><td>{capFirst('description')}</td><td>{appInfo.description}</td></tr>
              </tbody>
            </table>
            <table className="app-detail">
              <tbody>
                <tr><td>{capFirst('last update')}</td><td>{capFirst(new timeago().format(appInfo.lastUpdateDate))}</td></tr>
                <tr><td>{capFirst('first installed')}</td><td>{capFirst(new timeago().format(appInfo.installedDate))}</td></tr>
                <tr><td>{capFirst('enabled')}</td><td>{capFirst(appInfo.enabled)}</td></tr>
                <tr><td>{capFirst('homepage url')}</td><td><a target="_blank" href={appInfo.homepageUrl}>{appInfo.homepageUrl}</a></td></tr>
                <tr><td>{capFirst('id')}</td><td>{appInfo.id}</td></tr>
                <tr><td>{capFirst('short name')}</td><td>{appInfo.shortName}</td></tr>
                <tr><td>{capFirst('type')}</td><td>{capFirst(appInfo.type)}</td></tr>
                {launchType}
                <tr><td>{capFirst('offline enabled')}</td><td>{capFirst(getString(appInfo.offlineEnabled))}</td></tr>
                <tr><td>{capFirst('download crx')}</td><td><a target="_blank" href={this.state.crxUrl}>{crxName}</a></td></tr>
                <tr><td>{capFirst('update url')}</td><td><a target="_blank" href={appInfo.updateUrl}>{appInfo.updateUrl}</a></td></tr>
                <tr><td>{capFirst('manifest file')}</td><td><a target="_blank" href={manifestUrl}>{manifestUrl}</a></td></tr>
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
