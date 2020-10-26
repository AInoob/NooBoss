import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Selector from './Selector';
import { updateAutoStateRule } from '../actions';
import { Groupy, Removy, Edity } from '../../icons';
import { GL, copy, sendMessage, getA, getCurrentUrl } from '../../utils';

const AutoStateDiv = styled.div`
  h2 {
    font-size: 1.8em;
  }
  #selectedList {
    width: 100%;
    overflow: hidden;
    min-height: 36px;
    .icon {
      width: 36px;
      height: 36px;
      float: left;
      margin-right: 9px;
      img,
      svg {
        width: 100%;
        height: 100%;
      }
    }
  }
  #rule {
    width: 100%;
    font-size: 1.2em;
    .line {
      margin-bottom: 10px;
      .chunk {
        float: left;
        &:nth-child(1) {
          width: 100px;
          font-weight: bold;
          font-size: 1.1em;
        }
        &:nth-child(2) {
          width: 600px;
          #matchUrl {
            width: 370px;
          }
          .icon {
            width: 36px;
            height: 36px;
            margin-right: 9px;
            float: left;
          }
        }
      }
    }
  }
  #rules {
    width: 100%;
    font-size: 1.2em;
    table-layout: fixed;
    thead {
      tr {
        th {
          word-wrap: break-word;
          text-align: left;
          &:nth-child(1) {
            width: 24px;
          }
          &:nth-child(2) {
            width: 166px;
          }
          &:nth-child(3) {
            width: 100px;
          }
          &:nth-child(4) {
            width: 222px;
          }
          &:nth-child(5) {
            width: 66px;
          }
          &:nth-child(6) {
            width: 44px;
          }
          &:nth-child(7),
          &:nth-child(8) {
            width: 26px;
          }
        }
      }
    }
    tbody {
      tr {
        td {
          word-wrap: break-word;
          &:nth-child(2) {
            &::-webkit-scrollbar {
              display: none;
            }
            overflow-y: scroll;
            img,
            svg {
              width: 32px;
              height: 32px;
              float: left;
              margin-right: 9px;
            }
          }
          &:nth-child(6) {
            text-align: center;
            svg {
              width: 24px;
              height: 24px;
              cursor: pointer;
            }
          }
          &:nth-child(7),
          &:nth-child(8) {
            text-align: center;
            svg {
              width: 24px;
              height: 24px;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
  #setAsCurrentWebsite {
    margin-left: 16px;
  }
`;

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    autoState: state.autoState
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    ...ownProps,
    updateAutoStateRule: (rule) => {
      dispatch(updateAutoStateRule(rule));
    }
  };
};

class AutoState extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rule: {
        action: 'enableOnly',
        ids: [],
        match: {
          isWildcard: false,
          url: ''
        }
      }
    };
  }
  getIcon(ids) {
    if (!ids) {
      return null;
    }
    const { extensions, groupList, icons } = this.props;
    return ids.map((id, index) => {
      let img;
      let icon;
      if (id.match(/^NooBoss-Group/)) {
        name = (groupList.filter((elem) => elem.id == id)[0] || {}).name;
        if (icons[id + '_icon']) {
          src = icons[id + '_icon'];
          img = <img title={name} src={icons[src]} />;
        } else {
          img = <Groupy title={name} color={shared.themeMainColor} />;
        }
      } else {
        const extension = extensions[id] || {};
        if (extension.icons && extension.icons.length > 0) {
          icon = extension.icons[extension.icons.length - 1].url;
        } else {
          icon = extension.icon;
        }
        img = <img title={extension.name} src={icon} />;
      }
      return (
        <div key={index} className='icon' title={name}>
          {img}
        </div>
      );
    });
  }
  updateRule(type, x) {
    const rule = this.props.autoState.rule || this.state.rule;
    switch (type) {
      case 'select':
        const matchIndex = rule.ids.indexOf(x);
        if (matchIndex == -1) {
          rule.ids.push(x);
        } else {
          rule.ids.splice(matchIndex, 1);
        }
        break;
      case 'action':
        rule.action = x.target.value;
        break;
      case 'url':
        rule.match.url = x.target.value;
        break;
      case 'pattern':
        rule.match.isWildcard = x.target.value == 'wildcard' ? true : false;
        break;
    }
    this.props.updateAutoStateRule(rule);
  }
  addRule() {
    const rule = this.props.autoState.rule;
    const rules = copy(this.props.autoStateRuleList);
    rules.push(rule);
    sendMessage({
      job: 'autoStateRulesUpdate',
      rules,
      action: 'addRule',
      id: rules.length
    });
    this.props.updateAutoStateRule({
      action: 'enableOnly',
      ids: [],
      match: {
        isWildcard: false,
        url: ''
      },
      disabled: false
    });
  }
  editRule(index) {
    const rules = copy(this.props.autoStateRuleList);
    const rule = rules.splice(index, 1)[0];
    sendMessage({
      job: 'autoStateRulesUpdate',
      rules,
      action: 'editRule',
      id: index
    });
    this.props.updateAutoStateRule(rule);
  }
  deleteRule(index) {
    const rules = copy(this.props.autoStateRuleList);
    rules.splice(index, 1);
    sendMessage({
      job: 'autoStateRulesUpdate',
      rules,
      action: 'deleteRule',
      id: index
    });
  }
  toggleRule(index) {
    const rules = copy(this.props.autoStateRuleList);
    rules[index].disabled = !rules[index].disabled;
    sendMessage({
      job: 'autoStateRulesUpdate',
      rules,
      action: 'toggleRule',
      id: index
    });
  }
  async setCurrentWebsite() {
    const rule = this.props.autoState.rule || this.state.rule;
    const url = await getCurrentUrl();
    rule.match.url = getA(url).origin;
    this.props.updateAutoStateRule(rule);
  }
  render() {
    const ruleList = this.props.autoStateRuleList;
    const rule = this.props.autoState.rule || this.state.rule;
    const selectedList = this.getIcon(rule.ids);
    const ruleRows = ruleList.map((rule2, index) => {
      const icon = this.getIcon(rule2.ids);
      return (
        <tr className='rule' key={index}>
          <td>{index + 1}</td>
          <td>{icon}</td>
          <td>{GL(rule2.action)}</td>
          <td>{rule2.match.url}</td>
          <td>{GL(rule2.match.isWildcard ? 'wildcard' : 'RegExp')}</td>
          <td>
            <input
              type='checkbox'
              checked={rule2.disabled ? false : true}
              onChange={() => {}}
              id={'switch-' + index}
              className='switch-input'
            />
            <label
              htmlFor={'switch-' + index}
              className='switch-label'
              onClick={this.toggleRule.bind(this, index)}>
              <span className='toggle--on'></span>
              <span className='toggle--off'></span>
            </label>
          </td>
          <td onClick={this.editRule.bind(this, index)}>
            <Edity color={shared.themeMainColor} />
          </td>
          <td onClick={this.deleteRule.bind(this, index)}>
            <Removy color={shared.themeMainColor} />
          </td>
        </tr>
      );
    });
    return (
      <AutoStateDiv>
        <h1>{GL('rules')}</h1>
        <table id='rules'>
          <thead>
            <tr>
              <th>#</th>
              <th>{GL('target_s')}</th>
              <th>{GL('action')}</th>
              <th>{GL('match')}</th>
              <th>{GL('pattern')}</th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>{ruleRows}</tbody>
        </table>
        <h1>{GL('new_rule')}</h1>
        <div id='rule'>
          <div className='line'>
            <div className='chunk'>{GL('target_s')}</div>
            <div className='chunk'>
              <div id='selectedList'>{selectedList}</div>
            </div>
          </div>
          <div className='line'>
            <div className='chunk'>{GL('action')}</div>
            <div className='chunk'>
              <select
                value={rule.action}
                onChange={this.updateRule.bind(this, 'action')}>
                <option value='enableOnly'>{GL('enableOnly')}</option>
                <option value='disableOnly'>{GL('disableOnly')}</option>
                <option value='enableWhen'>{GL('enableWhen')}</option>
                <option value='disableWhen'>{GL('disableWhen')}</option>
              </select>
            </div>
          </div>
          <div className='line'>
            <div className='chunk'>{GL('match')}</div>
            <div className='chunk'>
              <input
                id='matchUrl'
                // https://github.com/facebook/react/issues/3926
                defaultValue={rule.match.url}
                onChange={this.updateRule.bind(this, 'url')}
              />
              <button
                id='setAsCurrentWebsite'
                onClick={this.setCurrentWebsite.bind(this)}>
                {GL('set_as_current_website')}
              </button>
            </div>
          </div>
          <div className='line'>
            <div className='chunk'>{GL('pattern')}</div>
            <div className='chunk'>
              <select
                value={rule.match.isWildcard ? 'wildcard' : 'RegExp'}
                onChange={this.updateRule.bind(this, 'pattern')}>
                <option value='RegExp'>{GL('RegExp')}</option>
                <option value='wildcard'>{GL('wildcard')}</option>
              </select>
            </div>
          </div>
        </div>
        <button onClick={this.addRule.bind(this)}>{GL('add_rule')}</button>
        <h2>{GL('select_target_s')}</h2>
        <Selector
          viewMode={this.props.viewMode}
          icons={this.props.icons}
          groupList={this.props.groupList}
          extensions={this.props.extensions}
          actionBar={true}
          select={this.updateRule.bind(this, 'select')}
          selectedList={rule.ids}
        />
      </AutoStateDiv>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AutoState);
