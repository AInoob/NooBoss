var React = require('react');
var Link = require('react-router').Link;
module.exports = React.createClass({
  render: function(){
    var info=this.props.info;
    if(this.props.isAutoState){
      return(
        <div className="app-holder" onClick={this.props.select}>
          <input type="checkbox" className="app-status-checkbox" readOnly id={info.id+'-status'} checked={info.enabled} />
          <div className="app-brief" id={info.id+'-app'}>
            <img className="app-icon" src={info.iconUrl} />
            <div className="app-info">
              <span className="app-version" title={info.version}>{info.version}</span>
              {info.name}
            </div>
          </div>
          <div className={this.props.dimmer} />
        </div>
      );
    }
    else{
      var options=null;
      if(this.props.optionsUrl){
        options=<label onClick={CW.bind(null,this.props.openOptions,'Manage','options','')} className="app-options"></label>
      }
      var toggle=null;
      if(!info.type.match('theme')){
          toggle=<label data={info.id} onClick={CW.bind(null,this.props.toggle,'Manage','switch','')} className="app-switch"></label>
      }
      return(
        <div className="app-holder">
          <input type="checkbox" className="app-status-checkbox" readOnly id={info.id+'-status'} checked={info.enabled} />
          <div className="app-brief" id={info.id+'-app'}>
            <img className="app-icon" src={info.iconUrl} />
            <div className="app-info">
              {toggle}
              {options}
              <label data={info.id} onClick={CW.bind(null,this.props.uninstall,'Manage','uninstall','')} className="app-remove"></label>
              <span className="app-version" title={info.version}>{info.version}</span>
              <Link to={'/app?id='+info.id} className="app-name" title={info.name}>{info.name}</Link>
            </div>
          </div>
        </div>
      );
    }
  }
});
