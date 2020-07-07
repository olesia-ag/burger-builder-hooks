import React, { useState } from 'react'
import Aux from '../Aux/Aux'
import classes from './Layout.module.css'
import Toolbar from '../../components/Navigation/Toolbar/Toolbar'
import SideDrawer from '../../components/Navigation/Toolbar/SideDrawer/SideDrawer'
import { connect } from 'react-redux'

const Layout = (props) => {

	const [showSideDrawer, switchShowSideDrawer] = useState(false)
	const sideDrawerClosedHandler = () =>{
		switchShowSideDrawer(false)
	}

	const sideDrawerToggleHandler = () => {
		switchShowSideDrawer(!showSideDrawer)
	}

	return (
		<Aux>
			<Toolbar
				isAuth={props.isAuthenticated}
				drawerToggleClicked={sideDrawerToggleHandler}
			/>
			<SideDrawer
				isAuth={props.isAuthenticated}
				closed={sideDrawerClosedHandler}
				open={showSideDrawer}
			/>
			<main className={classes.Content}>{props.children}</main>
		</Aux>
	)
}

const mapStateToProps = (state) => {
	return {
		isAuthenticated: !!state.auth.idToken,
	}
}
export default connect(mapStateToProps)(Layout)
