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
    }.bind(this));
    $.ajax({
      url:'https://chrome.google.com/webstore/detail/'+id
    }).done(function(data){
      this.setState({rating: parseFloat(data.match(/g:rating_override=\"([\d.]*)\"/)[1]).toFixed(3)+' / 5'});
    }.bind(this));
    getDB(id,function(appInfo){
      chrome.management.get(id,function(appInfo2){
        if(chrome.runtime.lastError){
          appInfo.state='removed';
        }
        else{
          if(appInfo2.enabled){
            appInfo.state='enabled';
          }
          else{
            appInfo.state='disabled';
          }
        }
      });
      this.setState({appInfo: appInfo});
      console.log(appInfo);
    }.bind(this));
  },
  toggleState: function(info){
    var info=this.state.appInfo;
    var action='enable';
    if(info.enabled){
      action='disable';
    }
    newCommunityRecord(true,['_trackEvent', 'manage', action]);
    chrome.management.setEnabled(info.id,!info.enabled,function(){
      var result='enabled';
      if(info.enabled){
        result='disabled';
      }
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
      launch=<div className="app-launcher" onClick={CW.bind(null,this.launchApp,'App','launch','')}>Launch</div>;
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
      options=<span className="app-options" onClick={CLR.bind(null,appInfo.optionsUrl,'Manage','option','')}></span>
    }
    var toggle=null;
    if(appInfo.type&&!appInfo.type.match('theme')){
        toggle=<label onClick={CW.bind(null,this.toggleState,'Manage','switch','')} className="app-switch"></label>
    }
    var config=null;
    if(appInfo.state!='removed'){
      config=
        <div className="config">
          {toggle}
          {options}
          <label onClick={CW.bind(null,this.uninstall,'Manage','uninstall','')} className="app-remove"></label>
        </div>
    }
    else{
      config=
        <div className="config">
          <a onClick={CL.bind(null,'https://chrome.google.com/webstore/detail/'+appInfo.id,'App','app-link')} title={'https://chrome.google.com/webstore/detail/'+appInfo.id}><label className='app-add'></label></a>
        </div>
    }
    var crxName=null;
    if(this.state.crxVersion){
      crxName='extension_'+(this.state.crxVersion.replace(/\./g,'_')+'.crx');
    }
    var manifestUrl='chrome-extension://'+appInfo.id+'/manifest.json';
    var nb_rating=<tr><td>{capFirst('NB-Rating')}</td><td>{this.state.nb_rating}</td></tr>;
    return(
      <div className="NooBoss-body">
        <Helmet
          title="App"
        />
        <div className="app">
          <div className="app-icon">
            <a title={'https://chrome.google.com/webstore/detail/'+appInfo.id} onClick={CL.bind(null,'https://chrome.google.com/webstore/detail/'+appInfo.id,'App','app-link')}><img src={appInfo.icon} /></a>
            {config}
          </div>
          <div className="app-main">
            <a title={'https://chrome.google.com/webstore/detail/'+appInfo.id} onClick={CL.bind(null,'https://chrome.google.com/webstore/detail/'+appInfo.id,'App','app-link')} className="app-name">{appInfo.name}</a>
            {launch}
            <table className="app-brief">
              <tbody>
                <tr><td>{capFirst('version')}</td><td>{appInfo.version}</td></tr>
                <tr><td>{capFirst('state')}</td><td><span className={'noTransTime '+(this.state.appInfo||{}).state}>{capFirst((this.state.appInfo||{}).state)}</span></td></tr>
                <tr><td>{capFirst('rating')}</td><td>{this.state.rating}</td></tr>
                <tr><td>{capFirst('description')}</td><td>{appInfo.description}</td></tr>
              </tbody>
            </table>
            <table className="app-detail">
              <tbody>
                <tr><td>{capFirst('last update')}</td><td>{capFirst(new timeago().format(appInfo.lastUpdateDate))}</td></tr>
                <tr><td>{capFirst('first installed')}</td><td>{capFirst(new timeago().format(appInfo.installedDate))}</td></tr>
                <tr><td>{capFirst('enabled')}</td><td>{capFirst(appInfo.enabled)}</td></tr>
                <tr><td>{capFirst('homepage url')}</td><td><a title={appInfo.homepageUrl} onClick={CL.bind(null,appInfo.homepageUrl,'App','app-link')}>{appInfo.homepageUrl}</a></td></tr>
                <tr><td>{capFirst('id')}</td><td>{appInfo.id}</td></tr>
                <tr><td>{capFirst('short name')}</td><td>{appInfo.shortName}</td></tr>
                <tr><td>{capFirst('type')}</td><td>{capFirst(appInfo.type)}</td></tr>
                {launchType}
                <tr><td>{capFirst('offline enabled')}</td><td>{capFirst(getString(appInfo.offlineEnabled))}</td></tr>
                <tr><td>{capFirst('download crx')}</td><td><a title={this.state.crxUrl} onClick={CL.bind(null,this.state.crxUrl,'App','app-link')}>{crxName}</a></td></tr>
                <tr><td>{capFirst('update url')}</td><td><a title={appInfo.updateUrl} onClick={CL.bind(null,appInfo.updateUrl,'App','app-link')}>{appInfo.updateUrl}</a></td></tr>
                <tr><td>{capFirst('manifest file')}</td><td><a onClick={CL.bind(null,manifestUrl,'App','manifest')} title={manifestUrl}>manifest.json</a></td></tr>
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
