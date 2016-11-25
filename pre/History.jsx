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
        <li key={index}>
        {record.event}
        </li>);
    });
    console.log(recordList);
    return(
      <div className="NooBoss-body">
        <Helmet
          title="History"
        />
        <p>History</p>
        <ul className="History-recordList">
          {recordList}
        </ul>
      </div>
    );
  }
});
