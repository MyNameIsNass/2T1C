import React from 'react'
import { StyleSheet, View, Text, Image, TouchableOpacity,Dimensions,ImageBackground, Animated, Easing,ScrollView } from 'react-native'
import content from "../Data/content.json"

const SCREEN_WIDTH = Math.round(Dimensions.get('screen').width);
const SCREEN_HEIGHT = Math.round(Dimensions.get('screen').height);
import Explain from '../Images/Game/explain.svg'
import Answer from '../Images/Game/answer.svg'

import firebase from '../Firebase'

export default class Rules extends React.Component {

    componentDidMount () {
      this.AnimateScale()
      this.Animatetranslate()
      this.readData()
    }

    constructor(props) {
        super(props)
        let { params } = this.props.navigation.state;
        let temp_players = params ? params.temp_players : null
        this.language = params ? params.language : "GB"
        this.state = {
          players:temp_players,
          dataread:false,
          games:[],
          disclaimer:false
        }
        this.myscale = new Animated.Value(0)
        this.translate = new Animated.Value(0)
    }

    readData() {
      firebase.database()
        .ref('/games/')
        .once('value')
        .then(snapshot => {
          let games = snapshot.val()
          this.setState({
            dataread:true,
            games:games
          })
      });
    }

    Animatetranslate() {
      this.translate.setValue(0)
      Animated.timing(this.translate, {
        toValue: 1,
        duration: 750,
        useNativeDriver: true,
        easing: Easing.linear
      }).start()
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

  _displaydisclaimer(){
    this.setState({
      disclaimer:true
    })
  }

  _displayPlay() {
    if (this.state.dataread === true) {
      let temp_players = this.state.players
      let language = this.language
      let temp_games = this.state.games
      this.setState({
        disclaimer:false
      })
      this.props.navigation.navigate("Game",{temp_players,temp_games,language})
    }
  }


  disclaimer(animscale){
    if (this.state.disclaimer === true){
      return  <View style={{position:'absolute',width:SCREEN_WIDTH,height:SCREEN_HEIGHT,backgroundColor:'rgb(240,240,240)'}}>
                <ImageBackground source={require('../Images/background/tp.png')} blurRadius={0.4} opacity={0.4} imageStyle={{resizeMode:'cover'}} style={{width:SCREEN_WIDTH,height:SCREEN_HEIGHT,position:'absolute'}} />

                <View style={{position:'absolute',width:SCREEN_WIDTH,height:SCREEN_HEIGHT, paddingVertical: 40,paddingHorizontal:80}}>
                  <View style={{flex:1,paddingVertical:40,}}>
                    <Text style={{color:'rgba(0,0,0,0.5)',fontWeight: 'bold',fontSize:30,textAlign:'center'}}>
                      {content[this.language].disclaimer.warning}
                    </Text>
                    <Text style = {[styles.textrules,{marginTop:100}]}>
                      {content[this.language].disclaimer.body1}
                    </Text>
                    <Text style = {[styles.textrules,{marginTop:50}]}>
                      {content[this.language].disclaimer.body2}
                    </Text>
                  </View>
                  <View style={styles.button_container}>
                    <TouchableOpacity style={styles.button_play} onPress={() => this._displayPlay()}>
                      <Text style = {{fontWeight: 'bold',fontSize: 20, color:'#ffffff'}}> OK </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
    } else {
      return <View style={styles.button_container}>
                <TouchableOpacity style={[styles.button_play,{transform: [{scale:animscale}],shadowColor: "#000",shadowOffset: {width:0,height:2,}, shadowOpacity:0.25,shadowRadius:3.84,elevation:5,}]} onPress={() => this._displaydisclaimer()}>
                  <Text style = {{fontWeight: 'bold',fontSize: 20, color:'#ffffff'}}> {content[this.language].next.next3} </Text>
                </TouchableOpacity>
              </View>
    }
  }

  render() {
      const animscale = this.myscale.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.1]
      })

      const animtranslate = this.translate.interpolate({
        inputRange: [0, 1],
        outputRange: [-SCREEN_HEIGHT*2, 0]
      })

      return (
        <View style={styles.main_container}>
          <ImageBackground source={require('../Images/background/tp.png')} blurRadius={0.4} opacity={0.4} imageStyle={{resizeMode:'cover'}} style={{width:SCREEN_WIDTH,height:SCREEN_HEIGHT,position:'absolute'}} />
          <Animated.View style={{paddingHorizontal:20,flex:1,transform:[{translateY:animtranslate}],backgroundColor:'rgba(240,240,240,0.9)',borderRadius:20,borderWidth:1,borderColor:'rgba(200,200,200,0.5)'}}>
            <View style={styles.header}>
              <Text style = {styles.text}> {content[this.language].rulestitle} </Text>
            </View>
            <View style={{flex:4}}>
              <View style={ styles.row }>
                <View style={ styles.bullet }>
                  <Text style = {{fontSize: 20,color:'rgba(0,0,0,0.5)',fontWeight: 'bold',}}>{"1" + '\u2022' + " "}</Text>
                </View>
                <View style={ styles.bulletText }>
                  <Text style = {styles.textrules}>{content[this.language].rules.rule1}</Text>
                </View>
              </View>
              <View style={ styles.row }>
                <View style={ styles.bullet }>
                  <Text style = {{fontSize: 20,color:'rgba(0,0,0,0.5)',fontWeight: 'bold',}}>{"2" + '\u2022' + " "}</Text>
                </View>
                <View style={ styles.bulletText }>
                  <Text style = {styles.textrules}>{content[this.language].rules.rule2}</Text>
                </View>
              </View>
              <View style={ styles.row }>
                <View style={ styles.bullet }>
                  <Text style = {{fontSize: 20,color:'rgba(0,0,0,0.5)',fontWeight: 'bold',}}>{"3" + '\u2022' + " "}</Text>
                </View>
                <View style={ styles.bulletText }>
                  <Text style = {styles.textrules}>{content[this.language].rules.rule3}</Text>
                </View>
              </View>
            </View>
            <View style={{flex:2}}>
              <View style={ styles.row }>
                <View style={ styles.bullet }>
                  <Answer height={25} width={25}/>
                </View>
                <View style={ styles.bulletText }>
                  <Text style = {styles.textrules}> {content[this.language].rules.buttonanswer} </Text>
                </View>
              </View>
              <View style={ styles.row }>
                <View style={ styles.bullet }>
                  <Explain height={20} width={20}/>
                </View>
                <View style={ styles.bulletText }>
                  <Text style = {styles.textrules}> {content[this.language].rules.buttonexplain} </Text>
                </View>
              </View>
              <View style={ styles.row }>
                <View style={ styles.bullet }>
                  <Image style={{height:20,width:20}} source={require('../Images/widget/refresh.png')}/>
                </View>
                <View style={ styles.bulletText }>
                  <Text style = {styles.textrules}> {content[this.language].rules.buttonrecover} </Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {this.disclaimer(animscale)}
      </View>

      )
  }

}

const styles = StyleSheet.create({
  main_container: {
    height:SCREEN_HEIGHT,
    backgroundColor:'rgb(240,240,240)',
    paddingVertical:40,
    paddingHorizontal:15
  },
  header:{
    justifyContent:'center',
    flex:0.8,
    backgroundColor:'rgb(240,240,240)',
    padding:20,
    borderTopRightRadius:20,
    borderTopLeftRadius:20,
    flexDirection:'row',
    alignItems:'center'
  },
  button_container: {
    height:100,
    justifyContent:'center',
    alignItems:'center',
  },
  button_play: {
    margin:10,
    height:50,
    width:120,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'rgb(255,214,10)',
    borderRadius:20,
  },
  text:{
    textAlign:'center',
    fontWeight: 'bold',
    fontSize: 25,
    color:'rgba(0,0,0,0.5)'
  },
  textrules:{
    fontSize: 16,
    color:'rgba(0,0,0,0.5)',
    textAlign:'justify',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    paddingVertical:8
  },
  bullet: {
    width: 40,
  },
  bulletText: {
    flex: 1,
  }

})
