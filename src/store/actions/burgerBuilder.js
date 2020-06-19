import * as actionTypes from './actionTypes'
import axiosIns from '../../axios-orders'


export const addIngredient = (name) => {
    return {
        type: actionTypes.ADD_INGREDIENT,
        ingredientName: name,
        
        
    }
}

export const removeIngredient = (name) => {
    return {
        type: actionTypes.REMOVE_INGREDIENT,
        ingredientName: name
        
    }
}

export const setIngredients = (ingredients) => {
    console.log('git to thunk', ingredients)
    return {
        type: actionTypes.SET_INGREDIENTS,
        ingredients: ingredients
    }
}
export const fetchIngredientsFailed = () => {
    return {
        type: actionTypes.FETCH_INGREDIENTS_FAILED
    }
}


export const initIngredients = () => {
    return dispatch => {
        axiosIns
        .get('/ingredients.json')
        .then((response) => {
            console.log("************* response", response)
            dispatch(setIngredients(response.data))
        })
        .catch((err) => {
            dispatch(fetchIngredientsFailed())
        })
    }
}