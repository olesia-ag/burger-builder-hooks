import React, { useState, useEffect } from 'react'
import Modal from '../../components/UI/Modal/Modal'
import Aux from '../Aux/Aux'

const withErrorHandler = (WrappedComponent, axiosIns) => {
	return (props) => {
		const [error, setError] = useState(null)

		const reqInterceptor = axiosIns.interceptors.request.use((req) => {
			setError(null)
			return req
		})
		const resInterceptor = axiosIns.interceptors.response.use(
			(res) => res,
			(err) => {
				setError(err)
			}
		)

		useEffect(() => {
			return () => {
				axiosIns.interceptors.request.eject(reqInterceptor)
				axiosIns.interceptors.response.eject(resInterceptor)
			}
		}, [reqInterceptor, resInterceptor])

		const errorConfirmedHandler = () => {
			setError(null)
		}

		return (
			<Aux>
				<Modal show={error} modalClosed={errorConfirmedHandler}>
					{error ? error.message : null}
				</Modal>
				<WrappedComponent {...props} />
			</Aux>
		)
	}
}

export default withErrorHandler
