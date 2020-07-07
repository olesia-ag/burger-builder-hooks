import React, { useEffect } from 'react'
import './App.css'
import Layout from './hoc/Layout/Layout'
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder'
import { Route, withRouter, Switch, Redirect } from 'react-router-dom'
import Logout from './containers/Auth/Logout/Logout'
import { connect } from 'react-redux'
import * as actions from './store/actions/index'
const Checkout = React.lazy(() => import('./containers/Checkout/Checkout'))
const Auth = React.lazy(() => import('./containers/Auth/Auth'))
const Orders = React.lazy(() => import('./containers/Orders/Orders'))

const App = (props) => {
	const { onTryAutoSignIn } = props
	useEffect(() => onTryAutoSignIn(), [onTryAutoSignIn])

	let routes = (
		<Switch>
			<Route path='/auth' render={(props) => <Auth {...props} />} />
			<Route path='/' exact component={BurgerBuilder} />
			<Redirect to='/' />
		</Switch>
	)
	if (props.auth) {
		routes = (
			<Switch>
				<Route path='/checkout' render={(props) => <Checkout {...props} />} />
				<Route path='/orders' render={(props) => <Orders {...props} />} />
				<Route path='/logout' component={Logout} />
				<Route path='/auth' render={(props) => <Auth {...props} />} />
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
