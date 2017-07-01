import React from 'react';
import styled from 'styled-components';

const GroupDiv = styled.div`
  margin-bottom: ${props => props.isLast ? '16px' : '0px'};
  border-bottom: ${props => props.isLast ? 'none' : '1px solid #c27ae8'};
  overflow: hidden;
  width: 100%;
  min-height: 33px;
  padding-top: 5px;
  position: relative;
  #on, #off, #duplicate, #remove, #more{
    cursor: pointer;
    background-repeat: no-repeat;
    display: block;
    background-size: 17px 17px;
    width: 22px;
    height: 22px;
    position: absolute;
    top: 5px;
  }
  #on{
    left: 354px;
    background-image: url(/thirdParty/power-button-on.svg);
  }
  #off{
    background-image: url(/thirdParty/power-button-off.svg);
    left: 383px;
  }
  #duplicate{
    background-image: url(/thirdParty/copy.svg);
    left: 410px;
  }
  #remove{
    background-image: url(/thirdParty/remove.svg);
    left: 440px;
  }
  #more{
    background-image: url(/thirdParty/more.svg);
    top: ${props => props.onMore ? '0px' : '5px'};
    left: ${props => props.onMore ? '464px' : '470px'};
    transform: ${props => props.onMore ? 'rotate(180deg)' : 'rotate(0deg)'};
  }
  #icon{
    left: 0px;
    display: block;
    position: absolute;
    width: 23px;
  }
  #name{
    left: 36px;
    position: absolute;
    border-bottom: none;
    height: 18px;
    width: 300px;
  }
  #detail{
    margin-top: 33px;
    display: ${props => props.onMore ? 'block' : 'none'};
    border-bottom: 2px solid #c27ae8;
    overflow: hidden;
    padding-bottom: 8px;
    margin-bottom: 8px;
  }
`;

module.exports = React.createClass({
  render() {
    const groupInfo = this.props.groupInfo;
    return (
      <GroupDiv onMore={this.props.onMore} isLast={this.props.isLast}>
        <label id="on" onClick={this.props.toggle.bind(null, this.props.index, 'enable')} />
        <label id="off" onClick={this.props.toggle.bind(null, this.props.index, 'disable')} />
        <img id="icon" src={"chrome://extension-icon/daoldhappdmckdbifgkppchkehjlnbpo/128/0"} />
        <input id="name" placeholder={GL('ainoob_is_koo')} value={groupInfo.name} onChange={this.props.changeName.bind(null, this.props.index)} />
        <label id="duplicate" onClick={this.props.duplicate.bind(null, this.props.index)} />
        <label id="remove" onClick={this.props.remove.bind(null, this.props.index)} />
        <label id="more" onClick={this.props.showMore.bind(null, this.props.index)} />
        <div id="detail">
          <div className="header">{capFirst(GL('app_s'))}:</div> <div id="selected" className="selected">
            {this.props.appIcons}
          </div>
          <div className="actionBar autoState">
            <div className="type">
              <select onChange={this.updateFilter} id="type">
                <option value="all">{GL('all')}</option>
                <option value="app">{GL('app')}</option>
                <option value="extension">{GL('extension')}</option>
                <option value="theme">{GL('theme')}</option>
              </select>
            </div>
            <input id="keyword" onChange={this.updateFilter} type="text" placeholder={GL('filter')} />
          </div>
          {this.props.appList}
        </div>
      </GroupDiv>
    );
  }
});
