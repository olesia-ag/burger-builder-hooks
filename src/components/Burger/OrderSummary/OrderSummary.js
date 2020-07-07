import React from 'react'
import Aux from '../../../hoc/Aux/Aux'
import Button from '../../UI/Button/Button'

const OrderSummary = (props) => {
	const ingredientSummary = Object.keys(props.ingredients).map((igKey) => {
		return (
			<li key={igKey}>
				<span style={{ textTransform: 'capitalize' }}>{igKey}</span>:{' '}
				{props.ingredients[igKey]}
			</li>
		)
	})
	return (
		<Aux>
			<h3> Your order</h3>
			<p>burger with following ingredients:</p>
			<ul>{ingredientSummary}</ul>
			<p>Total price: {props.price.toFixed(2)}</p>
			<p>Continue to checkout:</p>
			<Button btnType='Danger' clicked={props.purchaseCanceled}>
				CANCEL
			</Button>
			<Button btnType='Success' clicked={props.purchaseContinue}>
				Continue
			</Button>
		</Aux>
	)
}

export default OrderSummary
