var React = require('react');
var Link = require('react-router').Link;
var Helmet = require('react-helmet');
module.exports = React.createClass({
  displayName:'History',
  getInitialState: function(){
    return {
      recordList:[],
      filter:{event:'all',keyword: ''}
    };
  },
  componentDidMount: function(){
    getDB('history_records',function(recordList){
      this.setState({recordList:recordList});
    }.bind(this));
  },
  updateFilter: function(e){
    var id=e.target.id;
    var value=e.target.value;
    this.setState(function(prevState){
      prevState.filter[id]=value;
      return prevState;
    });
  },
  render: function(){
    var filter=this.state.filter;
    var pattern=new RegExp(filter.keyword,'i');
    var recordList=(this.state.recordList||[{name:'Nothing is here yet',id:'mgehojanhfgnndgffijeglgahakgmgkj'}]).map(function(record,index){
      if((filter.event=='all'||record.event==filter.event)&&(filter.keyword==''||pattern.exec(record.name))){
        return(
          <tr key={index}>
            <td>{new timeago(null,chrome.i18n.getUILanguage()).format(record.date)}</td>
            <td className={record.event}>{GL(record.event)}</td>
            <td><img src={record.icon} /></td>
            <td><Link title={record.name} to={"/app?id="+record.id}>{record.name}</Link></td>
            <td>{record.version}</td>
          </tr>);
      }
      else{
        return null;
      }
    }).reverse();
    return(
      <div className="section" id="history">
        <Helmet
          title="History"
        />
        <div className="actionBar">
          <div className="event">
            <select onChange={this.updateFilter} id="event">
              <option value="all">All</option>
              <option value="installed">Installed</option>
              <option value="removed">Removed</option>
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
          <input id="keyword" onChange={this.updateFilter} type="text" />
        </div>
        <table className="history-table">
          <thead>
            <tr>
              <th>{capFirst(GL('when'))}</th>
              <th>{capFirst(GL('event'))}</th>
              <th>{capFirst(GL('icon'))}</th>
              <th>{capFirst(GL('name'))}</th>
              <th>{capFirst(GL('version'))}</th>
            </tr>
          </thead>
          <tbody>
            {recordList}
          </tbody>
        </table>
      </div>
    );
  }
});
