var React = require('react');
var Helmet = require('react-helmet');
var AppBrief = require('./AppBrief.jsx');
var Link = require('react-router').Link;
module.exports = React.createClass({
  displayName: 'Overview',
  getInitialState: function(){
    return {
      joinCommunity:false,
      recoExtensions: false,
      filter:{type:'extension',keyword: ''},
      reco:{
        selected:{}
      },
      infosGoogle:{}
    };
  },
  componentDidMount: function(){
    shared.goTo=this.props.router.push;
    if(window.location.pathname.indexOf('popup')!=-1){
      var page=getParameterByName('page');
      if(page){
        this.props.router.push(page);
        if(page=='overview'){
          this.getInitialData();
        }
      }
      else{
        get('defaultPage',function(url){
          this.props.router.push((url||'overview'));
          if(!url||url=='overview'){
            this.getInitialData();
          }
        }.bind(this));
      }
    }
    else{
      this.getInitialData();
    }
  },
  getInitialData: function(){
    chrome.management.getAll(function(appInfoList){
        for(var i=0;i<appInfoList.length;i++){
          appInfoList[i].iconUrl=this.getIconUrl(appInfoList[i]);
        }
        this.setState({appInfoList:appInfoList});
      }.bind(this));
      get('autoStateRules',function(rules){
        this.setState({rules:JSON.parse(rules)});
      }.bind(this));
      get('userId',function(userId){
        this.setState(function(prevState){
          prevState.userId=userId;
          return prevState;
        });
      }.bind(this));
      isOn('recoExtensions',function(){
        this.setState({recoExtensions:true});
        isOn('joinCommunity',function(){
          chrome.permissions.contains({
            permissions: ['tabs']
          },function(result){
            if(result){
              this.setState({tabPerm:true});
            }
          }.bind(this));
          this.setState({joinCommunity:true});
          chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
            var url="";
            if(tabs[0])
              url = tabs[0].url;
            var website=extractDomain(url);
            if(website.match(/^undefined/)){
              website=GL('all_websites');
            }
            $.ajax({
              type:'POST',
              contentType: "application/json",
              data: JSON.stringify({website:website,userId:this.state.userId}),
              url:'https://ainoob.com/api/nooboss/website'
            }).done(function(data){
              var appInfos={};
              for(var i=0;i<data.appInfos.length;i++){
                var appId=data.appInfos[i].appId;
                appInfos[appId]=data.appInfos[i];
              }
              var votes={};
              var tags={};
              for(var i=0;i<data.votes.length;i++){
                var appId=data.votes[i].appId;
                votes[appId]=data.votes[i].action;
                tags[appId]={};
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
                var appId=temp[i];
                var upVoted=0;
                var downVoted=0;
                if(votes[appId]=='up'){
                  upVoted=1;
                }
                else if(votes[appId]=='down'){
                  downVoted=1;
                }
                recoList.push({appId:appId,upVotes:data.recos[appId].upVotes-upVoted,downVotes:data.recos[appId].downVotes-downVoted});
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
                    if(this.state.votes[a.appId]=='up'){
                      upCountA=1;
                    }
                    else if(this.state.votes[a.appId]=='down'){
                      downCountA=1;
                    }
                    if(this.state.votes[b.appId]=='up'){
                      upCountB=1;
                    }
                    else if(this.state.votes[b.appId]=='down'){
                      downCountB=1;
                    }
                    return (b.upVotes-b.downVotes+upCountB-downCountB)-(a.upVotes-a.downVotes+upCountA-downCountA);
                  }.bind(this));
                });
              }.bind(this));
            }.bind(this));
          }.bind(this));
        }.bind(this));
      }.bind(this));
  },
  select: function(appId){
    this.setState(function(prevState){
      prevState.reco.selected[appId]=!prevState.reco.selected[appId];
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
    return (this.state.appInfoList||[]).sort(function(a,b){
      if(a.enabled!=b.enabled){
        if(a.enabled){
          return -1;
        }
        else{
          return 1;
        }
      }
      else{
        return compare(a.name.toLowerCase(),b.name.toLowerCase());
      }
    }).map(function(appInfo){
      var filter=this.state.filter;
      var pattern=new RegExp(filter.keyword,'i');
      if((filter.type=='all'||appInfo.type.indexOf(filter.type)!=-1)&&(filter.keyword==''||pattern.exec(appInfo.name))&&appInfo.installType!='development'&&appInfo.updateUrl&&appInfo.updateUrl.indexOf('https://clients2.google.com')!=-1&&appInfo.homepageUrl&&appInfo.homepageUrl.indexOf('https://ext.chrome.360.cn')==-1){
        return appInfo;
      }
      else{
        return null;
      }
    }.bind(this));
  },
  getInfosGoogle: function(){
    for(var i=0;i<this.state.recoList.length;i++){
      var appId=this.state.recoList[i].appId;
      if(this.state.infosGoogle[appId]){
        continue;
      }
      $.ajax({
        url:'https://chrome.google.com/webstore/detail/'+appId
      }).done(function(appId,data){
        var a=data.indexOf('src="',data.indexOf('od-s-wa'))+5;
        var b=data.indexOf('"',a);
        var imgUrl=data.slice(a,b);
        a=data.indexOf('<h1 class="e-f-w">')+18;
        b=data.indexOf('</h1>',a);
        var name=data.slice(a,b);
        a=data.indexOf('itemprop="description">')+23;
        b=data.indexOf('</',a);
        var description=data.slice(a,b);
        this.setState(function(prevState){
          prevState.infosGoogle[appId]={
            imgUrl:imgUrl,
            name: name,
            description: description
          }
          return prevState;
        });
      }.bind(this,appId));
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
  toggleTag: function(appId,tag){
    var inc=1;
    var tagged=true;
    var action='tag';
    if(this.state.tags[appId]&&this.state.tags[appId][tag]){
      action='unTag';
      tagged=false;
      inc=-1;
    }
    CW(function(){},'Community','addTag',action);
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
      $('#goReco').prop('checked',false);
      reco.action='up';
      reco.appIds=Object.keys(this.state.reco.selected).filter(function(appId){
        return this.state.votes[appId]!='up'&&this.state.reco.selected[appId];
      }.bind(this));
      this.setState(function(prevState){
        prevState.reco.selected={};
        return prevState;
      });
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
            if(prevState.recoList[j].appId==appId){
              listed=true;
            }
          }
          if(!listed){
            prevState.recoList.push({appId:appId,upVotes:0,downVotes:0});
          }
        }
        return prevState;
      }.bind(this),this.getInfosGoogle);
    }.bind(this));
  },
  requestTabsPermission: function(){
    chrome.notifications.create('',{
      type:'basic',
      iconUrl: '/images/icon_128.png',
      title: GL('ls_11'),
      message: GL('ls_12')
    },function() {});
    chrome.permissions.request({
      permissions: ['tabs']
    },function(granted){
      if(granted){
        chrome.notifications.create('',{
          type:'basic',
          iconUrl: '/images/icon_128.png',
          title: GL('ls_15'),
          message: GL('ls_16')
        },function() {});
      }
      else{
        chrome.notifications.create('',{
          type:'basic',
          iconUrl: '/images/icon_128.png',
          title: GL('ls_17'),
          message: GL('ls_18')
        },function() {});
      }
    });
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
    var recoList=null;
    if(this.state.recoExtensions){
      if(!this.state.joinCommunity){
        discover=
          <div id="discover" className="section">
            {GL('ls_0')}(turn it on <Link to="/options">{GL('join_community')}here</Link>).
          </div>;
      }
      else{
        if(this.state.tabPerm){
          if((this.state.recoList||[]).length>0){
            var tempRecoList=this.state.recoList.sort(function(a,b){
              var upCountA=0;
              var downCountA=0;
              var upCountB=0;
              var downCountB=0;
              if(this.state.votes[a.appId]=='up'){
                upCountA=1;
              }
              else if(this.state.votes[a.appId]=='down'){
                downCountA=1;
              }
              if(this.state.votes[b.appId]=='up'){
                upCountB=1;
              }
              else if(this.state.votes[b.appId]=='down'){
                downCountB=1;
              }
              return (b.upVotes-b.downVotes+upCountB-downCountB)-(a.upVotes-a.downVotes+upCountA-downCountA);
            }.bind(this));
            recoList=(tempRecoList||[]).map(function(elem,index){
              var app=null;
              var appInfo=null;
              var appId=elem.appId;
              var upActive='';
              var downActive='';
              var upCount=0;
              var downCount=0;
              if(this.state.votes[appId]=='up'){
                upActive='active';
                upCount=1;
              }
              else if(this.state.votes[appId]=='down'){
                downActive='active';
                downCount=1;
              }
              if(this.state.appInfosWeb){
                appInfo=this.state.appInfosWeb[appId];
              }
              appInfo=appInfo||{tags:[],upVotes:0,downVotes:0};
              var active={};
              var temp=Object.keys(this.state.tags[appId]||{});
              for(var j=0;j<temp.length;j++){
                if(this.state.tags[appId][temp[j]]){
                  active[temp[j]]='active'
                }
              }
              var tags=<div className="tags">
                <div className="tagColumn">
                  <div onClick={this.toggleTag.bind(this,appId,'useful')} className={"tag wtf "+active['useful']}>{GL('useful')}<br />{appInfo.tags['useful']||0}</div>
                  <div onClick={this.toggleTag.bind(this,appId,'working')} className={"tag wtf "+active['working']}>{GL('working')}<br />{appInfo.tags['working']||0}</div>
                </div>
                <div className="tagColumn">
                  <div onClick={this.toggleTag.bind(this,appId,'laggy')} className={"tag soso "+active['laggy']}>{GL('laggy')}<br />{appInfo.tags['laggy']||0}</div>
                  <div onClick={this.toggleTag.bind(this,appId,'buggy')} className={"tag soso "+active['buggy']}>{GL('buggy')}<br />{appInfo.tags['buggy']||0}</div>
                </div>
                <div className="tagColumn">
                  <div onClick={this.toggleTag.bind(this,appId,'not_working')} className={"tag bad "+active['not_working']}>{GL('not_working')}<br />{appInfo.tags['not_working']||0}</div>
                  <div onClick={this.toggleTag.bind(this,appId,'ASM')} className={"tag bad "+active['ASM']}>{GL('ASM')}<br />{appInfo.tags['ASM']||0}</div>
                </div>
              </div>;
              var ratingBar=<div className="ratingBar front" style={{background:'linear-gradient(180deg, grey 100%, #01e301 0%)',width:'16px',height:'50px'}}></div>;
              if(appInfo.upVotes!=0||appInfo.downVotes!=0){
                ratingBar=<div className="ratingBar front" style={{background:'linear-gradient(180deg, red '+(appInfo.downVotes/(appInfo.upVotes+appInfo.downVotes)*100)+'%, #01e301 0%)',width:'16px',height:'50px'}}></div>
              }
              var rating=<div className="flip rating">
                {ratingBar}
                <div className="back ratingDetail">
                  <div className="upVotes">{GL('up')}<br/>{appInfo.upVotes}</div>
                  <div className="downVotes">{GL('down')}<br/>{appInfo.downVotes}</div>
                </div>
              </div>;
              app=
                <div className="app">
                  <a target="_blank" className="appBrief flip" href={"https://chrome.google.com/webstore/detail/"+appId}>
                    <div className="front">
                      <div className="name">{(this.state.infosGoogle[appId]||{}).name}</div>
                      <img src={(this.state.infosGoogle[appId]||{}).imgUrl} />
                    </div>
                    <div className="description back">
                      {(this.state.infosGoogle[appId]||{}).description}
                    </div>
                  </a>
                  <div className="appReview">
                    {tags}
                  </div>
                </div>;
              return(
                <div className="reco" key={index}>
                  <div className="votes">
                    <div className="upVotes flip" onClick={CW.bind(null,this.addReco.bind(this,appId,'up'),'Community','addReco','up')}>
                      <div className={"front arrowUp "+upActive}></div>
                      <div className="back count">{elem.upVotes+upCount}</div>
                    </div>
                    <div className="score">{elem.upVotes-elem.downVotes+upCount-downCount}</div>
                    <div className="downVotes flip" onClick={CW.bind(null,this.addReco.bind(this,appId,'down'),'Community','addReco','down')}>
                      <div className={"front arrowDown "+downActive}></div>
                      <div className="back count">{elem.downVotes+downCount}</div>
                    </div>
                  </div>
                  {app}
                </div>);
            }.bind(this));
          }
          else{
            recoList=<div className="noReco">{GL('ls_1')} {this.state.website}?</div>
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
              <input type="checkbox" className="hide" id="goReco" />
              <div></div>
              <label id="goRecoLabel" className="btn" htmlFor="goReco">{GL('recommend_extensions_for_this_website')}</label>
              <div id="recoBoard" className="section">
                <div className="actionBar">
                  <input id="keyword" onChange={this.updateFilter} placeholder={GL('filter')} type="text" />
                  <div className="addReco btn" onClick={CW.bind(null,this.addReco.bind(this,null),'Community','addReco','up')}>{capFirst(GL('recommend'))}</div>
                </div>
                {appList}
              </div>
            </div>);
          discover=(
            <div id="discover" className="section container">
              <h5>{GL('extensions_for')} <span className="website">{this.state.website}</span>:</h5>
              {recoList}
              {recoApps}
            </div>);
        }
        else{
          discover=(
          <div id="discover" className="section container">
            {GL('ls_2')} <div className="btn" onClick={this.requestTabsPermission}>{GL('enable')}</div>
          </div>);
        }
      }
    }
    
    return(
      <div id="overview">
        <Helmet
          title="Home"
        />
        <div className="manage container section">
          <h5>{GL('you_have')}</h5>
          <div className="status important">
            <Link to="/manage/app">
              {overview.app}
            </Link> {GL('app_s')},&nbsp;
            <Link to="/manage/extension">
              {overview.extension}
            </Link> {GL('extension_s')},&nbsp;
            <Link to="/manage/theme">
              {overview.theme}
            </Link> {GL('theme')}<br/>
            <Link to="/autoState">
              {(this.state.rules||[]).length}
            </Link>
            &nbsp;{GL('auto_state_rule_s')}
          </div>
        </div>
        {discover}
      </div>
    );
  }
});
