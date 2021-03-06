import { BurgerBuilder } from './BurgerBuilder'
import React from 'react'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'

configure({ adapter: new Adapter() })

//takes two arguments: the first is the description of the test bundle which you will see in console,
//the second is the testing function
describe('<BurgerBuilder />', () => {
	    let wrapper
	beforeEach(() => {
		wrapper = shallow(<BurgerBuilder onInitIngredients={()=>{}}/>)
	})
	it('should render <BuildControls /> when receiveing ingredients', () => {
        wrapper.setProps({ings: {salad: 1}})
        expect(wrapper.find(BuildControls)).toHaveLength(1)
	})
})

