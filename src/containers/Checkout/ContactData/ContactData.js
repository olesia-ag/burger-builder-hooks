import React, {useState} from 'react'
import Button from '../../../components/UI/Button/Button'
import classes from './ContactData.module.css'
import axiosIns from '../../../axios-orders'
import Spinner from '../../../components/UI/Spinner/Spinner'
import Input from '../../../components/UI/Input/Input'
import { connect } from 'react-redux'
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler'
import * as orderActions from '../../../store/actions/index'
import { updateObject } from '../../../shared/utility'
import {checkValidity} from '../../../shared/utility'

const ContactData = (props) => {

	const [orderForm, setOrderForm] = useState({
		name: {
			elementType: 'input',
			elementConfig: {
				type: 'text',
				placeholder: 'Your Name',
			},
			value: '',
			validation: {
				required: true,
			},
			valid: false,
			touched: false,
		},
		street: {
			elementType: 'input',
			elementConfig: {
				type: 'text',
				placeholder: 'Street',
			},
			value: '',
			validation: {
				required: true,
			},
			valid: false,
			touched: false,
		},
		zipCode: {
			elementType: 'input',
			elementConfig: {
				type: 'text',
				placeholder: 'Zip Code',
			},
			value: '',
			validation: {
				required: true,
				minLength: 5,
				maxLength: 5,
			},
			valid: false,
			touched: false,
		},
		country: {
			elementType: 'input',
			elementConfig: {
				type: 'text',
				placeholder: 'Country',
			},
			value: '',
			validation: {
				required: true,
			},
			valid: false,
			touched: false,
		},
		email: {
			elementType: 'input',
			elementConfig: {
				type: 'email',
				placeholder: 'Your email',
			},
			value: '',
			validation: {
				required: true,
				isEmail: true,
			},
			valid: false,
			touched: false,
		},
		deliveryMethod: {
			elementType: 'select',
			elementConfig: {
				options: [
					{ value: 'fastest', displayValue: 'Fastest' },
					{ value: 'cheapest', displayValue: 'Cheapest' },
				],
			},
			value: 'fastest',
			validation: {},
			valid: true,
		},
	},)

	const [isValid, setFormValidity] = useState(false)


	const orderHandler = (event) => {
		event.preventDefault()
		const formData = {}
		for (let formElementIdentifier in orderForm) {
			formData[formElementIdentifier] = orderForm[
				formElementIdentifier
			].value
		}
		const order = {
			ingredients: props.ings,
			//in production price shoulb be calculate on the server to make sure that user doesn't manipulate it
			price: props.totPr,
			orderData: formData,
			userId: props.userId,
		}
		props.onOrder(order, props.token)
	}

	const inputChangedHandler = (event, inputIdentifier) => {
		const updatedFormElement = updateObject(
			orderForm[inputIdentifier],
			{
				value: event.target.value,
				valid: checkValidity(
					event.target.value,
					orderForm[inputIdentifier].validation
				),
				touched: true,
			}
		)
		const updatedOrderForm = updateObject(orderForm, {[inputIdentifier]: updatedFormElement})
		let formIsValid = true
		for (let inputIdentifier in updatedOrderForm) {
			formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid
		}
		setOrderForm(updatedOrderForm)
		setFormValidity(formIsValid)
	}

		const formElementsArray = []
		for (let key in orderForm) {
			formElementsArray.push({ id: key, config: orderForm[key] })
		}
		let form = (
			<form onsubmit={orderHandler}>
				{formElementsArray.map((formElement) => (
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
				))}

				<Button
					btnType='Success'
					disabled={!isValid}
					clicked={orderHandler}
				>
					ORDER
				</Button>
			</form>
		)
		if (props.loading) {
			form = <Spinner />
		}
		return (
			<div className={classes.ContactData}>
				<h4>enter you contact information:</h4>
				{form}
			</div>
		)
	
}
const mapStateToProps = (state) => {
	return {
		ings: state.burgerBuilder.ingredients,
		totPr: state.burgerBuilder.totalPrice,
		loading: state.order.loading,
		token: state.auth.idToken,
		userId: state.auth.userId,
	}
}
const mapDispatchToProps = (dispatch) => {
	return {
		onOrder: (orderData, token) =>
			dispatch(orderActions.purchaseBurger(orderData, token)),
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(ContactData, axiosIns))
