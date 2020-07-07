import React, { useState, useEffect } from 'react'
import Aux from '../../hoc/Aux/Aux'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import axiosIns from '../../axios-orders'
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import * as actions from '../../store/actions/index'
import { connect } from 'react-redux'

const BurgerBuilder = (props) => {
	const [purchasing, setPurchasing] = useState(false)
	const {onInitIngredients} = props
	
	useEffect(() => {
		onInitIngredients()
	}, [onInitIngredients])

	const updatePurchaseState = (ingredients) => {
		const sum = Object.keys(ingredients)
			.map((igKey) => {
				return ingredients[igKey]
			})
			.reduce((sum, el) => {
				return sum + el
			}, 0)
		return sum > 0
	}

	const purchaseHandler = () => {
		if (props.isAuthenticated) {
			setPurchasing(true)
		} else {
			props.onSetAuthRedirectPath('/checkout')
			props.history.push('/auth')
		}
	}

	const purchaseCancelHandler = () => {
		setPurchasing(false)
	}
	const purchaseContinueHandler = () => {
		props.onInitPurchase()
		props.history.push({
			pathname: '/checkout',
		})
	}
	const disabledInfo = {
		...props.ings,
	}
	//change quantity numbers to true or false:
	for (let key in disabledInfo) {
		disabledInfo[key] = disabledInfo[key] <= 0
		// console.log(`**** ${key}`, disabledInfo[key])
	}
	let orderSummary = null

	let burger = props.error ? (
		<p style={{ textAlign: 'center' }}>ingredients can not be loaded</p>
	) : (
		<Spinner />
	)
	if (props.ings) {
		burger = (
			<Aux>
				<Burger ingredients={props.ings} />
				<BuildControls
					ingredientAdded={props.onIngredientAdded}
					ingredientRemoved={props.onIngredientRemoved}
					disabled={disabledInfo}
					price={props.totPr}
					purchasable={updatePurchaseState(props.ings)}
					ordered={purchaseHandler}
					isAuth={props.isAuthenticated}
				/>
			</Aux>
		)
		orderSummary = (
			<OrderSummary
				ingredients={props.ings}
				cancel={purchaseCancelHandler}
				purchaseCanceled={purchaseCancelHandler}
				purchaseContinue={purchaseContinueHandler}
				price={props.totPr}
			/>
		)
	}

	return (
		<Aux>
			<Modal show={purchasing} modalClosed={purchaseCancelHandler}>
				{orderSummary}
			</Modal>
			{burger}
		</Aux>
	)
}

const mapStateToProps = (state) => {
	return {
		ings: state.burgerBuilder.ingredients,
		totPr: state.burgerBuilder.totalPrice,
		error: state.burgerBuilder.error,
		isAuthenticated: !!state.auth.idToken,
	}
}
const mapDispatchToprops = (dispatch) => {
	return {
		onIngredientAdded: (ingredientName) =>
			dispatch(actions.addIngredient(ingredientName)),
		onIngredientRemoved: (ingredientName) =>
			dispatch(actions.removeIngredient(ingredientName)),
		onInitIngredients: () => dispatch(actions.initIngredients()),
		onInitPurchase: () => dispatch(actions.purchaseInit()),
		onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirect(path)),
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToprops
)(withErrorHandler(BurgerBuilder, axiosIns))
