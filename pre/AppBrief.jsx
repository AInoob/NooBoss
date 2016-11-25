var React = require('react');
var Link = require('react-router').Link;
module.exports = React.createClass({
  getInitialState: function(){
    return null;
  },
  componentDidMount: function(){
  },
  render: function(){
    var info=this.props.info;
    return(
      <div className="app-holder">
        <input type="checkbox" className="app-status-checkbox" readOnly id={info.id+'-status'} checked={info.enabled} />
        <div className="app-brief" id={info.id+'-app'}>
          <img className="app-icon" src={info.iconUrl} />
          <div className="app-info">
            <label data={info.id} onClick={this.props.toggle} className="app-switch"></label>
            <label data={info.id} onClick={this.props.uninstall} className="app-uninstall"></label>
            <span className="app-version" title={info.version}>{info.version}</span>
            <Link to={'/app?id='+info.id} className="app-name" title={info.name}>{info.name}</Link>
          </div>
        </div>
      </div>
    );
  }
});
