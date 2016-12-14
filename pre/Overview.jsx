var React = require('react');
var Helmet = require('react-helmet');
var Link = require('react-router').Link;
module.exports = React.createClass({
  displayName: 'Overview',
  getInitialState: function(){
    return {};
  },
  componentDidMount: function(){
    chrome.management.getAll(function(appInfoList){
      for(var i=0;i<appInfoList.length;i++){
        appInfoList[i].iconUrl=this.getIconUrl(appInfoList[i]);
      }
      this.setState({appInfoList:appInfoList});
    }.bind(this));
  },
  getIconUrl: function(appInfo){
    var iconUrl=undefined;
    if(appInfo.icons){
      var maxSize=0;
      for(var j=0;j<appInfo.icons.length;j++){
        var iconInfo=appInfo.icons[j];
        if(iconInfo.size>maxSize){
          maxSize=iconInfo.size;
          iconUrl=iconInfo.url;
        }
      }
    }
    if(!iconUrl){
      var canvas=document.createElement("canvas");
      canvas.width=128;
      canvas.height=128;
      var ctx=canvas.getContext('2d');
      ctx.font="120px Arial";
      ctx.fillStyle="grey";
      ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle="white";
      ctx.fillText(appInfo.name[0],22,110);
      iconUrl=canvas.toDataURL();
    }
    return iconUrl;
  },
  render: function(){
    var appInfoList=this.state.appInfoList||[];
    var overview={};
    overview.app=0;
    overview.extension=0;
    overview.theme=0;
    for(var i=0;i<appInfoList.length;i++){
      var appInfo=appInfoList[i];
      if(appInfo.type=='extension'){
        overview.extension++;
      }
      else if(appInfo.type.indexOf('app')!=-1){
        overview.app++;
      }
      else if(appInfo.type=='theme'){
        overview.theme++;
      }
    }
    console.log();
    return(
      <div className="NooBox-body">
        <Helmet
          title="Home"
        />
        <div id="overview">
          <div className="manage">
            You have:&nbsp;
            <Link to="/manage/app">
              {overview.app}
            </Link> app(s),&nbsp;
            <Link to="/manage/extension">
              {overview.extension}
            </Link> extension(s),&nbsp;
            <Link to="/manage/theme">
              {overview.theme}
            </Link> theme<br/>
            You have:&nbsp;
            <Link to="/autoState">
              {(this.state.rules||[]).length}
            </Link>
            &nbsp;Auto state rule(s).
          </div>
          <div className="discover">
          </div>
        </div>
      </div>
    );
  }
});
