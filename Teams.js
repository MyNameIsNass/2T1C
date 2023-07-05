import React from 'react'
import { StyleSheet, View, TextInput, Button, Text, FlatList,TouchableOpacity,ImageBackground,Image,ScrollView, Dimensions,Animated,Easing } from 'react-native'
import ItemPlayer from './ItemPlayer'
import content from "../Data/content.json"

const SCREEN_WIDTH = Math.round(Dimensions.get('screen').width);
const SCREEN_HEIGHT = Math.round(Dimensions.get('screen').height);

export default class Teams extends React.Component {

  componentDidMount () {
    this.AnimateScale()
    this.Animatepop()
  }

  constructor(props) {
      super(props)
      let { params } = this.props.navigation.state;
      let temp_players = params ? params.temp_players : null
      this.language = params ? params.language : "GB"
      this.state = {
        players:temp_players,
        hidexplain:1,
        mounted:false
      }
      this.myscale = new Animated.Value(0)
      this.scalepop = new Animated.Value(0.5)
  }

  Animatepop() {
    this.scalepop.setValue(0)
    Animated.sequence([
      Animated.timing(this.scalepop, {
        toValue: 0.5,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.linear
      }),
      Animated.delay(1500),
      Animated.timing(this.scalepop, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.linear
      }),
    ]).start( () => {this.mounted(),this.hidexplain()} )
  }

  mounted(){
    this.setState({mounted:true})
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

  _displayRules() {
    let temp_players = this.state.players
    let language = this.language
    this.props.navigation.navigate("Rules",{temp_players,language})
  }

  _changeteams = (player) => {
    let temp_players = {...this.state.players}
    let teamnum = temp_players[player].team
    if (Object.keys(temp_players).filter(p => temp_players[p].team==teamnum).length > 1 && Object.keys(temp_players).filter(p => temp_players[p].team==1-teamnum).length <12 ){
      temp_players[player].team = (teamnum + 1) % 2
    }
    this.setState({
      players:temp_players
    })
  }

  _teamlist(team) {

    let data = Object.keys(this.state.players).filter(player => this.state.players[player].team==team)
    let heightblocks = 34 * Math.round((data.length)/2) + 18 * (1 - data.length % 2)

    return (
      <View  style={[styles.team,{height:heightblocks}]}>
        {data.map(this._myCard).reverse()}
      </View>
    )
  }

  _myposition(index){
    let top
    if (index%2 === 0) {
      return {
        position:'absolute',
        top:34 * index /2,
        left:0
      }
    } else {
      return {
        position:'absolute',
        top:34 * index /2,
        left:SCREEN_WIDTH/2-15
      }
    }

  }

  _myCard = (item,i) => {
    return <View key={item} style={this._myposition(i)} >
              <ItemPlayer player={item} avatar={this.state.players[item].avatar} button ={require('../Images/change.png')} format={'small'} button_function={[this._changeteams]}/>
            </View>
  }


  _teamheader(name,team,color) {
    let data = Object.keys(this.state.players).filter(player => this.state.players[player].team==team)
    let image

    if (team === 0) {
      image = <Image style={{width:45,height:45,marginRight:10}} source={require('../Images/peach.png')}/>
    } else {
      image = <Image style={{width:45,height:45,marginRight:10}}  source={require('../Images/eggplant.png')}/>
    }


    return (
      <View style={styles.team_names}>
        <View style={[styles.team_names_box,{alignItems:'center'}]}>
          {image}
          <Text style = {{fontWeight: 'bold',fontSize: 18,color:color}}> {name} </Text>
        </View>
        <View style={styles.team_number_box}>
          <Text style = {{fontSize: 15,color:'rgba(0,0,0,0.5)'}}> {content[this.language].players} : {data.length} </Text>
        </View>
      </View>
    )
  }

  headerstyle (size1,size2,color){
    if (size1>size2) {
      if (color === 'rgba(255,59,48,0.4)'){
        return {
          flex:1,
          borderTopWidth:1,
          borderColor:'rgba(200,200,200,0.5)',
          justifyContent:'center',
          marginBottom:25}
      } else {
        return {
          borderBottomWidth:1,
          borderColor:'rgba(200,200,200,0.5)',
          justifyContent:'center',
          flex:1,
          marginTop:25}
      }
    } else {
      return {
        justifyContent:'center',
        height:50,
        borderRadius:10,borderColor:color,borderWidth:0,
        backgroundColor:'rgba(255,255,255,0.1)'
      }
    }
  }


  _blocks(topleft,tlsize,bottomleft,blsize,color) {
    return (
      <View style={{height:SCREEN_HEIGHT/2-40,marginHorizontal:10}}>
          <View style={[this.headerstyle(tlsize,blsize,color)]}>
              {topleft}
          </View>
          <View style={[this.headerstyle(blsize,tlsize,color)]}>
              {bottomleft}
          </View>
      </View>
    )
  }

  hidexplain(){
    if (this.state.mounted === true) {
      this.setState({
        hidexplain:0
      })
    }
  }

  explainteam(blockteam1,blockteam2,animscale,animpop){
    if (this.state.hidexplain === 1) {
      return <View style={{height:SCREEN_HEIGHT}}>
              {blockteam1}
              {blockteam2}
              <View style={styles.button_container}>
                <TouchableOpacity activeOpacity={0.7} style={styles.button_play} onPress={() => this._displayRules()}>
                  <Text style = {{fontWeight: 'bold',fontSize: 20, color:'#ffffff'}}> {content[this.language].next.next2} </Text>
                </TouchableOpacity>
              </View>
              <Animated.View style={{transform: [{translateX:animpop}],alignItems:'center',position:'absolute',top:50,width:SCREEN_WIDTH*2, height:SCREEN_HEIGHT-180,backgroundColor:'rgba(240,240,240,0.95)',justifyContent:'center'}}>
                <View style={{width:SCREEN_WIDTH, height:SCREEN_HEIGHT-220,alignItems:'center',justifyContent:'center',padding:100}}>
                  <View style={{justifyContent:'center',marginVertical:50,flexDirection:'row'}}>
                    <Text style = {{flex:1,textAlign:'center',fontWeight: 'bold',fontSize: 25,color:'rgba(0,0,0,0.5)'}}> {content[this.language].teamspage.title} </Text>
                  </View>
                  <View style={{justifyContent:'center',marginVertical:50,flexDirection:'row'}}>
                    <Text style = {{flex:1,textAlign:'center',fontWeight: 'bold',fontSize: 20,color:'rgba(0,0,0,0.5)'}}> {content[this.language].teamspage.explain} </Text>
                  </View>
                </View>
              </Animated.View>
            </View>
    } else {
      return  <View style={{height:SCREEN_HEIGHT}}>
                {blockteam1}
                {blockteam2}
                <View style={styles.button_container}>
                  <TouchableOpacity activeOpacity={0.7} style={[styles.button_play,{transform: [{scale:animscale}],shadowColor: "#000",shadowOffset: {width: 0,height: 2,}, shadowOpacity: 0.25,shadowRadius: 3.84,elevation: 5,}]} onPress={() => this._displayRules()}>
                    <Text style = {{fontWeight: 'bold',fontSize: 20, color:'#ffffff'}}> {content[this.language].next.next2} </Text>
                  </TouchableOpacity>
                </View>
              </View>
    }

  }

  render() {
    let headerteam1 = this._teamheader(content[this.language].teams["team1"],0,'rgba(255,59,48,0.6)')
    let headerteam2 = this._teamheader(content[this.language].teams["team2"],1,'rgba(94,92,230,0.9)')
    let teamlist1 = this._teamlist(0)
    let teamlist2 = this._teamlist(1)
    let blockteam1= this._blocks(headerteam1,1,teamlist1,7,'rgba(255,59,48,0.4)')
    let blockteam2= this._blocks(teamlist2,7,headerteam2,1,'rgba(94,92,230,0.7)')

    const animscale = this.myscale.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.1]
    })

    const animpop = this.scalepop.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [-SCREEN_WIDTH*2, -SCREEN_WIDTH*0.5, SCREEN_WIDTH*2]
    })

    return (

      <View style={styles.main_container}>

      <ImageBackground source={require('../Images/background/tp.png')} blurRadius={0.4} opacity={0.4} imageStyle={{resizeMode:'cover'}} style={{width:SCREEN_WIDTH,height:SCREEN_HEIGHT,position:'absolute'}} />

        {this.explainteam(blockteam1,blockteam2,animscale,animpop)}

      </View>


    )
  }
}


const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor:'rgb(240,240,240)',
    paddingVertical:40
  },

  button_container: {
    width:SCREEN_WIDTH,
    height:60,
    top:SCREEN_HEIGHT/2-70,
    position:'absolute',
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row',
  },

  team : {
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
    color:'#ffffff'
  },


  team_names:{
    flexDirection:'row',
    alignItems:'center',
  },

  team_names_box:{
    flex:1,
    justifyContent:'center',
    flexDirection:'row',
  },

  team_number_box:{
    flex:1,
    height:50,
    alignItems:'center',
    justifyContent:'center',
  },
  next: {
    alignSelf:'flex-end',
    margin:20,
    height:25,
    width:25,
  },
})
