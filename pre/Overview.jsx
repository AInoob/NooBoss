import React from 'react';
import Helmet from 'react-helmet';
import AppBrief from './AppBrief.jsx';
import { Link } from 'react-router';

module.exports = React.createClass({
  displayName: 'Overview',
  getInitialState() {
    return {
      recoExtensions: false,
      filter: { type:'extension', keyword: ''},
      reco: {
        selected: {}
      },
      infosGoogle: {}
    };
  },
  componentDidMount() {
    shared.goTo = this.props.router.push;
    if(window.location.pathname.indexOf('popup') !=-1 ) {
      const page = getParameterByName('page');
      if(page) {
        this.props.router.push(page);
        if(page == 'overview') {
          this.getInitialData();
        }
      }
      else {
        get('defaultPage', (url) => {
          this.props.router.push(url || 'overview');
          if( !url || url == 'overview') {
            this.getInitialData();
          }
        });
      }
    }
    else {
      this.getInitialData();
    }
  },
  getInitialData() {
    chrome.management.getAll((appInfoList) => {
      for(let i = 0; i < appInfoList.length; i++) {
        appInfoList[i].iconUrl=this.getIconUrl(appInfoList[i]);
      }
      this.setState({ appInfoList });
    });
    get('autoStateRules', (rules) => {
      this.setState({ rules: JSON.parse(rules) });
    });
    get('userId', (userId) => {
      this.setState((prevState) => {
        prevState.userId=userId;
        return prevState;
      });
    });
    isOn('recoExtensions',() => {
      this.setState({ recoExtensions: true });
      chrome.permissions.contains({
        permissions: ['tabs']
      }, (result) => {
        if(result) {
          this.setState({ tabPerm: true });
        }
      });
      chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, (tabs) => {
        let url = "";
        if(tabs[0]) {
          url = tabs[0].url;
        }
        let website = extractDomain(url);
        if(website.match(/^undefined/)) {
          website = GL('all_websites');
        }
        $.ajax({
          type: 'POST',
          contentType: "application/json",
          data: JSON.stringify({website:website,userId:this.state.userId}),
          url: 'https://ainoob.com/api/nooboss/website'
        }).done((data) => {
          const appInfos = {};
          for(let i = 0; i < data.appInfos.length; i++) {
            const appId = data.appInfos[i].appId;
            appInfos[appId] = data.appInfos[i];
          }
          const votes={};
          const tags={};
          for(let i = 0; i < data.votes.length; i++) {
            const appId = data.votes[i].appId;
            votes[appId] = data.votes[i].action;
            tags[appId] = {};
          }
          for(let i = 0; i < data.tags.length; i++) {
            if(!tags[data.tags[i].appId]) {
              tags[data.tags[i].appId] = {};
            }
            tags[data.tags[i].appId][data.tags[i].tag] = data.tags[i].tagged;
          }
          const recoList = [];
          const temp = Object.keys(data.recos);
          for(let i = 0; i < temp.length; i++) {
            const appId = temp[i];
            let upVoted = 0;
            let downVoted = 0;
            if(votes[appId] == 'up') {
              upVoted = 1;
            }
            else if(votes[appId] == 'down') {
              downVoted = 1;
            }
            recoList.push({
              appId: appId,
              upVotes: data.recos[appId].upVotes-upVoted,
              downVotes: data.recos[appId].downVotes-downVoted
            });
          }
          this.setState({
            recoList: recoList,
            appInfosWeb: appInfos,
            website: website,
            votes: votes,
            tags: tags
          }, () => {
            this.getInfosGoogle();
            this.setState((prevState) => {
              prevState.recoList.sort((a,b) => {
                let upCountA = 0;
                let downCountA = 0;
                let upCountB = 0;
                let downCountB = 0;
                if(this.state.votes[a.appId] == 'up') {
                  upCountA = 1;
                }
                else if(this.state.votes[a.appId] == 'down') {
                  downCountA = 1;
                }
              if(this.state.votes[b.appId] == 'up') {
                upCountB = 1;
              }
              else if(this.state.votes[b.appId] == 'down') {
                downCountB = 1;
              }
              let compareVal = (b.upVotes-b.downVotes+upCountB-downCountB)-(a.upVotes-a.downVotes+upCountA-downCountA);
              if(compareVal == 0) {
                if(a.appId < b.appId) {
                  compareVal = 1;
                }
                else {
                  compareVal = -1;
                }
              }
              return compareVal;
              });
            });
          });
        });
      });
    });
  },
  select(appId) {
    this.setState((prevState) => {
      prevState.reco.selected[appId] = !prevState.reco.selected[appId];
      return prevState;
    });
  },
  updateFilter(e) {
    const id = e.target.id;
    const value = e.target.value;
    this.setState((prevState) => {
      prevState.filter[id]=value;
      return prevState;
    });
  },
  getFilteredList() {
    return (this.state.appInfoList || []).sort((a,b) => {
      if(a.enabled!=b.enabled){
        if(a.enabled){
          return -1;
        }
        else{
          return 1;
        }
      }
      else{
        return compare(a.name.toLowerCase(), b.name.toLowerCase());
      }
    }).map((appInfo) => {
      const filter = this.state.filter;
      const pattern=new RegExp(filter.keyword,'i');
      if((filter.type == 'all' || appInfo.type.indexOf(filter.type) != -1) && (filter.keyword == '' || pattern.exec(appInfo.name)) && appInfo.installType != 'development' && appInfo.updateUrl && appInfo.updateUrl.indexOf('https://clients2.google.com') != -1 && appInfo.homepageUrl && appInfo.homepageUrl.indexOf('https://ext.chrome.360.cn') == -1) {
        return appInfo;
      }
      else {
        return null;
      }
    });
  },
  getInfosGoogle() {
    for(let i = 0; i < this.state.recoList.length; i++) {
      const appId = this.state.recoList[i].appId;
      if(this.state.infosGoogle[appId]) {
        continue;
      }
      $.ajax({
        url:'https://chrome.google.com/webstore/detail/'+appId
      }).done(function(appId,data) {
        let a = data.indexOf('src="', data.indexOf('od-s-wa')) + 5;
        let b = data.indexOf('"', a);
        let imgUrl = data.slice(a, b);
        a = data.indexOf('<h1 class="e-f-w">') + 18;
        b = data.indexOf('</h1>', a);
        const name = data.slice(a, b);
        a = data.indexOf('itemprop="description">') + 23;
        b = data.indexOf('</', a);
        const description = data.slice(a, b);
        this.setState((prevState) => {
          prevState.infosGoogle[appId] = {
            imgUrl,
            name,
            description
          }
          return prevState;
        });
      }.bind(this,appId));
    }
  },
  getIconUrl(appInfo) {
    let iconUrl = undefined;
    if(appInfo.icons) {
      let maxSize = 0;
      for(let j = 0; j < appInfo.icons.length; j++) {
        const iconInfo = appInfo.icons[j];
        if(iconInfo.size > maxSize) {
          maxSize = iconInfo.size;
          iconUrl = iconInfo.url;
        }
      }
    }
    if(!iconUrl) {
      const canvas = document.createElement("canvas");
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      ctx.font = "120px Arial";
      ctx.fillStyle = "grey";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      ctx.fillText(appInfo.name[0], 22, 110);
      iconUrl = canvas.toDataURL();
    }
    return iconUrl;
  },
  toggleTag(appId, tag) {
    let inc=1;
    let tagged=true;
    let action='tag';
    if(this.state.tags[appId] && this.state.tags[appId][tag]){
      action = 'unTag';
      tagged = false;
      inc = -1;
    }
    CW(() => {}, 'Community', 'addTag', action);
    const reco = {
      userId: this.state.userId,
      appId,
      tag,
      action
    };
    $.ajax({
      type: 'POST',
      url: "https://ainoob.com/api/nooboss/reco/app/tag",
      contentType: "application/json",
      data: JSON.stringify(reco)
    }).done((data) => {
      this.setState((prevState) => {
        if(!prevState.appInfosWeb[appId]) {
          prevState.appInfosWeb[appId] = {appId,tags: {}};
        }
        if(!prevState.appInfosWeb[appId].tags[tag]) {
          prevState.appInfosWeb[appId].tags[tag] = 1;
        }
        else {
          prevState.appInfosWeb[appId].tags[tag] += inc;
        }
        if(!prevState.tags[appId]) {
          prevState.tags[appId]={};
        }
        prevState.tags[appId][tag] = tagged;
        return prevState;
      });
    });
  },
  addReco(appId, action) {
    const reco = {
      userId: this.state.userId,
      website: this.state.website,
    };
    if(appId) {
      if(this.state.votes[appId]!=action){
        reco.action = action;
      }
      else{
        reco.action = null;
      }
      reco.appIds = [appId];
    }
    else {
      $('#goReco').prop('checked',false);
      reco.action = 'up';
      reco.appIds = Object.keys(this.state.reco.selected).filter((appId) => {
        return this.state.votes[appId] != 'up'&&this.state.reco.selected[appId];
      });
      this.setState((prevState) => {
        prevState.reco.selected = {};
        return prevState;
      });
    }
    $.ajax({
      type:'POST',
      url:"https://ainoob.com/api/nooboss/reco/website",
      contentType: "application/json",
      data: JSON.stringify(reco)
    }).done((data) => {
      this.setState((prevState) => {
        for(let i = 0; i < reco.appIds.length; i++) {
          const appId = reco.appIds[i];
          prevState.votes[appId] = reco.action;
          let listed = false;
          for(let j = 0; j < prevState.recoList.length; j++) {
            if(prevState.recoList[j].appId==appId) {
              listed = true;
            }
          }
          if(!listed) {
            prevState.recoList.push({
              appId,
              upVotes: 0,
              downVotes: 0
            });
          }
        }
        return prevState;
      }, this.getInfosGoogle);
    });
  },
  requestTabsPermission() {
    chrome.notifications.create('', {
      type: 'basic',
      iconUrl: '/images/icon_128.png',
      title: GL('ls_11'),
      message: GL('ls_12')
    }, () => {});
    chrome.permissions.request({
      permissions: ['tabs']
    }, (granted) => {
      if(granted) {
        chrome.notifications.create('', {
          type: 'basic',
          iconUrl: '/images/icon_128.png',
          title: GL('ls_15'),
          message: GL('ls_16')
        }, () => {});
      }
      else {
        chrome.notifications.create('', {
          type: 'basic',
          iconUrl: '/images/icon_128.png',
          title: GL('ls_17'),
          message: GL('ls_18')
        }, () => {});
      }
    });
  },
  render() {
    const appInfoList = this.state.appInfoList||[];
    const overview = {};
    overview.app = 0;
    overview.extension = 0;
    overview.theme = 0;
    for(let i = 0; i < appInfoList.length; i++) {
      const appInfo = appInfoList[i];
      if(appInfo.type == 'extension') {
        overview.extension++;
      }
      else if(appInfo.type.indexOf('app') != -1) {
        overview.app++;
      }
      else if(appInfo.type == 'theme') {
        overview.theme++;
      }
    }
    let discover = null;
    let recoList = null;
    if(!this.state.recoExtensions) {
      discover = (
        <div id="discover" className="section">
        </div>
      );
    }
    else {
      if(this.state.tabPerm) {
        if((this.state.recoList || []).length > 0) {
          const tempRecoList = this.state.recoList.sort((a,b) => {
            let upCountA = 0;
            let downCountA = 0;
            let upCountB = 0;
            let downCountB = 0;
            if(this.state.votes[a.appId] == 'up') {
              upCountA = 1;
            }
            else if(this.state.votes[a.appId] == 'down') {
              downCountA = 1;
            }
            if(this.state.votes[b.appId] == 'up') {
              upCountB = 1;
            }
            else if(this.state.votes[b.appId] == 'down') {
              downCountB = 1;
            }
            let compareVal = (b.upVotes-b.downVotes+upCountB-downCountB)-(a.upVotes-a.downVotes+upCountA-downCountA);
            if(compareVal == 0) {
              if(a.appId < b.appId) {
                compareVal = 1;
              }
              else {
                compareVal = -1;
              }
            }
            return compareVal;
          });
          recoList=(tempRecoList || []).map((elem,index) => {
            let app=null;
            let appInfo=null;
            const appId=elem.appId;
            let upActive='';
            let downActive='';
            let upCount=0;
            let downCount=0;
            if(this.state.votes[appId] == 'up') {
              upActive = 'active';
              upCount = 1;
            }
            else if(this.state.votes[appId] == 'down') {
              downActive = 'active';
              downCount = 1;
            }
            if(this.state.appInfosWeb) {
              appInfo = this.state.appInfosWeb[appId];
            }
            appInfo = appInfo || {tags: [], upVotes: 0, downVotes: 0};
            const active = {};
            const temp = Object.keys(this.state.tags[appId] || {});
            for(let j = 0; j < temp.length; j++) {
              if(this.state.tags[appId][temp[j]]) {
                active[temp[j]] = 'active';
              }
            }
            const tags = (
              <div className="tags">
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
              </div>
            );
            let ratingBar = (
              <div className="ratingBar front" style={{background:'linear-gradient(180deg, grey 100%, #01e301 0%)',width:'16px',height:'50px'}}>
              </div>
            );
            if(appInfo.upVotes != 0 || appInfo.downVotes != 0) {
              ratingBar = (
                <div className="ratingBar front" style={{background:'linear-gradient(180deg, red '+(appInfo.downVotes/(appInfo.upVotes+appInfo.downVotes)*100)+'%, #01e301 0%)',width:'16px',height:'50px'}}>
                </div>
              );
            }
            const rating = (
              <div className="flip rating">
                {ratingBar}
                <div className="back ratingDetail">
                  <div className="upVotes">{GL('up')}<br/>{appInfo.upVotes}</div>
                  <div className="downVotes">{GL('down')}<br/>{appInfo.downVotes}</div>
                </div>
              </div>
            );
            app = (
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
              </div>
            );
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
          });
        }
        else {
          recoList = <div className="noReco">{GL('ls_1')} {this.state.website}?</div>;
        }
        const appList = this.getFilteredList().map((appInfo,index) => {
          if(appInfo){
            let dimmer = 'dimmer';
            if(this.state.reco.selected[appInfo.id]) {
              dimmer = 'nonDimmer';
            }
            return (
                <AppBrief isAutoState="true" select={this.select.bind(this,appInfo.id)} dimmer={dimmer} key={index} info={appInfo} />
            );
          }
        });
        const recoApps = (
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
        discover = (
          <div id="discover" className="section container">
            <h5>{GL('extensions_for')} <span className="website">{this.state.website}</span>:</h5>
            {recoList}
            {recoApps}
          </div>);
      }
      else {
        discover = (
        <div id="discover" className="section container">
          {GL('ls_2')} <div className="btn" onClick={this.requestTabsPermission}>{GL('enable')}</div>
        </div>);
      }
    }
    return (
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
