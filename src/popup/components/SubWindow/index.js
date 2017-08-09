import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Extension from './Extension';
import Group from './Group';

const SubWindowDiv = styled.div`
  display: ${props => props.display ? 'flex' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.3);
  #subWindow{
    width: 80%;
    height: 80%;
    margin: auto;
    background-color: white;
    box-shadow: 0px 0px 20px 4px grey;
  }
	#loader{
		width: 200px;
		height: 200px;
		margin: auto;
		animation: spin 1s linear infinite;
	}
`;

const mapStateToProps = (state, ownProps) => {
	return ({
    ...ownProps,
    subWindow: state.subWindow
	});
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return ({
		...ownProps,
		updateSubLocation: (mainLocation, subLocation) => {
			dispatch(updateSubLocation(mainLocation, subLocation));
		},
	})
}

class SubWindow extends Component{
	render() {
    const { display, id } = this.props.subWindow;
    let content;
    switch (display) {
      case 'extension':
        content = <Extension id={id} />;
        break;
      case 'group':
        content = <Group id={id} />;
        break;
    }
    return (
      <SubWindowDiv onClick={() => {
          if (shared && shared.updateSubWindow) {
            shared.updateSubWindow('', '');
          }
        }}
        display={display != ''}
      >
        <div id="subWindow" onClick={(e) => {e.stopPropagation()}}>
          {content}
        </div>
      </SubWindowDiv>
    );
	}
}

export default connect(
	mapStateToProps, 
	mapDispatchToProps
)(SubWindow);