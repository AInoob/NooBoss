import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

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
    background-color: white
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
        break;
      case 'group':
        break;
    }
    return (
      <SubWindowDiv display={display != ''}>
        <div id="subWindow">
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