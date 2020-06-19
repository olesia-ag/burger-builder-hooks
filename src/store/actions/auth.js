import * as actionTypes from './actionTypes'
import axios from 'axios'

export const authStart = () => {
	return {
		type: actionTypes.AUTH_START,
	}
}

export const authSuccess = (idToken, userId) => {
	return {
		type: actionTypes.AUTH_SUCCESS,
		idToken: idToken,
		userId: userId,
	}
}

export const authFail = (error) => {
	return {
		type: actionTypes.AUTH_FAILED,
		error: error,
	}
}

export const logout = () => {
	return {
		type: actionTypes.AUTH_LOGOUT,
	}
}

export const checkAuthTimeout = (expirationTime) => {
	return (dispatch) => {
		setTimeout(() => {
			dispatch(logout())
		}, expirationTime*1000)
	}
}

export const auth = (email, password, isSignup) => {
	return (dispatch) => {
		dispatch(authStart())
		const authData = {
			email: email,
			password: password,
			returnSecureToken: true,
		}
		let url =
			'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCZaOBqHjxqH0uP-H-s-uvCiWi4CJHPXIE'
		if (!isSignup) {
			url =
				'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCZaOBqHjxqH0uP-H-s-uvCiWi4CJHPXIE'
		}
		axios
			.post(url, authData)
			.then((res) => {
				console.log(res)
				dispatch(authSuccess(res.data.idToken, res.data.localId))
				dispatch(checkAuthTimeout(res.data.expiresIn))
			})
			.catch((err) => {
				//map it to get better error messages
				dispatch(authFail(err.response.data.error))
			})
	}
}