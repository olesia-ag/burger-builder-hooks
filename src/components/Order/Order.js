import React from 'react'
import classes from './Order.module.css'
import Button from '../UI/Button/Button'


const order = (props) => {
	// const ingredients = Object.keys(props.ingredients)
	// .map((igKey) => {
	// 	return [...Array(props.ingredients[igKey])].map((_, i) => {
	// 		// console.log(i)
	// 		return <BurgerIngredient key={igKey + i} type={igKey} />
	// 	})
	// })
	// .reduce((arr, el) => {
	// 	return arr.concat(el)
	// }, [])
	const ingredients = []
	for (let ingredientName in props.ingredients) {
		ingredients.push({
			name: ingredientName,
			amount: props.ingredients[ingredientName],
		})
	}
	const ingredientOutput = ingredients.map((ig) => {
		return (
			<span
				style={{
					textTransform: 'capitalize',
					display: 'inline-block',
					margin: '0 8px',
					border: '1px solid #ccc',
					padding: '5px',
				}}
				key={ig.name}
			>
				{ig.name} ({ig.amount}){' '}
			</span>
		)
	})

	return (
		<div className={classes.Order}>
			<p>
				{ingredientOutput}
				<Button btnType='DeleteButton' clicked={props.delete}>DELETE</Button>{' '}
			</p>
			<p>
				Price: <strong>{Number.parseFloat(props.price).toFixed(2)}</strong>
			</p>
		</div>
	)
}

export default order
