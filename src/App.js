import React, { useState, useEffect } from 'react'
import './App.css'
import Layout from './hoc/Layout/Layout'
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder'
// import Checkout from './containers/Checkout/Checkout'
import { Route, withRouter, Switch, Redirect } from 'react-router-dom'
import Orders from './containers/Orders/Orders'
// import Auth from './containers/Auth/Auth'
import Logout from './containers/Auth/Logout/Logout'
import { connect } from 'react-redux'
import * as actions from './store/actions/index'
const Checkout = React.lazy(() => import('./containers/Checkout/Checkout'))
const Auth = React.lazy(() => import('./containers/Auth/Auth'))

const App = (props) => {
	useEffect(() => props.onTryAutoSignIn(), [props])

	let routes = (
		<Switch>
			<Route path='/auth' component={Auth} />
			<Route path='/' exact component={BurgerBuilder} />
			<Redirect to='/' />
		</Switch>
	)
	if (props.auth) {
		routes = (
			<Switch>
				<Route path='/checkout' component={Checkout} />
				<Route path='/orders' component={Orders} />
				<Route path='/logout' component={Logout} />
				<Route path='/auth' component={Auth} />
				<Route path='/' exact component={BurgerBuilder} />
				<Redirect to='/' />
			</Switch>
		)
	}
	return (
		<div>
			<Layout>{routes}</Layout>
		</div>
	)
}

const mapStateToProps = (state) => {
	return {
		auth: !!state.auth.idToken,
	}
}
const mapDispatchToProps = (dispatch) => {
	return {
		onTryAutoSignIn: () => dispatch(actions.authCheckState()),
	}
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
