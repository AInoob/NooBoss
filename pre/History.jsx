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
          <td>{record.category}</td>
          <td><img src={record.icon} /></td>
          <td>{record.event}</td>
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
              <th>Category</th>
              <th>Icon</th>
              <th>Event</th>
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
