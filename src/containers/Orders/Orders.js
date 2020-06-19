import React from 'react'
import Order from '../../components/Order/Order'
import axiosIns from '../../axios-orders'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import Spinner from '../../components/UI/Spinner/Spinner'
import * as actions from '../../store/actions/index'
import { connect } from 'react-redux'

class Orders extends React.Component {
	state = {
		orders: [],
		loading: true,
	}

	componentDidMount(){
		this.props.onFetchOrders(this.props.token)
	}

	render() {
		let orders = <Spinner />
		if(!this.props.loading){
			orders = this.props.orders.map((order) => (
					<Order
						key={order.id}
						ingredients={order.ingredients}
						price={order.price}
					/>
				))
			
		}
		return (
			<div>
				{orders}
			</div>
		)
	}
}

const mapStateToProps = state => {
	return {
		orders: state.order.orders,
		loading: state.order.loading,
		token: state.auth.idToken
	}
}
const mapDispatchToProps = dispatch => {
	return {
		onFetchOrders: (token) => dispatch(actions.fetchOrders(token)) 
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, axiosIns))
