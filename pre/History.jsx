var React = require('react');
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
    console.log(this.state.recordList);
    var recordList=this.state.recordList.map(function(record,index){
      return(
        <tr key={index}>
          <td>{new timeago().format(record.date)}</td>
          <td>{record.action}</td>
          <td><img src={record.icon} /></td>
          <td><a target="_blank" title={record.name} href={"https://chrome.google.com/webstore/detail/"+record.id}>{record.name}</a></td>
          <td>{record.version}</td>
        </tr>);
    }).reverse();
    console.log(recordList);
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
