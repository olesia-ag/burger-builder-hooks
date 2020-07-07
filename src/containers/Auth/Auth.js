import React, { useState, useEffect } from 'react'
import Input from '../../components/UI/Input/Input'
import Button from '../../components/UI/Button/Button'
import classes from './Auth.module.css'
import { connect } from 'react-redux'
import * as actions from '../../store/actions'
import Spinner from '../../components/UI/Spinner/Spinner'
import { Redirect } from 'react-router-dom'
import { updateObject } from '../../shared/utility'
import { checkValidity } from '../../shared/utility'

const Auth = (props) => {
	const [controls, setControls] = useState({
		email: {
			elementType: 'input',
			elementConfig: {
				type: 'email',
				placeholder: 'your email address',
			},
			value: '',
			validation: {
				required: true,
				isEmail: true,
			},
			valid: false,
			touched: false,
		},
		password: {
			elementType: 'input',
			elementConfig: {
				type: 'password',
				placeholder: 'password',
			},
			value: '',
			validation: {
				required: true,
				minLength: 6,
			},
			valid: false,
			touched: false,
		},
	})
	const [isSignup, setIsSignup] = useState(true)

	//so that we don't go go to checkout if we're not building a burger:

	useEffect(() => {
		if (!props.building && props.authRedirectPath !== '/') {
			props.onSetAuthRedirectPath()
		}
	}, [])

	const inputChangedHandler = (event, controlName) => {
		const updateControls = updateObject(controls, {
			[controlName]: updateObject(controls[controlName], {
				value: event.target.value,
				valid: checkValidity(
					event.target.value,
					controls[controlName].validation
				),
				touched: true,
			}),
		})

		setControls(updateControls)
	}
	const submitHandler = (event) => {
		event.preventDefault()
		props.onAuth(controls.email.value, controls.password.value, isSignup)
	}
	const swithAuthModeHandler = () => {
		setIsSignup(!isSignup)
	}

	const formElementsArray = []
	for (let key in controls) {
		formElementsArray.push({ id: key, config: controls[key] })
	}
	let form = formElementsArray.map((formElement) => (
		<Input
			key={formElement.id}
			elementType={formElement.config.elementType}
			elementConfig={formElement.config.elementConfig}
			value={formElement.config.value}
			changed={(event) => inputChangedHandler(event, formElement.id)}
			invalid={!formElement.config.valid}
			shouldValidate={formElement.config.validation}
			touched={formElement.config.touched}
		/>
	))

	if (props.loading) {
		form = <Spinner />
	}
	let errorMessage = null

	if (props.error) {
		errorMessage = <p>{props.error.message}</p>
	}
	let authRedirect = null
	if (props.isAuthenticated) {
		authRedirect = <Redirect to={props.authRedirect} />
	}
	return (
		<div className={classes.Auth}>
			{authRedirect}
			{errorMessage}
			<form onSubmit={submitHandler}>
				{form}
				<Button btnType='Success'>SUBMIT</Button>
			</form>
			<Button btnType='Danger' clicked={swithAuthModeHandler}>
				SWITCH TO {isSignup ? 'SIGN IN' : 'SIGN UP'}
			</Button>
		</div>
	)
}

const mapStateToProps = (state) => {
	return {
		loading: state.auth.loading,
		error: state.auth.error,
		isAuthenticated: !!state.auth.idToken,
		building: state.burgerBuilder.building,
		authRedirect: state.auth.authRedirectPath,
	}
}
const mapDispatchToProps = (dispatch) => {
	return {
		onAuth: (email, password, isSignup) =>
			dispatch(actions.auth(email, password, isSignup)),
		onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirect('/')),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth)
