var React = require('react');
var Link = require('react-router').Link;
var Helmet = require('react-helmet');
module.exports = React.createClass({
  getInitialState: function(){
    return this.state||{recordList:[]};
  },
  componentDidMount: function(){
    getDB('history_records',function(recordList){
      this.setState({recordList:recordList});
    }.bind(this));
  },
  render: function(){
    var recordList=(this.state.recordList||[{name:'Nothing is here yet, enable or disable your apps to see effects',id:'mgehojanhfgnndgffijeglgahakgmgkj'}]).map(function(record,index){
      return(
        <tr key={index}>
          <td>{new timeago().format(record.date)}</td>
          <td className={record.action}>{record.action}</td>
          <td><img src={record.icon} /></td>
          <td><Link title={record.name} to={"/app?id="+record.id}>{record.name}</Link></td>
          <td>{record.version}</td>
        </tr>);
    }).reverse();
    return(
      <div className="NooBoss-body">
        <Helmet
          title="History"
        />
        <table className="History-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Action</th>
              <th>Icon</th>
              <th>Name</th>
              <th>Version</th>
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
