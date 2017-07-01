var React = require('react');
var Link = require('react-router').Link;
module.exports = React.createClass({
  render: function(){
    var info=this.props.info;
    if(this.props.isMini){
      return(
        <div className="app-holder" onClick={this.props.select}>
          <input type="checkbox" className="app-status-checkbox" readOnly id={info.id+'-status'} checked={info.enabled} />
          <div className="app-brief" id={info.id+'-app'}>
            <img className="app-icon" src={info.iconUrl} />
            <div className="app-info">
              <div className="app-version" title={info.version}>{info.version}</div>
              <div className="app-name">{info.name}</div>
            </div>
          </div>
          <div className={this.props.dimmer} />
        </div>
      );
    }
    else{
      var options=null;
      if(this.props.optionsUrl){
        options=<label title="open options page" onClick={CW.bind(null,this.props.openOptions,'Manage','options','')} className="app-options"></label>
      }
      var toggle=null;
      if(!info.type.match('theme')){
          toggle=<label data={info.id} title="turn this on or off" onClick={CW.bind(null,this.props.toggle,'Manage','switch','')} className="app-switch"></label>
      }
      var uninstall=null;
      uninstall=<label data={info.id} title="remove" onClick={CW.bind(null,this.props.uninstall,'Manage','uninstall','')} className="app-remove"></label>;
      var chromeOption=null;
      chromeOption=<label data={info.id} title="default Chrome manage page" onClick={CW.bind(null,this.props.chromeOption,'Manage','chromeOption','')} className="app-chromeOption"></label>;
      return(
        <div className="app-holder">
          <input type="checkbox" className="app-status-checkbox" readOnly id={info.id+'-status'} checked={info.enabled} />
          <div className="app-brief" id={info.id+'-app'} onClick={CW.bind(null,shared.goTo.bind(null,'/app?id='+info.id),'Manage','app-detail',info.id)}>
            <img className="app-icon" src={info.iconUrl} />
            <div  className="app-info">
              <div className="app-version" title={info.version}>{info.version}</div>
              <Link onClick={CW.bind(null,shared.goTo.bind(null,'/app?id='+info.id),'Manage','app-detail',info.id)}  className="app-name" title={info.name}>{info.name}</Link>
            </div>
          </div>
          <div className="actions">
            {toggle}
            {options}
            {uninstall}
            {chromeOption}
          </div>
        </div>
      );
    }
  }
});
