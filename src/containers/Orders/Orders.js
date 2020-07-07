import React, { useEffect } from 'react'
import Order from '../../components/Order/Order'
import axiosIns from '../../axios-orders'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import Spinner from '../../components/UI/Spinner/Spinner'
import * as actions from '../../store/actions/index'
import { connect } from 'react-redux'

const Orders = (props) => {
	const { onFetchOrders } = props
	useEffect(() => {
		onFetchOrders(props.token, props.userId)
	}, [onFetchOrders])

	let showOrders = <Spinner />
	if (!props.loading && props.orders.length !== 0) {
		showOrders = props.orders.map((order) => (
			<div>
				<Order
					key={order.id}
					id={order.id}
					ingredients={order.ingredients}
					price={order.price}
					delete={() =>
						props.onDeleteOrder(order.id, props.token, props.orders)
					}
				/>
			</div>
		))
	}
	if (!props.loading && props.orders.length === 0) {
		showOrders = <p>Seems like you don't have any orders here!</p>
	}
	return <div>{showOrders}</div>
}

const mapStateToProps = (state) => {
	return {
		orders: state.order.orders,
		loading: state.order.loading,
		token: state.auth.idToken,
		userId: state.auth.userId,
	}
}
const mapDispatchToProps = (dispatch) => {
	return {
		onFetchOrders: (token, userId) =>
			dispatch(actions.fetchOrders(token, userId)),
		onDeleteOrder: (orderId, token, orders) =>
			dispatch(actions.deleteOrder(orderId, token, orders)),
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(Orders, axiosIns))
