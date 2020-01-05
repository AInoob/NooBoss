import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Extension from './Extension';
import Group from './Group';

const SubWindowDiv = styled.div`
  display: flex;
  opacity: ${(props) => (props.display ? '1' : '0')};
  pointer-events: ${(props) => (props.display ? 'initial' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  cursor: pointer;
  #subWindow {
    width: 80%;
    height: 80%;
    margin: auto;
    background-color: white;
    box-shadow: 0px 0px 20px 4px grey;
  }
  #loader {
    width: 200px;
    height: 200px;
    margin: auto;
    animation: loader 2s infinite linear;
  }
`;

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    subWindow: state.subWindow
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    ...ownProps,
    updateSubLocation: (mainLocation, subLocation) => {
      dispatch(updateSubLocation(mainLocation, subLocation));
    }
  };
};

class SubWindow extends Component {
  render() {
    const { display, id } = this.props.subWindow;
    let content;
    switch (display) {
      case 'extension':
        const extension = this.props.extensions[id];
        content = (
          <Extension
            language={this.props.language}
            updateSubWindow={this.props.updateSubWindow}
            extensions={this.props.extensions}
            groupList={this.props.groupList}
            icons={this.props.icons}
            extension={extension}
            id={id}
          />
        );
        break;
      case 'group':
        const group = (this.props.groupList || []).filter(
          (elem) => elem.id === id
        )[0];
        content = (
          <Group
            updateSubWindow={this.props.updateSubWindow}
            extensions={this.props.extensions}
            groupList={this.props.groupList}
            icons={this.props.icons}
            icon={this.props.icons[(group || {}).id + '_icon']}
            group={group}
            viewMode={this.props.viewMode}
          />
        );
        break;
    }
    return (
      <SubWindowDiv
        onClick={this.props.updateSubWindow.bind(null, '', '')}
        display={display != ''}>
        <div
          id='subWindow'
          onClick={(e) => {
            e.stopPropagation();
          }}>
          {content}
        </div>
      </SubWindowDiv>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SubWindow);
