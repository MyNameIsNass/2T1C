// App.js

import React from 'react'
import SplashScreen from 'react-native-splash-screen'
import Navigation from './Navigation/Navigation'
import { StyleSheet, View,Image} from 'react-native'

export default class App extends React.Component {
  render() {
    return (
      <Navigation/>
    )
  }
}
