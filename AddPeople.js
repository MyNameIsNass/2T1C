import React, { useState } from 'react'
import { StyleSheet, Alert, Dimensions, View, TextInput, Button, Text,Image, FlatList, TouchableOpacity,KeyboardAvoidingView, ImageBackground,Animated,Easing,Linking,Platform} from 'react-native'
import ItemPlayer from './ItemPlayer'
import {shuffle} from '../Functions/Functions'
import gif from '../Gif/beers.gif'
import '../Variables/Avatars'
import content from "../Data/content.json"

import FrFlag from '../Images/AddPeople/FR.svg'
import GbFlag from '../Images/AddPeople/GB.svg'
import Instagram from '../Images/AddPeople/instagram.svg'
import Facebook from '../Images/AddPeople/facebook.svg'
import Share from '../Images/AddPeople/share.svg'

import firebase from '../Firebase'

const SCREEN_WIDTH = Math.round(Dimensions.get('screen').width);
const SCREEN_HEIGHT = Math.round(Dimensions.get('screen').height);


export default class AddPeople extends React.Component {
  _isMounted = false;

  componentDidMount () {
    this._isMounted=true
    if (this._isMounted=true){
      this.AnimateScale()
      this.Animatesplash()
    }
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  constructor(props) {
    super(props)
    this.state = {
      players: {},
      new_player: "",
      turntoflex:false,
      flatlistheight:0,
      avatars:[...global.avatars],
      widthinput:SCREEN_WIDTH-30,
      language:"GB",
      languageopacity:0.4,
      splash:true,
      links:[],
    }
    this.myscale = new Animated.Value(0)
    this.scalesplash = new Animated.Value(0)
  }


  Animatesplash () {
    this.scalesplash.setValue(0)
    Animated.sequence([
      Animated.timing(this.scalesplash, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.linear
      }),
      Animated.delay(200)
    ]).start(()=> {this.setState({splash:false})})
  }

  AnimateScale () {
    this.myscale.setValue(1)
    Animated.sequence([
      Animated.timing(this.myscale, {
        toValue: 0,
        duration: 750,
        useNativeDriver: true,
        easing: Easing.linear
      }),
      Animated.delay(1000)
    ]).start(() => this.AnimateScale())
  }


  _newplayer(txt) {
    this.setState({
      new_player: txt,
    })
  }


  _addplayer(player) {
    let temp_players = {...this.state.players}
    let temp_player = {}
    let temp_avatars = [...this.state.avatars]

    if (player in temp_players) {
      Alert.alert(content[this.state.language].alert.alert1 + player ,"",[{ text: content[this.state.language].alert.ok1}],{ cancelable: false })
    } else if (Object.keys(temp_players).length >= 22 ) {
      Alert.alert(content[this.state.language].alert.alert2 ,"",[{ text: content[this.state.language].alert.ok2}],{ cancelable: false })
    } else if (player.length > 0) {
      if (Object.keys(temp_players).length > 0){
        this.setState({
          widthinput:SCREEN_WIDTH-100
        })
      }
      let random_avatar = Math.trunc(Math.random()*temp_avatars.length)
      let link_avatar = temp_avatars[random_avatar]
      temp_player[player]={avatar:link_avatar,team:0}
      temp_players = Object.assign({}, temp_player, temp_players)

      temp_avatars.splice(random_avatar,1)

      this.setState({
        players: temp_players,
        new_player: "",
        avatars:temp_avatars
      })
    }

    this.textInput.clear()

    if (this.state.flatlistheight > SCREEN_HEIGHT/4){
      this.setState({turntoflex:1})
    }
  }


  _delplayer = (player) => {
    let temp_players = {...this.state.players}
    let temp_avatars = [...this.state.avatars]

    if (Object.keys(temp_players).length < 3){
      this.setState({
        widthinput:SCREEN_WIDTH-30
      })
    }
    temp_avatars.push(temp_players[player].avatar)
    delete temp_players[player]

    this.setState({
      players: temp_players,
      avatars:temp_avatars
    })
    if (this.state.flatlistheight < SCREEN_HEIGHT/4){
      this.setState({turntoflex:0})
    }

  }


  _displayContinue() {
    let temp_players = {...this.state.players}
    let temp_list_players = shuffle(Object.keys(temp_players))
    const midlen = Math.trunc(temp_list_players.length / 2)

    for (const i in temp_list_players) {
      if (i < midlen){
        temp_players[temp_list_players[i]].team=0
      } else {
        temp_players[temp_list_players[i]].team=1
      }
    }
    let language = this.state.language
    this.props.navigation.navigate("Teams",{temp_players,language})
  }

  flatliststyle(){
    if (this.state.turntoflex === 1){
      return {flex:1}
    } else {
      return {}
    }
  }

  shownext(animscale) {
    if (Object.keys(this.state.players).length > 1){
      return  <TouchableOpacity  activeOpacity={0.7} style={{transform: [{scale:animscale}],padding:10, marginLeft:15,borderRadius:15,backgroundColor:'rgb(255,214,10)', shadowColor: "#000",shadowOffset: {width: 0,height: 2,}, shadowOpacity: 0.25,shadowRadius: 3.84,elevation: 5,}} onPress={() => this._displayContinue()}>
                <Text style = {{fontWeight: 'bold',fontSize: 18, color:'#ffffff'}}> {content[this.state.language].next.next1} </Text>
              </TouchableOpacity>
    } else {
      return null
    }

  }

  hidesplash(translatesplash,scalesplash) {

    if (this.state.splash === true){
      return  <View style={{position:'absolute',width:SCREEN_WIDTH,height:SCREEN_HEIGHT,backgroundColor:'rgb(240,240,240)',}}>
                <ImageBackground source={require('../Images/background/tp.png')} blurRadius={0.4} opacity={0.4} imageStyle={{resizeMode:'cover'}} style={{width:SCREEN_WIDTH,height:SCREEN_HEIGHT,position:'absolute'}} />
                <Animated.View style={{top:SCREEN_HEIGHT/2-SCREEN_WIDTH/2,transform:[{translateY:translatesplash},{scale:scalesplash}]}}>
                  <Image style={{width:SCREEN_WIDTH,height:SCREEN_WIDTH}} source={require('../assets/splash.png')}/>
                </Animated.View>
              </View>
    } else {
      return null
    }
  }


  render() {
    const animrotation = this.myscale.interpolate({
      inputRange: [0, 0.25, 0.75, 1],
      outputRange: ['0deg', '5deg', '-5deg', '0deg']
    })
    const animscale = this.myscale.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.1]
    })

    const scalesplash = this.scalesplash.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 220/SCREEN_WIDTH]
    })

    const translatesplash = this.scalesplash.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 130-SCREEN_HEIGHT/2]
    })

    const mylink = Platform.OS === 'ios' ? 'itms-apps://apps.apple.com/app/id310633997?fbclid=IwAR1s9XcOMvLoWcomHtSz67guK5vVuyrvs6UcyRe0Q0TntUnWY_sPRZBiRL4' : "market://details?id=com.whatsapp"


    return (
      <View style={styles.main_container}>

        <ImageBackground source={require('../Images/background/tp.png')} blurRadius={0.4} opacity={0.4} imageStyle={{resizeMode:'cover'}} style={{width:SCREEN_WIDTH,height:SCREEN_HEIGHT,position:'absolute'}} />

        <View style={styles.header}>
          <Animated.View style={{transform: [{rotate:animrotation}] }}>
            <Image style={styles.logo} source={require('../assets/splash.png')}/>
          </Animated.View>
        </View>

        <View onLayout={(event) => {this.setState({flatlistheight:event.nativeEvent.layout.height})}}
          style={[styles.playerlist,]}>

        <FlatList
            data={Object.keys(this.state.players)}
            keyExtractor={(item)=>item.toString()}
            renderItem={({item})=><ItemPlayer key={item} player={item} avatar={this.state.players[item].avatar} button ={require('../Images/trash.png')} format={'big'} button_function={[this._delplayer]}/>}
          />
        </View>

          <KeyboardAvoidingView behavior="padding" style={{backgroundColor:'rgba(255,255,255,0)',}}>
            <View style={styles.add_container} >
              <View style={styles.textbox}>

                <TouchableOpacity activeOpacity={0.7}  style={styles.button_add} onPress={()=>this._addplayer(this.state.new_player)}>
                  <Text style = {{fontWeight: 'bold',fontSize: 16, color:'#ffffff'}}> {content[this.state.language].add} </Text>
                </TouchableOpacity>

                <TextInput style={styles.textinput} maxLength={15} onChangeText={(txt)=>this._newplayer(txt)} ref={txt=>{this.textInput=txt}} placeholder='Charlolivier'/>
              </View>

              {this.shownext(animscale)}


            </View>
          </KeyboardAvoidingView>

        <View style={styles.footer}>
          <View style={styles.links}>
            <TouchableOpacity>
            <Instagram activeOpacity={0.7} height={30} width={30} onPress={() => Linking.openURL('https://www.facebook.com/2-TEAMS-1-CUP-107938450955561/')}/>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} onPress={() => Linking.openURL('https://www.facebook.com/2-TEAMS-1-CUP-107938450955561/')}>
            <Facebook height={30} width={30}/>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} onPress={() => Linking.openURL(mylink)}>
            <Share height={30} width={30}/>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{position:'absolute',flexDirection:'row', right:20,top:100, width:100,height:60,justifyContent:'space-around'}}>
          <TouchableOpacity style={{justifyContent:'center'}} onPress={()=>this.setState({language:"FR",languageopacity:0.4})}>
            <FrFlag  height={30} width={30} opacity={0.6+this.state.languageopacity}/>
          </TouchableOpacity>
          <TouchableOpacity style={{justifyContent:'center'}} onPress={()=>this.setState({language:"GB",languageopacity:-0.4})}>
            <GbFlag  height={30} width={30} opacity={0.6-this.state.languageopacity}/>
          </TouchableOpacity>
        </View>


        {this.hidesplash(translatesplash,scalesplash)}

      </View>
    )
  }
}


const styles = StyleSheet.create({
  main_container: {
    height:SCREEN_HEIGHT,
    backgroundColor:'rgb(240,240,240)',
  },
  header: {
    top:40,
    height:200,
    alignItems:'stretch',
    justifyContent:'flex-end',
  },

  text_next: {
    textAlign:'center',
    fontWeight: 'bold',
    fontSize: 30,
  },

  logo: {
    alignSelf:'center',
    height:220,
    width:220,
  },
  next: {
    alignSelf:'flex-end',
    marginHorizontal:20,
    marginVertical:10,
    height:20,
    width:20,
  },

  playerlist: {
    flex:1,
    alignSelf:'center',
    width:SCREEN_WIDTH*0.9,
    flexDirection:'row',
  },

  add_container: {
    flexDirection:'row',
    margin:15,
    color:'rgb(100,255,255)',
    alignItems:'center',
  },

  textbox: {
    flex:1,
    height:50,
    backgroundColor:'rgb(255,255,255)',
    alignItems:'center',
    flexDirection:'row',

    borderRadius:30,

    shadowColor: "#000",
    shadowOffset: {
    	width: 0,
    	height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  textinput: {
    fontWeight: 'bold',
    fontSize: 17,
    flex:1,
    height:50,
    marginLeft:15
  },

  button_add: {
    paddingHorizontal:10,
    height:35,
    alignItems:'center',
    backgroundColor:'rgb(255,149,0)',
    justifyContent:'center',
    borderRadius: 30,
    marginLeft:15
  },

  text: {
    textAlign:'center',
    fontWeight: 'bold',
    fontSize: 17,
    color:'rgb(255,255,255)'
  },

  footer:{
    marginBottom:60,
    width:3*SCREEN_WIDTH/5,
    flexDirection:'row',
    alignSelf:'center',
  },

  links: {
    flex:1,
    height:50,
    alignItems:'center',
    flexDirection:'row',
    justifyContent:'space-around',
    borderRadius:60,
    backgroundColor:'rgba(255,255,255,0.5)'
  },

  figure: {
    width:35,
    height:35,
  },


})
