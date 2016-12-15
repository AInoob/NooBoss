var React = require('react');
var Helmet = require('react-helmet');
var Link = require('react-router').Link;
module.exports = React.createClass({
  displayName: 'Overview',
  getInitialState: function(){
    return {joinCommunity:false,infosGoogle:{}};
  },
  componentDidMount: function(){
    chrome.management.getAll(function(appInfoList){
      for(var i=0;i<appInfoList.length;i++){
        appInfoList[i].iconUrl=this.getIconUrl(appInfoList[i]);
      }
      this.setState({appInfoList:appInfoList});
    }.bind(this));
    get('autoStateRules',function(data){
      var rules=[];
      if(data){
        rules=JSON.parse(data);
      }
      this.setState({rules:rules});
    }.bind(this));
    isOn('joinCommunity',function(){
      this.setState({joinCommunity:true});
      chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        var url="";
        if(tabs[0])
          url = tabs[0].url;
        var website=extractDomain(url);
        $.ajax({url:'https://ainoob.com/api/nooboss/website/'+website
        }).done(function(data){
          this.setState({
            recoList: data.recoList,
            appInfosWeb: data.appInfos,
            website: website
          },this.getInfosGoogle);
        }.bind(this));
      }.bind(this));
    }.bind(this));
  },
  getInfosGoogle: function(){
    for(var i=0;i<this.state.recoList.length;i++){
      var id=this.state.recoList[i].id;
      $.ajax({
        url:'https://chrome.google.com/webstore/detail/'+id
      }).done(function(id,data){
        var a=data.indexOf('src="',data.indexOf('<img  alt="Extension"'))+5;
        var b=data.indexOf('"',a);
        var imgUrl=data.slice(a,b);
        a=data.indexOf('<h1 class="e-f-w">')+18;
        b=data.indexOf('</h1>',a);
        var name=data.slice(a,b);
        a=data.indexOf('itemprop="description">')+23;
        b=data.indexOf('</',a);
        var description=data.slice(a,b);
        this.setState(function(prevState){
          prevState.infosGoogle[id]={
            imgUrl:imgUrl,
            name: name,
            description: description
          }
          return prevState;
        });
      }.bind(this,id));
    }
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
    var discover=null;
    var recoList;
    if(!this.state.joinCommunity){
      discover=
        <div id="discover">
          Community feature is off.
          <p>You will not see apps recommended by users for various websites or community details for each app(turn it on <Link to="/options">here</Link>).</p>
        </div>;
    }
    else{
      var recoList=(this.state.recoList||[]).map(function(elem,index){
        var app=null;
        var appInfo=null;
        if(this.state.appInfosWeb){
          appInfo=this.state.appInfosWeb[elem.id];
        }
        if(appInfo){
          var tags=Object.keys(appInfo.tags).map(function(tag,index2){
            var counter=appInfo.tags[tag];
            return <div key={index2} className="tag">{tag}:{counter}</div>;
          });
          app=
            <div className="app">
              <Link className="appBrief flip" to={"/appWeb?id="+elem.id}>
                <div className="front">
                  <div className="name">{(this.state.infosGoogle[elem.id]||{}).name}</div>
                  <img src={(this.state.infosGoogle[elem.id]||{}).imgUrl} />
                </div>
                <div className="description back">
                  {(this.state.infosGoogle[elem.id]||{}).description}
                </div>
              </Link>
              <div className="appReview">
                <div className="flip rating">
                  <div className="ratingBar front" style={{background:'linear-gradient(180deg, red '+(appInfo.downVotes/(appInfo.upVotes+appInfo.downVotes)*100)+'%, #01e301 0%)',width:'16px',height:'50px'}}></div>
                  <div className="back ratingDetail">
                    <div className="upVotes">up<br/>{appInfo.upVotes}</div>
                    <div className="downVotes">down<br/>{appInfo.downVotes}</div>
                  </div>
                </div>
                <div className="tags">
                  {tags}
                </div>
              </div>
            </div>;
        }
        return(
          <div className="reco" key={index}>
            <div className="votes">
              <div className="upVotes flip">
                <div className="front arrowUp"></div>
                <div className="back">{elem.upVotes}</div>
              </div>
              <div className="score">{elem.upVotes-elem.downVotes}</div>
              <div className="downVotes flip">
                <div className="front arrowDown"></div>
                <div className="back">{elem.downVotes}</div>
              </div>
            </div>
            {app}
          </div>);
      }.bind(this));
      discover=
        <div id="discover">
          <div className="header">Apps for <span className="website">{this.state.website}</span>:</div>
          {recoList}
        </div>;
    }
    return(
      <div className="NooBox-body">
        <Helmet
          title="Home"
        />
        <div id="overview">
          <div className="manage">
            <div className="sectionHeader">You have</div>
            <div className="status">
              <Link to="/manage/app">
                {overview.app}
              </Link> app(s),&nbsp;
              <Link to="/manage/extension">
                {overview.extension}
              </Link> extension(s),&nbsp;
              <Link to="/manage/theme">
                {overview.theme}
              </Link> theme<br/>
              <Link to="/autoState">
                {(this.state.rules||[]).length}
              </Link>
              &nbsp;auto state rule(s).
            </div>
          </div>
          {discover}
        </div>
      </div>
    );
  }
});
