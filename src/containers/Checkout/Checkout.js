import React from 'react'
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary'
import { Route, Redirect } from 'react-router-dom'
import ContactData from './ContactData/ContactData'
import { connect } from 'react-redux'

const Checkout = (props) => {
	
	const checkoutCancelledHandler = () => {
		props.history.goBack()
	}

	const checkoutContinuedHandler = () => {
		props.history.replace('/checkout/contact-data')
	}

	let summary = <Redirect to='/' />

	if (props.ings) {
		const purchaseRedirect = props.purchased ? <Redirect tp='/' /> : null
		summary = (
			<>
				{purchaseRedirect}
				<CheckoutSummary
					ingredients={props.ings}
					checkoutCancelled={checkoutCancelledHandler}
					checkoutContinued={checkoutContinuedHandler}
				/>
				<Route
					path={props.match.path + '/contact-data'}
					component={ContactData}
				/>
			</>
		)
	}

	return <div>{summary}</div>
}
const mapStateToProps = (state) => {
	return {
		ings: state.burgerBuilder.ingredients,
		purchased: state.order.purchased,
	}
}

export default connect(mapStateToProps)(Checkout)
