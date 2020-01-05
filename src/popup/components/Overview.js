import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  overviewUpdateBello,
  overviewToggleRecommendExtensions
} from '../actions';
import {
  sendMessage,
  GLS,
  GL,
  getDomainFromUrl,
  getCurrentUrl,
  ajax,
  promisedGet
} from '../../utils';
import styled from 'styled-components';
import Selector from './Selector';

const OverviewDiv = styled.div`
  padding-left: 16px;
  #recommendExtensionsButton {
    display: ${(props) =>
      props.recommendExtensions ? 'inline-block' : 'none'};
    margin-left: 16px;
  }
  #selectExtensionsButton {
    &:after {
      content: '▼';
      margin-left: 4px;
      transform: ${(props) =>
        props.recommendExtensions ? 'rotate(180deg)' : 'rotate(0deg)'};
      display: block;
      float: right;
      transition: transform 0.309s;
    }
  }
  #recommendExtensionsDiv {
    display: ${(props) => (props.recommendExtensions ? 'block' : 'none')};
  }
  .recommendedExtension {
    clear: both;
    margin-bottom: 10px;
    overflow: hidden;
    height: 111px;
    #voteDiv {
      padding-top: 20px;
      text-align: center;
      float: left;
      width: 50px;
      .arrowUp,
      .arrowDown {
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
      }
      .flip {
        text-align: center;
        margin-top: 7px;
        height: 24px;
        width: 100%;
        position: relative;
        cursor: pointer;
        .arrowUp {
          border-bottom: 10px solid rgba(128, 128, 128, 0.46);
        }
        .arrowDown {
          border-top: 10px solid rgba(128, 128, 128, 0.46);
        }
        .front,
        .back {
          position: absolute;
          backface-visibility: hidden;
          transition: transform 0.309s;
        }
        .front {
          left: 15px;
          transform: rotateY(0deg);
        }
        .back {
          width: 100%;
          transform: rotateY(180deg);
        }
        &:hover {
          .front {
            transform: rotateY(180deg);
          }
          .back {
            transform: rotateY(0deg);
          }
        }
        .arrowDown {
          margin-top: 4px;
        }
      }
      .flip.active {
        color: ${() => shared.themeMainColor};
        .arrowUp {
          border-bottom: 10px solid ${() => shared.themeMainColor};
        }
        .arrowDown {
          border-top: 10px solid ${() => shared.themeMainColor};
        }
      }
    }
    #extensionInfo {
      width: 277px;
      height: 86px;
      margin-top: 16px;
      position: relative;
      float: left;
      cursor: pointer;
      color: ${() => shared.themeMainColor};
      #icon,
      #name,
      #description {
        transition: transform 0.309s;
        backface-visibility: hidden;
        position: absolute;
        top: 8px;
        display: block;
        transform: rotateY(0deg);
      }
      #icon {
        left: 0px;
        height: 32px;
        width: 32px;
      }
      #name {
        left: 40px;
        width: 220px;
        height: 32px;
        font-size: 16px;
      }
      #description {
        left: 0px;
        transform: rotateY(180deg);
        width: 100%;
      }
      &:hover {
        #icon,
        #name {
          transform: rotateY(180deg);
        }
        #description {
          transform: rotateY(0deg);
        }
      }
    }
    #tags {
      float: left;
      width: 400px;
      margin: auto;
      .tagColumn {
        width: 111px;
        float: left;
        margin-left: 16px;
        .tag {
          filter: invert(50%);
          width: 100%;
          text-align: center;
          cursor: pointer;
          color: ${() => shared.themeMainColor};
          box-shadow: ${() => shared.themeMainColor} 0px 0px 0px 1px;
          &:hover {
            box-shadow: ${() => shared.themeMainColor} 0px 0px 13px;
          }
          margin-top: 16px;
        }
        .tag.active {
          font-weight: bold;
          border: 1px solid ${() => shared.themeMainColor};
          filter: invert(0%);
        }
      }
    }
  }
`;

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    overview: state.overview
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    ...ownProps,
    updateBello: (bello) => {
      dispatch(overviewUpdateBello(bello));
    },
    toggleRecommendExtensions: () => {
      dispatch(overviewToggleRecommendExtensions());
    }
  };
};

class Overview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recommendedExtensionList: [],
      currentWebsite: 'ainoob.com',
      maxReco: 10,
      recommendExtensionList: [],
      lastScrollDate: 0,
      joinCommunity: false,
      recoExtensions: false,
      historyInstallEvents: 0,
      historyRemoveEvents: 0,
      historyUpdateEvents: 0,
      historyEnableEvents: 0,
      historyDisableEvents: 0
    };
    this.getExtensionInfoWeb = this.getExtensionInfoWeb.bind(this);
    this.initialize();
  }
  async initialize() {
    if (
      !(await promisedGet('joinCommunity')) ||
      !(await promisedGet('recoExtensions'))
    ) {
      return;
    }
    this.setState({ joinCommunity: true, recoExtensions: true });
    const url = await getCurrentUrl();
    const userId = await promisedGet('userId');
    this.setState({ userId });
    let domain = getDomainFromUrl(url);
    let currentWebsite = domain;
    if (domain.indexOf('.') == -1) {
      domain = 'all_websites';
      currentWebsite = GL(domain);
    }
    this.setState({ currentWebsite });
    let data = await ajax({
      type: 'POST',
      data: JSON.stringify({ website: currentWebsite, userId }),
      contentType: 'application/json',
      url: 'https://ainoob.com/api/nooboss/website'
    });
    data = JSON.parse(data);
    const recommendedExtensionList = [];
    for (let i = 0; i < data.appInfos.length; i++) {
      const extensionInfo = data.appInfos[i];
      recommendedExtensionList.push({
        id: extensionInfo.appId,
        tags: extensionInfo.tags,
        votes: data.recos[extensionInfo.appId]
      });
    }
    const tags = {};
    for (let i = 0; i < data.tags.length; i++) {
      const tag = data.tags[i];
      tags[tag.appId] = tags[tag.appId] || {};
      tags[tag.appId][tag.tag] = tag.tagged;
    }
    const votes = {};
    for (let i = 0; i < data.votes.length; i++) {
      const vote = data.votes[i];
      votes[vote.appId] = vote.action;
    }
    this.setState(
      { recommendedExtensionList, tags, votes },
      this.getExtensionInfoWeb
    );
  }
  getExtensionInfoWeb() {
    const extensionList = [];
    const recommendedExtensionList = this.state.recommendedExtensionList.sort(
      (a, b) => {
        let temp =
          b.votes.upVotes -
          b.votes.downVotes -
          (a.votes.upVotes - a.votes.downVotes);
        if (temp != 0) {
          return temp;
        } else {
          return a.id.localeCompare(b.id);
        }
      }
    );
    for (
      let i = 0;
      i < recommendedExtensionList.length && i < this.state.maxReco;
      i++
    ) {
      const id = recommendedExtensionList[i].id;
      if (!this.props.extensionInfoWeb[id]) {
        extensionList.push(id);
      }
    }
    this.props.getExtensionInfoWeb(extensionList);
  }
  componentDidMount() {
    this.props.updateScrollChild(this);
    shared.getAllExtensions();
    shared.getGroupList();
    shared.getAutoStateRuleList();
  }
  async componentWillUnmount() {
    this.props.updateScrollChild(null);
  }
  async toggleTag(id, tag) {
    const tags = this.state.tags[id] || {};
    let action = 'tag';
    if (tags[tag]) {
      action = 'unTag';
    }
    const userId = await promisedGet('userId');
    const reco = {
      userId,
      appId: id,
      tag,
      action
    };
    await ajax({
      type: 'POST',
      url: 'https://ainoob.com/api/nooboss/reco/app/tag',
      contentType: 'application/json',
      data: JSON.stringify(reco)
    });
    this.setState((prevState) => {
      prevState.tags[id] = prevState.tags[id] || {};
      prevState.tags[id][tag] = !prevState.tags[id][tag];
      return prevState;
    });
  }
  vote(idList, action, clickArrow) {
    return new Promise(async (resolve) => {
      const userId = await promisedGet('userId');
      if (clickArrow) {
        if (this.state.votes[idList[0]] == action) {
          action = null;
        }
      }
      const x = {};
      for (let i = 0; i < idList.length; i++) {
        const id = idList[i];
        x[idList[i]] = { upVotes: 0, downVotes: 0 };
        if (action == null) {
          x[id][this.state.votes[id] == 'up' ? 'upVotes' : 'downVotes'] = -1;
        } else if (action == 'up') {
          if (this.state.votes[id] == 'down') {
            x[id].upVotes = 1;
            x[id].downVotes = -1;
          } else if (!this.state.votes[id]) {
            x[id].upVotes = 1;
          }
        } else if (action == 'down') {
          if (this.state.votes[id] == 'up') {
            x[id].upVotes = -1;
            x[id].downVotes = 1;
          } else if (!this.state.votes[id]) {
            x[id].downVotes = 1;
          }
        }
      }
      this.setState((prevState) => {
        for (let i = 0; i < idList.length; i++) {
          const id = idList[i];
          prevState.votes[id] = action;
          const index = prevState.recommendedExtensionList.findIndex(
            (elem) => elem.id == id
          );
          if (index != -1) {
            prevState.recommendedExtensionList[index].votes.upVotes +=
              x[id].upVotes;
            prevState.recommendedExtensionList[index].votes.downVotes +=
              x[id].downVotes;
          }
        }
        return prevState;
      });
      await ajax({
        type: 'POST',
        url: 'https://ainoob.com/api/nooboss/reco/website',
        contentType: 'application/json',
        data: JSON.stringify({
          appIds: idList,
          action,
          userId,
          website: this.state.currentWebsite
        })
      });
      resolve();
    });
  }
  async reco(type, id) {
    switch (type) {
      case 'selectExtension':
        this.setState((prevState) => {
          const index = prevState.recommendExtensionList.indexOf(id);
          if (index == -1) {
            prevState.recommendExtensionList.push(id);
          } else {
            prevState.recommendExtensionList.splice(index, 1);
          }
          return prevState;
        });
        break;
      case 'recommendExtensions':
        this.props.toggleRecommendExtensions();
        await this.vote(this.state.recommendExtensionList, 'up', false);
        sendMessage({
          job: 'notify',
          title: GL('recommend_extensions'),
          message: GL('x_2'),
          duration: 5
        });
        this.setState({ recommendExtensionList: [] });
        break;
    }
  }
  onScroll() {
    const noobossDiv = document.getElementById('noobossDiv');
    if (
      noobossDiv.scrollHeight -
        (noobossDiv.scrollTop + noobossDiv.clientHeight) <
      200
    ) {
      const lastScrollDate = Date.now();
      if (this.state.lastScrollDate + 200 < lastScrollDate) {
        this.setState(
          { maxReco: this.state.maxReco + 10, lastScrollDate },
          this.getExtensionInfoWeb
        );
      }
    }
  }
  render() {
    const { extensions, groupList, autoStateRuleList } = this.props;
    const overview = {
      app: Object.keys(extensions).filter((id) => extensions[id].isApp == true)
        .length,
      extension: Object.keys(extensions).filter(
        (id) => extensions[id].type == 'extension'
      ).length,
      theme: Object.keys(extensions).filter(
        (id) => extensions[id].type == 'theme'
      ).length,
      group: groupList.length,
      autoStateRule: autoStateRuleList.length
    };
    const recommendedExtensionList = this.state.recommendedExtensionList
      .sort((a, b) => {
        let temp =
          b.votes.upVotes -
          b.votes.downVotes -
          (a.votes.upVotes - a.votes.downVotes);
        if (temp != 0) {
          return temp;
        } else {
          return a.id.localeCompare(b.id);
        }
      })
      .filter((elem, index) => index < this.state.maxReco)
      .filter(
        (elem) =>
          this.props.extensionInfoWeb && this.props.extensionInfoWeb[elem.id]
      )
      .map((elem, index) => {
        const extensionWeb = elem;
        const active = {};
        const myTagList = Object.keys(this.state.tags[elem.id] || {});
        for (let i = 0; i < myTagList.length; i++) {
          if (
            this.state.tags[elem.id] &&
            this.state.tags[elem.id][myTagList[i]]
          ) {
            active[myTagList[i]] = 'active';
          }
        }
        const myVote = this.state.votes[elem.id] || '';
        const votes = extensionWeb.votes;
        const extensionInfoWeb = this.props.extensionInfoWeb[elem.id] || {};
        return (
          <div className='recommendedExtension' key={index}>
            <div id='voteDiv'>
              <div
                className={'flip ' + (myVote == 'up' ? 'active' : '')}
                onClick={this.vote.bind(this, [elem.id], 'up', true)}>
                <div className='front arrowUp' />
                <div className='back'>{votes.upVotes}</div>
              </div>
              <div className='vote'>{votes.upVotes - votes.downVotes}</div>
              <div
                className={'flip ' + (myVote == 'down' ? 'active' : '')}
                onClick={this.vote.bind(this, [elem.id], 'down', true)}>
                <div className='front arrowDown' />
                <div className='back'>{votes.downVotes}</div>
              </div>
            </div>
            <div
              id='extensionInfo'
              onClick={sendMessage.bind(
                null,
                { job: 'openWebStore', id: elem.id },
                () => {}
              )}>
              <img id='icon' src={extensionInfoWeb.iconDataURL} />
              <span
                id='name'
                dangerouslySetInnerHTML={{ __html: extensionInfoWeb.name }}
              />
              <br />
              <span
                id='description'
                dangerouslySetInnerHTML={{
                  __html: extensionInfoWeb.description
                }}
              />
            </div>
            <div id='tags'>
              <div className='tagColumn'>
                <div
                  onClick={this.toggleTag.bind(this, elem.id, 'useful')}
                  className={'tag ' + active['useful']}>
                  {GL('useful')}
                  <br />
                  {extensionWeb.tags['useful'] || 0}
                </div>
                <div
                  onClick={this.toggleTag.bind(this, elem.id, 'working')}
                  className={'tag ' + active['working']}>
                  {GL('working')}
                  <br />
                  {extensionWeb.tags['working'] || 0}
                </div>
              </div>
              <div className='tagColumn'>
                <div
                  onClick={this.toggleTag.bind(this, elem.id, 'laggy')}
                  className={'tag ' + active['laggy']}>
                  {GL('laggy')}
                  <br />
                  {extensionWeb.tags['laggy'] || 0}
                </div>
                <div
                  onClick={this.toggleTag.bind(this, elem.id, 'buggy')}
                  className={'tag ' + active['buggy']}>
                  {GL('buggy')}
                  <br />
                  {extensionWeb.tags['buggy'] || 0}
                </div>
              </div>
              <div className='tagColumn'>
                <div
                  onClick={this.toggleTag.bind(this, elem.id, 'not_working')}
                  className={'tag ' + active['not_working']}>
                  {GL('not_working')}
                  <br />
                  {extensionWeb.tags['not_working'] || 0}
                </div>
                <div
                  onClick={this.toggleTag.bind(this, elem.id, 'ASM')}
                  className={'tag ' + active['ASM']}>
                  {GL('ASM')}
                  <br />
                  {extensionWeb.tags['ASM'] || 0}
                </div>
              </div>
            </div>
          </div>
        );
      });
    let noReco = null;
    if (recommendedExtensionList.length == 0) {
      noReco = <span>{GL('x_1').replace('X', this.state.currentWebsite)}</span>;
    }
    let recommendSection = null;
    if (this.state.joinCommunity && this.state.recoExtensions) {
      recommendSection = (
        <div>
          <h2>
            {GL('recommended_for').replace('X', this.state.currentWebsite)}
          </h2>
          {noReco}
          <button
            onClick={this.props.toggleRecommendExtensions}
            id='selectExtensionsButton'>
            {GL('select_extensions')}
          </button>
          <button
            onClick={this.reco.bind(this, 'recommendExtensions')}
            className={
              this.state.recommendExtensionList.length > 0 ? '' : 'inActive'
            }
            id='recommendExtensionsButton'>
            {GL('recommend')}
          </button>
          <div id='recommendExtensionsDiv'>
            <Selector
              viewMode={this.props.viewMode}
              actionBar={true}
              filterType='chromeWebStoreExtensionOnly'
              icons={this.props.icons}
              extensions={this.props.extensions}
              selectedList={this.state.recommendExtensionList}
              select={this.reco.bind(this, 'selectExtension')}
            />
          </div>
          {recommendedExtensionList}
        </div>
      );
    }
    return (
      <OverviewDiv
        recommendExtensions={this.props.overview.recommendExtensions}>
        <h2>{GL('you_have')}</h2>
        <div className='line'>
          <span>
            {overview.extension + ' ' + GLS('extension_s', overview.extension)}
          </span>
          ,<span>{' ' + overview.app + ' ' + GLS('app_s', overview.app)}</span>,
          <span>{' ' + overview.theme + ' ' + GL('theme')}</span>
        </div>
        <div className='line'>
          <span>{overview.group + ' ' + GLS('group_s', overview.group)}</span>
        </div>
        <div className='line'>
          <span>
            {overview.autoStateRule +
              ' ' +
              GLS('autoState_rule_s', overview.autoStateRule)}
          </span>
        </div>
        {recommendSection}
      </OverviewDiv>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Overview);
