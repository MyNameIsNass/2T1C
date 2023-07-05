// Navigation/Navigation.js

import { createStackNavigator } from 'react-navigation-stack'
import { createAppContainer } from 'react-navigation'
import AddPeople from '../Components/AddPeople'
import Teams from '../Components/Teams'
import Game from '../Components/Game'
import EndGame from '../Components/EndGame'
import Rules from '../Components/Rules'

const SearchStackNavigator = createStackNavigator({
  AddPeople: {
    screen: AddPeople,
  },
  EndGame: {
    screen: EndGame,
  },
  Teams: {
    screen: Teams,
  },
  Rules: {
    screen: Rules
  },
  Game: {
    screen: Game
  }
  },
  {
    defaultNavigationOptions: {headerShown: false}
  },
)

export default createAppContainer(SearchStackNavigator)
