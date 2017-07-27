import React, { Component } from 'react';
import { connect } from 'react-redux';
import { } from '../actions';

const mapStateToProps = (state, ownProps) => {
	return ({
		...ownProps,
		options: state.options
	});
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return ({
		...ownProps,
	})
}

class Options extends Component{
	render() {
		return (
			<div>
				<h2>
					Yo
				</h2>
			</div>
		);
	}
}

export default connect(
	mapStateToProps, 
	mapDispatchToProps
)(Options);
