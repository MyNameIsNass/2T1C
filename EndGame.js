import React from 'react'
import { StyleSheet, View, Text, Image, TouchableOpacity,Dimensions,ImageBackground } from 'react-native'
import AddPeople from '../Components/AddPeople'
import content from "../Data/content.json"

const SCREEN_WIDTH = Math.round(Dimensions.get('screen').width);
const SCREEN_HEIGHT = Math.round(Dimensions.get('screen').height);

export default class EndGame extends React.Component {

  constructor(props) {
    super(props)
    let { params } = this.props.navigation.state;
    this.winner = params ? params.winner : null
    this.teams = params ? params.teams : null
    this.temp_players = params ? params.temp_players : null
    this.language = params ? params.language : "GB"
    console.log(this.temp_players )
  }

  _displayHome() {
    this.props.navigation.navigate("AddPeople")
  }

  myplayer2 = (player) => {
    let avatar = <Image style={{width:50,height:50,margin:5}} source={this.temp_players[player].avatar}/>

    return  <View key={player} style={{alignItems:'center',width:SCREEN_WIDTH/5}} >
              <View style={{alignItems:'center'}}>
                  {avatar}
                <View style={{flexDirection:'row',width:SCREEN_WIDTH/5,height:60}}>
                  <Text style={{flex:1,textAlign:'center',fontWeight: 'bold',fontSize:16,color:'rgba(0,0,0,0.5)'}}> {player} </Text>
                </View>
              </View>
            </View>

  }

  teamplayers2(data){
    return (<View style={{flexDirection:'row',flexWrap:'wrap',justifyContent:'center',width:SCREEN_WIDTH*0.9}}>
              {data.map(this.myplayer2)}
            </View>)
  }

  render() {
    let teamwinner
    let color
    let avatar
    if (this.winner === 0) {
      teamwinner = content[this.language].teams.team1
      color = 'rgba(255,59,48,0.6)'
      avatar = <Image style={{width:80,height:80,margin:5}} source={require('../Images/peach.png')}/>
    } else {
      teamwinner = content[this.language].teams.team2
      color = 'rgba(94,92,230,0.9)'
      avatar = <Image style={{width:80,height:80,margin:5}} source={require('../Images/eggplant.png')}/>

    }

      return (
        <TouchableOpacity activeOpacity={1} style={styles.main_container} onPress={() => this._displayHome()}>
          <View style={{position:'absolute',top:SCREEN_WIDTH/5,justifyContent:'flex-start',alignItems:'center'}}>
            <Image style={{width:2*SCREEN_WIDTH,height:2*SCREEN_WIDTH,}} source={require('../Images/Game/winner.gif')}/>
          </View>
          <ImageBackground source={require('../Images/background/tp.png')} blurRadius={0.4} opacity={0.4} imageStyle={{resizeMode:'cover'}} style={{width:SCREEN_WIDTH,height:SCREEN_HEIGHT,position:'absolute'}} />

          <View style={{height:2*SCREEN_WIDTH,width:SCREEN_WIDTH,alignItems:'center',top:70}}>
            <View style={{position:'absolute',top:-SCREEN_WIDTH/8,height:SCREEN_WIDTH,width:SCREEN_WIDTH,alignItems:'center'}}>
              <Image style={{width:3*SCREEN_WIDTH/4,height:3*SCREEN_WIDTH/4}} source={require('../assets/splash.png')}/>
            </View>
            <View style={{position:'absolute',height:50,top:3*SCREEN_WIDTH/8,alignItems:'center',justifyContent:'center',flexDirection:'row',alignItems:'center'}}>
              <Text style={{textAlign:'center', fontWeight:'bold', fontSize:25,color:'rgba(0,0,0,0.5)'}}> {content[this.language].winner} : </Text>
              <Text style={{textAlign:'center', fontWeight:'bold', fontSize:25,color:color}}> {teamwinner} </Text>
            </View>
            <View style={{position:'absolute',top:4*SCREEN_WIDTH/8,width:SCREEN_WIDTH,justifyContent:'center',alignItems:'center',flexDirection:'row',backgroundColor:'rgba(230,230,230,0.4)'}}>
              {avatar}
            </View>

            <View style={{position:'absolute',top:6*SCREEN_WIDTH/8}}>
              {this.teamplayers2(this.teams[this.winner])}
            </View>
          </View>

        </TouchableOpacity>
      )
  }
}


const styles = StyleSheet.create({
  main_container: {
    backgroundColor:'rgb(240,240,240)',
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },

  text: {
    textAlign:'center',
    fontWeight: 'bold',
    fontSize: 40,
    color:'rgb(255,255,255)'
  }
})
