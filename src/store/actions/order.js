import * as actionTypes from './actionTypes'
import axiosIns from '../../axios-orders'

export const purchaseBurgerSuccess = (id, orderData) => {
	return {
		type: actionTypes.PURCHASE_BURGER_SUCCESS,
		orderID: id,
		orderData: orderData,
	}
}

export const purchaseBurgerFail = (error) => {
	return {
		type: actionTypes.PURCHASE_BURDER_FAIL,
		error: error,
	}
}

export const purchaseBurger = (orderData, token) => {
	return (dispatch) => {
		dispatch(purchaseBurgerStart())
		axiosIns
			.post(`/orders.json?auth=${token}`, orderData)
			.then((res) => {
				dispatch(purchaseBurgerSuccess(res.data.name, orderData))
			})
			.catch((error) => dispatch(purchaseBurgerFail(error)))
	}
}

export const purchaseBurgerStart = () => {
	return {
		type: actionTypes.PURCHASE_BURGER_START,
	}
}

export const purchaseInit = () => {
	return {
		type: actionTypes.PURCHASE_INIT,
	}
}

export const fetchOrdersSuccess = (orders) => {
	return {
		type: actionTypes.FETCH_ORDERS_SUCCESS,
		orders: orders,
	}
}

export const fetchOrdersFail = (error) => {
	return {
		type: actionTypes.FETCH_ORDERS_FAILED,
		error: error,
	}
}

export const fetchOrdersStart = () => {
	return {
		type: actionTypes.FETCH_ORDERS_START,
	}
}

export const fetchOrders = (token, userId) => {
	return (dispatch) => {
		dispatch(fetchOrdersStart())
		// const queryParams = '?auth='+token+'&orderBy=userId&equalTo=' + userId
		const queryParams = `${token}&orderBy="userId"&equalTo="${userId}"`
		axiosIns
			.get('/orders.json?auth=' + queryParams)
			.then((res) => {
				const fetchedOrders = []
				for (let key in res.data) {
					fetchedOrders.push({ ...res.data[key], id: key })
				}
				dispatch(fetchOrdersSuccess(fetchedOrders))
			})
			.catch((error) => {
				dispatch(fetchOrdersFail(error))
			})
	}
}
