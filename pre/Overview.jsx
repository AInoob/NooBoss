var React = require('react');
var Helmet = require('react-helmet');
var AppBrief = require('./AppBrief.jsx');
var Link = require('react-router').Link;
module.exports = React.createClass({
  displayName: 'Overview',
  getInitialState: function(){
    return {
      joinCommunity:false,
      filter:{type:'extension',keyword: ''},
      reco:{
        selected:{}
      },
      infosGoogle:{}
    };
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
    get('userId',function(userId){
      this.setState(function(prevState){
        prevState.userId=userId;
        return prevState;
      });
    }.bind(this));
    isOn('joinCommunity',function(){
      this.setState({joinCommunity:true});
      chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        var url="";
        if(tabs[0])
          url = tabs[0].url;
        var website=extractDomain(url);
        $.ajax({
          type:'POST',
          contentType: "application/json",
          data: JSON.stringify({website:website,userId:this.state.userId}),
          url:'https://ainoob.com/api/nooboss/website'
        }).done(function(data){
          var appInfos={};
          for(var i=0;i<data.appInfos.length;i++){
            var id=data.appInfos[i].appId;
            appInfos[id]=data.appInfos[i];
          }
          var votes={};
          var tags={};
          for(var i=0;i<data.votes.length;i++){
            var id=data.votes[i].appId;
            votes[id]=data.votes[i].action;
            tags[id]={};
          }
          for(var i=0;i<data.tags.length;i++){
            if(!tags[data.tags[i].appId]){
              tags[data.tags[i].appId]={};
            }
            tags[data.tags[i].appId][data.tags[i].tag]=data.tags[i].tagged;
          }
          var recoList=[];
          var temp=Object.keys(data.recos);
          for(var i=0;i<temp.length;i++){
            var id=temp[i];
            var upVoted=0;
            var downVoted=0;
            if(votes[id]=='up'){
              upVoted=1;
            }
            else if(votes[id]=='down'){
              downVoted=1;
            }
            recoList.push({id:id,upVotes:data.recos[id].upVotes-upVoted,downVotes:data.recos[id].downVotes-downVoted});
          }
          this.setState({
            recoList: recoList,
            appInfosWeb: appInfos,
            website: website,
            votes: votes,
            tags: tags
          },function(){
            this.getInfosGoogle();
            this.setState(function(prevState){
              prevState.recoList.sort(function(a,b){
                var upCountA=0;
                var downCountA=0;
                var upCountB=0;
                var downCountB=0;
                if(this.state.votes[a.id]=='up'){
                  upCountA=1;
                }
                else if(this.state.votes[a.id]=='down'){
                  downCountA=1;
                }
                if(this.state.votes[b.id]=='up'){
                  upCountB=1;
                }
                else if(this.state.votes[b.id]=='down'){
                  downCountB=1;
                }
                return (a.upVotes-a.downVotes+upCountA-downCountB)<(b.upVotes-b.downVotes+upCountB-downCountB);
              }.bind(this));
            });
          }.bind(this));
        }.bind(this));
      }.bind(this));
    }.bind(this));
  },
  select: function(id){
    this.setState(function(prevState){
      prevState.reco.selected[id]=!prevState.reco.selected[id];
      return prevState;
    });
  },
  updateFilter: function(e){
    var id=e.target.id;
    var value=e.target.value;
    this.setState(function(prevState){
      prevState.filter[id]=value;
      return prevState;
    });
  },
  getFilteredList: function(){
    return (this.state.appInfoList||[]).map(function(appInfo){
      var filter=this.state.filter;
      var pattern=new RegExp(filter.keyword,'i');
      if((filter.type=='all'||appInfo.type.indexOf(filter.type)!=-1)&&(filter.keyword==''||pattern.exec(appInfo.name))&&appInfo.installType!='development'){
        return appInfo;
      }
      else{
        return null;
      }
    }.bind(this));
  },
  getInfosGoogle: function(){
    for(var i=0;i<this.state.recoList.length;i++){
      var id=this.state.recoList[i].id;
      if(this.state.infosGoogle[id]){
        continue;
      }
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
  appTags:[
    "useful",'functioning','laggy','buggy','not working','ADs/Spam/Malware'
  ],
  addTag: function(appId,tag){
    var inc=1;
    var tagged=true;
    var action='tag';
    if(this.state.tags[appId]&&this.state.tags[appId][tag]){
      action='unTag';
      tagged=false;
      inc=-1;
    }
    var reco={
      appId:appId,
      userId:this.state.userId,
      tag:tag,
      action:action
    };
    $.ajax({
      type:'POST',
      url:"https://ainoob.com/api/nooboss/reco/app/tag",
      contentType: "application/json",
      data: JSON.stringify(reco)
    }).done(function(data){
      this.setState(function(prevState){
        if(!prevState.appInfosWeb[appId]){
          prevState.appInfosWeb[appId]={appId:appId,tags:{}};
        }
        if(!prevState.appInfosWeb[appId].tags[tag]){
          prevState.appInfosWeb[appId].tags[tag]=1;
        }
        else{
          prevState.appInfosWeb[appId].tags[tag]+=inc;
        }
        if(!prevState.tags[appId]){
          prevState.tags[appId]={};
        }
        prevState.tags[appId][tag]=tagged;
        return prevState;
      });
    }.bind(this));
  },
  addReco: function(appId,action){
    var reco;
    reco={
      userId: this.state.userId,
      website: this.state.website,
    };
    if(appId){
      if(this.state.votes[appId]!=action){
        reco.action=action;
      }
      else{
        reco.action=null;
      }
      reco.appIds=[appId];
    }
    else{
      reco.action='up';
      reco.appIds=Object.keys(this.state.reco.selected).filter(function(appId){
        return this.state.votes[appId]!='up'&&this.state.reco.selected[appId];
      }.bind(this));
    }
    $.ajax({
      type:'POST',
      url:"https://ainoob.com/api/nooboss/reco/website",
      contentType: "application/json",
      data: JSON.stringify(reco)
    }).done(function(data){
      this.setState(function(prevState){
        for(var i=0;i<reco.appIds.length;i++){
          var appId=reco.appIds[i];
          prevState.votes[appId]=reco.action;
          var listed=false;
          for(var j=0;j<prevState.recoList.length;j++){
            if(prevState.recoList[j].id==appId){
              listed=true;
            }
          }
          if(!listed){
            prevState.recoList.push({id:appId,upVotes:0,downVotes:0});
          }
        }
        return prevState;
      }.bind(this),this.getInfosGoogle);
    }.bind(this));
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
      var recoList;
      if((this.state.recoList||[]).length>0){
        recoList=(this.state.recoList||[]).map(function(elem,index){
          var app=null;
          var appInfo=null;
          var id=elem.id;
          var upActive='';
          var downActive='';
          var upCount=0;
          var downCount=0;
          if(this.state.votes[id]=='up'){
            upActive='active';
            upCount=1;
          }
          else if(this.state.votes[id]=='down'){
            downActive='active';
            downCount=1;
          }
          if(this.state.appInfosWeb){
            appInfo=this.state.appInfosWeb[id];
          }
          appInfo=appInfo||{tags:[],upVotes:0,downVotes:0};
          var active={};
          var temp=Object.keys(this.state.tags[id]||{});
          for(var j=0;j<temp.length;j++){
            if(this.state.tags[id][temp[j]]){
              active[temp[j]]='active'
            }
          }
          var tags=<div className="tags">
            <div className="tagColumn">
              <div onClick={this.addTag.bind(this,id,'useful')} className={"tag "+active['useful']}>useful:{appInfo.tags['useful']||0}</div>
              <div onClick={this.addTag.bind(this,id,'working')} className={"tag "+active['working']}>working:{appInfo.tags['working']||0}</div>
            </div>
            <div className="tagColumn">
              <div onClick={this.addTag.bind(this,id,'laggy')} className={"tag "+active['laggy']}>laggy:{appInfo.tags['laggy']||0}</div>
              <div onClick={this.addTag.bind(this,id,'buggy')} className={"tag "+active['buggy']}>buggy:{appInfo.tags['buggy']||0}</div>
            </div>
            <div className="tagColumn">
              <div onClick={this.addTag.bind(this,id,'not_working')} className={"tag "+active['not_working']}>not working:{appInfo.tags['not_working']||0}</div>
              <div onClick={this.addTag.bind(this,id,'ASM')} className={"tag "+active['ASM']}>ADs/Spam/Malware:{appInfo.tags['ASM']||0}</div>
            </div>
          </div>;
          var ratingBar=<div className="ratingBar front" style={{background:'linear-gradient(180deg, grey 100%, #01e301 0%)',width:'16px',height:'50px'}}></div>;
          if(appInfo.upVotes!=0||appInfo.downVotes!=0){
            ratingBar=<div className="ratingBar front" style={{background:'linear-gradient(180deg, red '+(appInfo.downVotes/(appInfo.upVotes+appInfo.downVotes)*100)+'%, #01e301 0%)',width:'16px',height:'50px'}}></div>
          }
          var rating=<div className="flip rating">
            {ratingBar}
            <div className="back ratingDetail">
              <div className="upVotes">up<br/>{appInfo.upVotes}</div>
              <div className="downVotes">down<br/>{appInfo.downVotes}</div>
            </div>
          </div>;
          app=
            <div className="app">
              <a target="_blank" className="appBrief flip" href={"https://chrome.google.com/webstore/detail/"+id}>
                <div className="front">
                  <div className="name">{(this.state.infosGoogle[id]||{}).name}</div>
                  <img src={(this.state.infosGoogle[id]||{}).imgUrl} />
                </div>
                <div className="description back">
                  {(this.state.infosGoogle[id]||{}).description}
                </div>
              </a>
              <div className="appReview">
                {tags}
              </div>
            </div>;
          return(
            <div className="reco" key={index}>
              <div className="votes">
                <div className="upVotes flip" onClick={this.addReco.bind(this,id,'up')}>
                  <div className={"front arrowUp "+upActive}></div>
                  <div className="back">{elem.upVotes+upCount}</div>
                </div>
                <div className="score">{elem.upVotes-elem.downVotes+upCount-downCount}</div>
                <div className="downVotes flip" onClick={this.addReco.bind(this,id,'down')}>
                  <div className={"front arrowDown "+downActive}></div>
                  <div className="back">{elem.downVotes+downCount}</div>
                </div>
              </div>
              {app}
            </div>);
        }.bind(this));
      }
      else{
        recoList=<div className="noReco">No one has recommended any extensions for this website yet, do you have a wonderful extension for {this.state.website}?</div>
      }
    }
    var appList=this.getFilteredList().map(function(appInfo,index){
      if(appInfo){
        var dimmer='dimmer';
        if(this.state.reco.selected[appInfo.id]){
          dimmer='nonDimmer';
        }
        return (
            <AppBrief isAutoState="true" select={this.select.bind(this,appInfo.id)} dimmer={dimmer} key={index} info={appInfo} />
        );
      }
    }.bind(this));
    var recoApps=(
      <div className="recoApp">
        <label className="goRecoLabel" htmlFor="goReco">Recommend Extensions for this website</label>
        <input type="checkbox" className="goReco" id="goReco" />
        <div className="recoBoard">
          <div className="actionBar">
            <input id="keyword" onChange={this.updateFilter} type="text" />
            <button className="addReco" onClick={this.addReco.bind(this,null)}>Recommend</button>
          </div>
          {appList}
        </div>
      </div>);
    discover=
      <div id="discover">
        <div className="header">Apps for <span className="website">{this.state.website}</span>:</div>
        {recoList}
        {recoApps}
      </div>;
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
