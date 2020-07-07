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
	localStorage.removeItem('token')
	localStorage.removeItem('expirationTime')
	localStorage.removeItem('userId')
	return {
		type: actionTypes.AUTH_LOGOUT,
	}
}

export const checkAuthTimeout = (expirationTime) => {
	return (dispatch) => {
		setTimeout(() => {
			dispatch(logout())
		}, expirationTime * 1000)
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
			'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDjV1IMzNjYHadXNjfbomHhOsQlFZQeFk4'
		if (!isSignup) {
			url =
				'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDjV1IMzNjYHadXNjfbomHhOsQlFZQeFk4'
		}
		axios
			.post(url, authData)
			.then((res) => {
				
				//from current time + time the token will be valid for
				//gteTime return the number of milliseconds
				//so it's today's date in milliseconds plus time it will epire in
				const expDate = new Date(
					new Date().getTime() + res.data.expiresIn * 1000
				)
				localStorage.setItem('token', res.data.idToken)
				localStorage.setItem('expirationTime', expDate)
				localStorage.setItem('userId', res.data.localId)
				dispatch(authSuccess(res.data.idToken, res.data.localId))
				dispatch(checkAuthTimeout(res.data.expiresIn))
			})
			.catch((err) => {
				//map it to get better error messages
				dispatch(authFail(err.response.data.error))
			})
	}
}

export const setAuthRedirect = (path) => {
	return {
		type: actionTypes.SET_AUTH_REDIRECT_PATH,
		path: path,
	}
}

export const authCheckState = () => {

	return dispatch => {
		const token = localStorage.getItem('token')
		if (!token) {
			dispatch(logout())
		} else {
			//exp time from local storage will be a string, so we need date constructor again to make it a date
			const expirationTime = new Date(localStorage.getItem('expirationTime'))
			if (expirationTime <= new Date()) {
				dispatch(logout())
			} else {
				const userId = localStorage.getItem('userId')
				dispatch(authSuccess(token, userId))
				dispatch(checkAuthTimeout((expirationTime.getTime() - new Date().getTime()) / 1000))
			}
		}
	}
}