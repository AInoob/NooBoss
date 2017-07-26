import React, { Component } from 'react';
import { connect } from 'react-redux';
import { overviewUpdateBello } from '../actions';

const mapStateToProps = (state, ownProps) => {
	return ({
		...ownProps,
		overview: state.overview
	});
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return ({
		...ownProps,
		updateBello: (bello) => {
			dispatch(overviewUpdateBello(bello));
		}
	})
}

class Overview extends Component{
	render() {
		return (
			<div>
				<h2>
					{this.props.overview.bello}
				</h2>
				<input 
					onChange={(e)=>{
						this.props.updateBello(e.target.value);
					}} 
					value={this.props.overview.bello}
				/>
			</div>
		);
	}
}

export default connect(
	mapStateToProps, 
	mapDispatchToProps
)(Overview);
