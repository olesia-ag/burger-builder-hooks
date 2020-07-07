import React, { useState, useEffect, useCallback } from 'react'
import Aux from '../../hoc/Aux/Aux'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import axiosIns from '../../axios-orders'
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import * as actions from '../../store/actions/index'
import { useDispatch, useSelector } from 'react-redux'

const BurgerBuilder = (props) => {
	const [purchasing, setPurchasing] = useState(false)

	const dispatch = useDispatch()

	const ings = useSelector((state) => {
		return state.burgerBuilder.ingredients
	})
	const totPr = useSelector((state) => {
		return state.burgerBuilder.totalPrice
	})
	const error = useSelector((state) => {
		return state.burgerBuilder.error
	})
	const isAuthenticated = useSelector((state) => {
		return !!state.auth.idToken
	})


	const onIngredientAdded = (ingredientName) =>
		dispatch(actions.addIngredient(ingredientName))
	const onIngredientRemoved = (ingredientName) =>
		dispatch(actions.removeIngredient(ingredientName))
	const onInitIngredients = useCallback(()=>dispatch(actions.initIngredients()), [dispatch])
	const onInitPurchase = () => dispatch(actions.purchaseInit())
	const onSetAuthRedirectPath = (path) =>
		dispatch(actions.setAuthRedirect(path))

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
		if (isAuthenticated) {
			setPurchasing(true)
		} else {
			onSetAuthRedirectPath('/checkout')
			props.history.push('/auth')
		}
	}

	const purchaseCancelHandler = () => {
		setPurchasing(false)
	}
	const purchaseContinueHandler = () => {
		onInitPurchase()
		props.history.push({
			pathname: '/checkout',
		})
	}
	const disabledInfo = {
		...ings,
	}
	//change quantity numbers to true or false:
	for (let key in disabledInfo) {
		disabledInfo[key] = disabledInfo[key] <= 0
		// console.log(`**** ${key}`, disabledInfo[key])
	}
	let orderSummary = null

	let burger = error ? (
		<p style={{ textAlign: 'center' }}>ingredients can not be loaded</p>
	) : (
		<Spinner />
	)
	if (ings) {
		burger = (
			<Aux>
				<Burger ingredients={ings} />
				<BuildControls
					ingredientAdded={onIngredientAdded}
					ingredientRemoved={onIngredientRemoved}
					disabled={disabledInfo}
					price={totPr}
					purchasable={updatePurchaseState(ings)}
					ordered={purchaseHandler}
					isAuth={isAuthenticated}
				/>
			</Aux>
		)
		orderSummary = (
			<OrderSummary
				ingredients={ings}
				cancel={purchaseCancelHandler}
				purchaseCanceled={purchaseCancelHandler}
				purchaseContinue={purchaseContinueHandler}
				price={totPr}
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



export default withErrorHandler(BurgerBuilder, axiosIns)
