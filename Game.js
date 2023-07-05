import React from 'react'
import { StyleSheet, View, TextInput, Button, Text, FlatList,TouchableOpacity,Image,ImageBackground,Dimensions,Animated, Easing,ScrollView } from 'react-native'
import {shuffle} from '../Functions/Functions'
import content from "../Data/content.json"
import colors from "../Data/colors.json"

import Explain from '../Images/Game/explain.svg'
import Answer from '../Images/Game/answer.svg'
import Cross from '../Images/Game/cross.svg'
import Tick from '../Images/Game/tick.svg'


const SCREEN_WIDTH = Math.round(Dimensions.get('screen').width);
const SCREEN_HEIGHT = Math.round(Dimensions.get('screen').height);


export default class Game extends React.Component {

  componentDidMount () {
    this.AnimateScale()
    this.AnimateTranslate()
  }

  constructor(props) {
    super(props)
    let { params } = this.props.navigation.state;
    this.temp_players = params ? params.temp_players : null
    this.temp_games = params ? params.temp_games : null
    this.language = params ? params.language : "GB"
    this.teams = [Object.keys(this.temp_players).filter(player => this.temp_players[player].team==0),Object.keys(this.temp_players).filter(player => this.temp_players[player].team==1)]
    this.max = 2
    this.maxplayers = Math.min(this.max,this.teams[0].length,this.teams[1].length)

    this.games = [shuffle([...this.temp_games]).filter(game => (game.type==="classic" && game.language === this.language && game.number<=this.maxplayers)),shuffle([...this.temp_games]).filter(game => (game.type=="special" && game.language === this.language  && game.number<=this.maxplayers))]


    let playersOne
    let playersTwo

    if (this.games[0][0].number === 0){
      playersOne = [content[this.language].teams.team1]
      playersTwo = [content[this.language].teams.team2]
    } else {
      playersOne = shuffle(this.teams[0]).slice(0,this.games[0][0].number)
      playersTwo = shuffle(this.teams[1]).slice(0,this.games[0][0].number)
    }

    this.colors=colors[0]

    this.state = {
      points : [0,0],
      indexplayer:0,
      indexteam:0,
      indexgeneral:0,
      hidexplain:1,
      players:[playersOne,playersTwo],
      previouswin:0,
      previousplayers:[],
      previouspoint:0,
      recover:0,
      showchoices:0,
      showanswer:0,
      loser:[0,0],
      showgame:1,
      showplayers:true,
      teamwin:0,
      showteam:1
    }
    this.myscale = new Animated.Value(0)
    this.scalepop = new Animated.Value(0.5)
    this.translate = new Animated.Value(0)
    this.translateteam = new Animated.Value(0)
  }

  Animatepop() {
    this.scalepop.setValue(0.5)
    Animated.spring(this.scalepop,{
      toValue: 1,
      friction: 4,
      useNativeDriver: false,
    }).start()
  }

  AnimateTranslate () {
    this.translate.setValue(0)
    Animated.sequence([
      Animated.timing(this.translate, {
        toValue: 0.5,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.linear
      }),
      Animated.delay(1500),
      Animated.timing(this.translate, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.linear
      }),
    ]).start(()=>{this.setState({showplayers:false})})
  }

  AnimateTranslateTeam (state) {
    Animated.timing(this.translateteam, {
      toValue:state,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.linear
    }).start()
  }

  AnimateScale () {
    this.myscale.setValue(1)
    Animated.sequence([
      Animated.timing(this.myscale, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.linear
      }),
      Animated.delay(1000)
    ]).start(() => this.AnimateScale())
  }

  _next = (addpoints,team) => {
    let newindexgeneral = this.state.indexgeneral + 1
    let newpoints = this.state.points.map((x,i) => x + addpoints * (1-i-team+2*i*team))
    let previouswin = team
    let previousplayers = this.state.players
    if ((newindexgeneral+1) % 8 === 0){
      let newindexteam = (this.state.indexteam + 1) % this.games[1].length
      let loser = newpoints[0]<newpoints[1]?0:1

      this.setState({
        indexteam:newindexteam,
        points:newpoints,
        indexgeneral:newindexgeneral,
        previouswin:previouswin,
        previousplayers:previousplayers,
        previouspoint:addpoints,
        players:[[content[this.language].teams.team1],[content[this.language].teams.team2]],
        recover:1,
        showchoices:1,
        loser:[0,loser],
        showplayers:true,
        teamwin:0
      })
    } else {
      this.setState({
        teamwin:team+1
      })
      setTimeout(() => {
        this.AnimateTranslate()
        let newindexplayer = (this.state.indexplayer + 1) % this.games[0].length
        let playersOne
        let playersTwo
        if (this.games[0][newindexplayer].number === 0){
          playersOne = [content[this.language].teams.team1]
          playersTwo = [content[this.language].teams.team2]
        } else {
          playersOne = shuffle(this.teams[0]).slice(0,this.games[0][newindexplayer].number)
          playersTwo = shuffle(this.teams[1]).slice(0,this.games[0][newindexplayer].number)
        }
        this.setState({
          indexplayer:newindexplayer,
          points:newpoints,
          indexgeneral:newindexgeneral,
          previouswin:previouswin,
          previousplayers:previousplayers,
          previouspoint:addpoints,
          players:[playersOne,playersTwo],
          recover:1,
          showchoices:0,
          showplayers:true,
          teamwin:0
        })
      },200)
    }

    let temp_players = this.temp_players
    if (newpoints[0] >= 42) {
      let winner = 0
      let teams = this.teams
      let language = this.language
      this.props.navigation.navigate("EndGame",{winner,teams,temp_players,language})
    } else if (newpoints[1] >= 42) {
      let winner = 1
      let teams = this.teams
      let language = this.language
      this.props.navigation.navigate("EndGame",{winner,teams,temp_players,language})
    }
  }

  afterchoice = (addpoints,team) => {
    let loserteam = (this.state.loser[1] + team)%2
    let loserpoint = addpoints
    this.setState({
      recover:1,
      showchoices:0,
      loser:[loserpoint,loserteam]
    })
  }

  isdone = (done) => {
    if (done === true){
      this._next(this.state.loser[0] * this.games[1][this.state.indexteam].point,this.state.loser[1])
    } else {
      this._next(0,0)
    }
  }

  previousgame(){
    if (this.state.indexgeneral > 0){
      let newindexgeneral = this.state.indexgeneral - 1
      let players = this.state.previousplayers

      if ((this.state.indexgeneral) % 8 === 0){
        let newindexteam = this.state.indexteam

        let newpoints = this.state.points.map((x,i) => x - this.state.previouspoint * (1-i-this.state.previouswin+2*i*this.state.previouswin))
        this.setState({
          indexteam:newindexteam,
          points:newpoints,
          indexgeneral:newindexgeneral,
          players:players,
          recover:0,
          showchoices:0
        })
      } else {
        let newindexplayer

        if ((this.state.indexgeneral+1)%8 === 0) {
          newindexplayer = this.state.indexplayer
        } else if (this.state.indexplayer === 0){
          newindexplayer = this.games[0].length-1
        } else {
          newindexplayer = (this.state.indexplayer - 1) % this.games[0].length
        }

        let newpoints = this.state.points.map((x,i) => x - this.state.previouspoint * (1-i-this.state.previouswin+2*i*this.state.previouswin))
        this.setState({
          indexplayer:newindexplayer,
          points:newpoints,
          indexgeneral:newindexgeneral,
          players:players,
          recover:0,
          showchoices:0
        })
      }

    }
  }

  myquestion(){
    if ((this.state.indexgeneral + 1) % 8 === 0){
      return this.games[1][this.state.indexteam]
    } else {
      return this.games[0][this.state.indexplayer]
    }
  }


  buttonAnswer(){
    let button= <TouchableOpacity style={{position:'absolute',top:20,right:20,flexDirection:'row',alignItems:'center'}} onPress={() => this.answer()}>
                  <Text style={{textAlign:'center',fontWeight: 'bold',fontSize:15,color:'rgba(200,200,200,1)'}}> {content[this.language].button.answer}  </Text>
                  <Answer height={35} width={35}/>
                </TouchableOpacity>
    if ((this.state.indexgeneral + 1) % 8 === 0){
      if ("answer" in this.games[1][this.state.indexteam]){
        return button
      } else {
        return null
      }
    } else {
      if ("answer" in this.games[0][this.state.indexplayer]){
        return button
      } else {
        return null
      }
    }
  }

  buttonExplain(){
    let button= <TouchableOpacity style={{position:'absolute',top:20,left:20,flexDirection:'row',alignItems:'center'}} onPress={() => this.hidexplain()}>
                  <Explain height={30} width={30}/>
                  <Text style={{marginLeft:20, textAlign:'center',fontWeight: 'bold',fontSize:15,color:'rgba(200,200,200,1)'}}> {content[this.language].button.explain}  </Text>
                </TouchableOpacity>
    if ((this.state.indexgeneral + 1) % 8 === 0){
      if ("explain" in this.games[1][this.state.indexteam]){
        return button
      } else {
        return null
      }
    } else {
      if ("explain" in this.games[0][this.state.indexplayer]){
        return button
      } else {
        return null
      }
    }
  }


  myplayer = (player) => {
    let myplayer = player
    if (myplayer === content[this.language].teams.team1 || myplayer === content[this.language].teams.team2) {
      myplayer = content[this.language].fullteam
    }
    return (<Text key={player} style={{textAlign:'center',fontWeight: 'bold',fontSize:16,color:'rgba(0,0,0,0.5)'}}> {myplayer} </Text>)
  }

  teamplayers(data){
    return (<View>
              {data.map(this.myplayer)}
            </View>)
  }

  myplayer2 = (player,size) => {
    let myplayer = player
    if (myplayer === content[this.language].teams.team1 || myplayer === content[this.language].teams.team2) {
      myplayer =  content[this.language].fullteam
    }

    if (size === 'big') {
      let avatar
      if (player === content[this.language].teams.team1) {
        avatar = <Image style={{width:50,height:50,margin:5}} source={require('../Images/peach.png')}/>
      } else if (player === content[this.language].teams.team2) {
        avatar = <Image style={{width:50,height:50,margin:5}} source={require('../Images/eggplant.png')}/>
      } else {
        avatar = <Image style={{width:50,height:50,margin:5}} source={this.temp_players[player].avatar}/>
      }
      return  <View key={player} style={{alignItems:'center'}} >
                <View style={{flexDirection:'row', alignItems:'center',width:2*SCREEN_WIDTH/3}}>
                    {avatar}
                  <Text style={{flex:1,textAlign:'center',fontWeight: 'bold',fontSize:18,color:'rgba(0,0,0,0.5)'}}> {myplayer} </Text>
                </View>
              </View>
    } else {
      let avatar
      if (player === content[this.language].teams.team1) {
        avatar = <Image style={{width:30,height:30,margin:5}} source={require('../Images/peach.png')}/>
      } else if (player === content[this.language].teams.team2) {
        avatar = <Image style={{width:30,height:30,margin:5}} source={require('../Images/eggplant.png')}/>
      } else {
        avatar = <Image style={{width:30,height:30,margin:5}} source={this.temp_players[player].avatar}/>
      }
      return  <View key={player} style={{alignItems:'center'}} >
                <View style={{alignItems:'center'}}>
                    {avatar}
                  <View style={{flexDirection:'row',width:SCREEN_WIDTH/5,height:40}}>
                    <Text style={{flex:1,textAlign:'center',fontWeight: 'bold',fontSize:15,color:'rgba(0,0,0,0.5)'}}> {myplayer} </Text>
                  </View>
                </View>
              </View>
    }

  }

  teamplayers2(data,size){
    if (size === 'big') {
      return (<View style={{}}>
                {data.map(player => this.myplayer2(player,size))}
              </View>)
    } else {
      return (<View style={{flexDirection:'row',flexWrap:'wrap',justifyContent:'center'}}>
                {data.map(player => this.myplayer2(player,size))}
              </View>)
    }
  }

  hidexplain(){
    let myshow = (this.state.hidexplain + 1) % 2
    this.setState({
      hidexplain:myshow,
      showanswer:0
    })
  }

  theanswer(){
    if (this.state.showanswer === 1) {
      return  <View style={{position:'absolute',padding:30,width:SCREEN_WIDTH-20, height:SCREEN_HEIGHT-300,backgroundColor:'rgba(40,40,40,0.95)',justifyContent:'center',borderRadius:20}} onPress={() => this.hidexplain()}>
                <Text style = {{textAlign:'center',fontWeight: 'bold',fontSize:20,color:'#ffffff'}}> {this.myquestion().answer} </Text>
              </View>
    } else {
      return  null
    }
  }

  answer(){
    let myshow = (this.state.showanswer + 1) % 2
    this.setState({
      showanswer:myshow,
      hidexplain:1
    })
  }

  explainteam(){
    if (this.state.hidexplain === 0) {
      return  <View style={{position:'absolute',padding:30,width:SCREEN_WIDTH-20, height:SCREEN_HEIGHT-300,backgroundColor:'rgba(40,40,40,0.95)',justifyContent:'center',borderRadius:20}} onPress={() => this.hidexplain()}>
                <Text style = {{textAlign:'center',fontWeight: 'bold',fontSize:20,color:'#ffffff'}}> {this.myquestion().explain} </Text>
              </View>
    } else {
      return  null
    }
  }


  recover(rotationrecover) {
    if (this.state.recover === 0){
      return  <View style={{height:80,width:80,alignItems:'center', justifyContent:'center', marginVertical:15}}>

              </View>
    } else {
      return  <View style={{height:80,width:80,alignItems:'center', justifyContent:'center', marginVertical:15}}>
                <TouchableOpacity style={{transform:[{rotate:rotationrecover}]}} onPress={() => {this.setState({hidexplain:1,showanswer:0}),this.previousgame()}}>
                  <Image style={{height:35,width:35}} source={require('../Images/Game/refresh.png')}/>
                </TouchableOpacity>
                <Text style={{fontSize:15,fontWeight:'bold',color:'rgb(200,200,200)'}}> {content[this.language].recover} </Text>
              </View>
    }
  }

  pagechoices() {
    let loserteam
    if (this.state.loser[1] === 0) {
      loserteam = content[this.language].teams.team1
    } else {
      loserteam = content[this.language].teams.team2
    }

    if (this.state.showchoices === 0) {
      return null
    } else {
      this.Animatepop()
      return  <Animated.View style={{transform: [{scale:this.scalepop}],position:'absolute',width:SCREEN_WIDTH, height:SCREEN_HEIGHT,backgroundColor:'rgba(40,40,40,0.95)',justifyContent:'center'}} onPress={() => this.hidexplain()}>
                <View style={{justifyContent:'center'}}>
                  <Text style={{textAlign:'center',fontWeight:'bold',fontSize:25,color:'#ffffff'}}> {content[this.language].choices.title} </Text>
                </View>
                <View style={{margin:20,justifyContent:'center'}}>
                  <Text style={{textAlign:'center',fontWeight:'bold',fontSize:25,color:'#ffffff'}}> {this.games[1][this.state.indexteam].point} pts </Text>
                </View>
                <View style={{margin:30,justifyContent:'center'}}>
                  <Text style={{textAlign:'center',fontWeight:'bold',fontSize:18,color:'#ffffff'}}> {loserteam} {content[this.language].choices.subtitle1} </Text>
                </View>
                <TouchableOpacity style={[styles.choices,{backgroundColor:'rgb(48,209,88)',}]} onPress={() => {this.setState({hidexplain:1}),this.afterchoice(1,0)}}>
                  <Text style={[styles.text,{color:'#ffffff',fontSize:18}]}> {content[this.language].choices.choice1} </Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.choices,{backgroundColor:'rgb(255,69,58)',}]} onPress={() => {this.setState({hidexplain:1}),this.afterchoice(-1,1)}}>
                  <Text style={[styles.text,{color:'#ffffff',fontSize:18}]}> {content[this.language].choices.choice2} </Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.choices,{backgroundColor:'rgb(255,159,10)',}]} onPress={() => {this.setState({hidexplain:1}),this.afterchoice(0,1)}}>
                  <Text style={[styles.text,{color:'#ffffff',fontSize:18}]}> {content[this.language].choices.choice3} </Text>
                </TouchableOpacity>
                <View style={{margin:30,justifyContent:'center'}}>
                  <Text style={{textAlign:'center',fontWeight:'bold',fontSize:20,color:'#ffffff'}}>{content[this.language].choices.subtitle2} </Text>
                </View>
              </Animated.View>
    }
  }

  showteamschoice(animscale,rotationrecover){

    let loserteam
    if (this.state.loser[0] === 1) {
      if (this.state.loser[1] === 0) {
        loserteam = content[this.language].teams.team1
      } else {
        loserteam = content[this.language].teams.team2
      }
    } else {
      if (this.state.loser[1] === 0) {
        loserteam = content[this.language].teams.team2
      } else {
        loserteam = content[this.language].teams.team1
      }
    }

    if (this.state.showchoices === 1){
      return null
    } else if((this.state.indexgeneral + 1)%8 === 0){
      return  <View>
                <View>
                  <Text style={{textAlign:'center', fontWeight:'bold', fontSize:18,color:'rgba(0,0,0,0.5)'}}> {loserteam} {content[this.language].clickwinner.clickwinner2} </Text>
                </View>

                <View style={styles.header}>
                  <TouchableOpacity style={[styles.teams,{transform: [{scale:animscale}],borderColor:'rgba(200,200,200,0.5)',borderWidth:1,backgroundColor:'rgba(240,240,240,0.6)'}]} onPress={() => {this.setState({hidexplain:1,showanswer:0}),this.isdone(false)}}>
                    <Cross height={30} width={30}/>
                  </TouchableOpacity>

                  {this.recover(rotationrecover)}

                  <TouchableOpacity style={[styles.teams,{transform: [{scale:animscale}],borderColor:'rgba(200,200,200,0.5)',borderWidth:1,backgroundColor:'rgba(240,240,240,0.6)'}]} onPress={() => {this.setState({hidexplain:1,showanswer:0}),this.isdone(true)}}>
                    <Tick height={40} width={40}/>
                  </TouchableOpacity>
                </View>
              </View>
    } else {
      return  <View style={{height:120}}>
                <View>
                  <Text style={{textAlign:'center', fontWeight:'bold', fontSize:15,color:'rgb(200,200,200)'}}> {content[this.language].clickwinner.clickwinner1} </Text>
                </View>
                <View style={styles.header}>
                  <TouchableOpacity style={[styles.teams,{transform: [{scale:animscale}],flexDirection:'row',alignItems:'center',borderColor:'rgba(200,200,200,0.5)',borderWidth:1,backgroundColor:'rgba(240,240,240,0.6)'}]} onPress={() => {this.setState({hidexplain:1,showanswer:0}),this._next(this.myquestion().point,0)}}>
                    <Image style={{width:40,height:40}} source={require('../Images/peach.png')}/>
                    <View style={{justifyContent:'center'}}>
                      <Text style={[styles.text,{color:'rgba(0,0,0,0.5)',fontSize:20}]}> {this.state.points[0]}  </Text>
                    </View>
                  </TouchableOpacity>


                  {this.recover(rotationrecover)}

                  <TouchableOpacity style={[styles.teams,{transform: [{scale:animscale}],flexDirection:'row',alignItems:'center',borderColor:'rgba(200,200,200,0.5)',borderWidth:1,backgroundColor:'rgba(240,240,240,0.6)'}]} onPress={() => {this.setState({hidexplain:1,showanswer:0}),this._next(this.myquestion().point,1)}}>
                    <Image style={{width:40,height:40}} source={require('../Images/eggplant.png')}/>
                    <View style={{justifyContent:'center'}}>
                      <Text style={[styles.text,{color:'rgba(0,0,0,0.5)',fontSize:20}]}> {this.state.points[1]} </Text>
                    </View>
                  </TouchableOpacity>

                </View>

                <View style={{flexDirection:'row',width:SCREEN_WIDTH}}>
                  <View style={{flex:1,justifyContent:'center'}}>
                    <Text style={[styles.text,{fontSize:14,color:'rgb(200,200,200)'}]}> {content[this.language].teams.team1} </Text>
                  </View>
                  <View style={{width:80,alignItems:'center', justifyContent:'center'}}>
                  </View>
                  <View style={{flex:1,justifyContent:'center'}}>
                    <Text style={[styles.text,{fontSize:14,color:'rgb(200,200,200)'}]}> {content[this.language].teams.team2} </Text>
                  </View>
                </View>
              </View>
    }
  }


  showgame(){
    let entitle
    let points
    let color
    if ((this.state.indexgeneral + 1) % 8 === 0){
      if (this.state.loser[0] === 1){
        color = 'rgb(48,209,88)'
        if (this.state.loser[1] === 1) {
          points = '+' + this.myquestion().point + content[this.language].afterteamchoice.points + content[this.language].teams.team2
        } else {
          points = '+' + this.myquestion().point + content[this.language].afterteamchoice.points +  content[this.language].teams.team1
        }
      } else if (this.state.loser[0] === -1){
        color = 'rgb(255,69,58)'
        if (this.state.loser[1] === 1) {
          points = '-' + this.myquestion().point + content[this.language].afterteamchoice.points +  content[this.language].teams.team2
        } else {
          points = '-' + this.myquestion().point + content[this.language].afterteamchoice.points +  content[this.language].teams.team1
        }
      } else {
        color = 'rgb(255,159,10)'
        if (this.state.loser[1] === 1) {
          points = content[this.language].afterteamchoice.drinks +  content[this.language].teams.team2
        } else {
          points = content[this.language].afterteamchoice.drinks +  content[this.language].teams.team1
        }
      }

      let loserteam
      if (this.state.loser[0] === 1) {
        if (this.state.loser[1] === 0) {
          loserteam = content[this.language].teams.team1
        } else {
          loserteam = content[this.language].teams.team2
        }
      } else {
        if (this.state.loser[1] === 0) {
          loserteam = content[this.language].teams.team2
        } else {
          loserteam = content[this.language].teams.team1
        }
      }

      entitle = <View style={{flex:1,marginTop:30,justifyContent:'center'}}>
                  <View style={{height:30,justifyContent:'center',flexDiresction:'row'}}>
                    <Text style={[styles.cardtext,{flex:1,fontSize:22,color:'rgba(0,0,0,0.5)' }]}> {content[this.language].afterteamchoice.atStake} </Text>
                  </View>
                  <View style={{height:30,justifyContent:'center',flexDiresction:'row'}}>
                    <Text style={[styles.cardtext,{flex:1,fontSize:22,color:color }]}> {points} </Text>
                  </View>
                  <View style={{height:30,justifyContent:'center',alignItems:'center',flexDirection:'row',flex:1}}>
                    <Text style={[styles.cardtext,{alignSelf:'flex-end',fontSize:20,color:'rgba(0,0,0,0.5)'}]}> {loserteam}, </Text>
                  </View>
                </View>

    } else  {
      points =  '+' + this.myquestion().point + 'pts'
      entitle = <View style={{flex:1,marginTop:30,justifyContent:'center'}}>
                  <View style={{height:50,justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
                    <Text style={[styles.cardtext,{fontSize:22,color:'rgba(0,0,0,0.5)'}]}> {this.myquestion().title} </Text>
                  </View>
                  <View style={{height:50,justifyContent:'center',sflexDiresction:'row'}}>
                    <Text style={[styles.cardtext,{flex:1,fontSize:20,color:this.colors[this.myquestion().group] }]}> {points} </Text>
                  </View>
                </View>
    }

    if (this.state.showgame === 1) {
      return    <View style={{height:SCREEN_HEIGHT-300, margin:10,borderWidth:1,paddingHorizontal:SCREEN_WIDTH*0.05,paddingVertical:30,borderRadius:20,borderColor:'rgba(200,200,200,0.5)',backgroundColor:'rgba(240,240,240,0.9)'}}>

                  {entitle}

                  <View style={{flex:2,justifyContent:'center'}}>
                    <ScrollView>
                      <Text style={{textAlign:'center',flex:1,fontSize:20,color:'rgba(0,0,0,0.5)'}}> {this.myquestion().question} </Text>
                    </ScrollView>
                  </View>

                  {this.explainteam()}
                  {this.theanswer()}
                  {this.buttonExplain()}
                  {this.buttonAnswer()}
                </View>
    } else {
      return null
    }
  }

  showplayers(translateplayers){
    if (this.state.showplayers === true){
      return  <Animated.View style={{transform:[{translateX:translateplayers}],position:'absolute',width:SCREEN_WIDTH*1.5,height:SCREEN_HEIGHT,justifyContent:'center',backgroundColor:'rgba(240,240,240,0.95)',}}>
                <View style={{height:SCREEN_HEIGHT/2}}>
                  <View style={styles.players}>
                    {this.teamplayers2(this.state.players[0],'big')}
                  </View>

                  <View style={{height:60,alignItems:'center',justifyContent:'center'}}>
                      <Text style={{textAlign:'center',fontWeight: 'bold',fontSize:30,color:this.colors[this.myquestion().group] }}> VS </Text>
                  </View>

                  <View style={styles.players}>
                    {this.teamplayers2(this.state.players[1],'big')}
                  </View>
                </View>
              </Animated.View>
    } else {
      return null
    }
  }

  showteams(translateteams){
      return  <TouchableOpacity
                activeOpacity={1}
                style={{transform:[{translateY:translateteams}],position:'absolute',width:SCREEN_WIDTH,height:SCREEN_HEIGHT,justifyContent:'center',backgroundColor:'rgba(240,240,240,0.95)',}}
                onPress={()=>{ this.AnimateTranslateTeam(0) }}>

                <View style={{height:SCREEN_HEIGHT}}>
                  <View style={styles.players}>
                    {this.teamplayers2(this.teams[0],'small')}
                  </View>
                  <View style={{alignItems:'center',flexDirection:'row',justifyContent:'center',borderTopWidth:0.5,borderColor:'rgba(200,200,200,0.5)'}}>
                    <Text style={{textAlign:'center',fontWeight: 'bold',fontSize:18,color:'rgba(255,59,48,0.6)' }}> {content[this.language].teams.team1} </Text>
                    <Image style={{width:50,height:50,margin:5}} source={require('../Images/peach.png')}/>
                  </View>
                  <View style={{height:20,alignItems:'center',justifyContent:'center'}}>
                      <Text style={{textAlign:'center',fontWeight: 'bold',fontSize:14,color:'rgba(0,0,0,0.5)' }}> VS </Text>
                  </View>
                  <View style={{alignItems:'center',flexDirection:'row',justifyContent:'center',borderBottomWidth:0.5,borderColor:'rgba(200,200,200,0.5)'}}>
                    <Image style={{width:50,height:50,margin:5}} source={require('../Images/eggplant.png')}/>
                    <Text style={{textAlign:'center',fontWeight: 'bold',fontSize:18,color:'rgba(94,92,230,0.9)' }}> {content[this.language].teams.team2} </Text>
                  </View>
                  <View style={styles.players}>
                    {this.teamplayers2(this.teams[1],'small')}
                  </View>
                </View>
                <TouchableOpacity style={{position:'absolute',top:50,height:80,width:SCREEN_WIDTH,alignItems:'center'}} onPress={()=>{ this.AnimateTranslateTeam(0) }}>
                    <Image style={{height:20,width:20, opacity:0.5}} source={require('../Images/Game/close.png')}/>
                </TouchableOpacity>
              </TouchableOpacity>
  }

  teamwin(){
    if ((this.state.indexgeneral + 1) % 8 != 0){
      if (this.state.teamwin === 1){
        return  <View style={{position:'absolute',width:SCREEN_WIDTH,height:SCREEN_HEIGHT,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(240,240,240,0.5)'}}>
                  <Image style={{width:300,height:300}} source={require('../Images/peach.png')}/>
                </View>
      } else if (this.state.teamwin === 2){
        return  <View style={{position:'absolute',width:SCREEN_WIDTH,height:SCREEN_HEIGHT,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(240,240,240,0.5)'}}>
                  <Image style={{width:300,height:300}} source={require('../Images/eggplant.png')}/>
                </View>
      }
    } else {
      return null
    }
  }

  render() {

    const translateplayers = this.translate.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [-SCREEN_WIDTH*2, -SCREEN_WIDTH*0.25, SCREEN_WIDTH*2]
    })
    const translateteams = this.translateteam.interpolate({
      inputRange: [0, 1],
      outputRange: [-2*SCREEN_HEIGHT,0]
    })

    const animscale = this.myscale.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.96]
    })

    const animrotation = this.myscale.interpolate({
      inputRange: [0, 0.25, 0.75, 1],
      outputRange: ['0deg', '5deg', '-5deg', '0deg']
    })

    const rotationrecover = this.myscale.interpolate({
      inputRange: [0,0.8,1],
      outputRange: ['-360deg','0deg','0deg']
    })

    let color
    if ((this.state.indexgeneral + 1) % 8 === 0){
      color = 'rgba(0,0,0,0.7)'
    } else {
      color = this.colors[this.myquestion().group]
    }


    return (
      <View style={[styles.main_container,{backgroundColor:'rgb(240,240,240)'}]}>
        <ImageBackground source={require('../Images/background/tp.png')} blurRadius={0.4} opacity={0.4} imageStyle={{resizeMode:'cover'}} style={{width:SCREEN_WIDTH,height:SCREEN_HEIGHT,position:'absolute'}} />
        <View activeOpacity={1} style = {styles.card_container} >

          <TouchableOpacity
            activeOpacity={0.5}
            style={[styles.player_container,{height:80,borderColor: color,borderBottomWidth:2,backgroundColor:'rgba(240,240,240,0.5)'}]}
            onPress={()=>{ this.AnimateTranslateTeam(1) }}>

            <View style={styles.players}>
              {this.teamplayers(this.state.players[0])}
            </View>
            <View style={{width:50,height:80,alignItems:'center',justifyContent:'center'}}>
                <Text style={{textAlign:'center',fontWeight: 'bold',fontSize:30,color: color}}>VS</Text>
            </View>
            <View style={styles.players}>
              {this.teamplayers(this.state.players[1])}
            </View>
            <View style={{position:'absolute',width:SCREEN_WIDTH,alignItems:'center',top:0}}>
              <Image style={{height:20,width:20, opacity:0.1}} source={require('../Images/Game/menu.png')}/>
            </View>
          </TouchableOpacity>

          {this.showgame()}
          <View style={{position:'absolute',width:SCREEN_WIDTH,height:40,bottom:0,alignItems:'center'}}>
            <Image style={{height:20,width:60, opacity:0.2}} source={require('../Images/Game/2T1C.png')}/>
          </View>
        </View>

        {this.showteamschoice(animscale,rotationrecover)}
        {this.pagechoices()}
        {this.teamwin()}
        {this.showplayers(translateplayers)}
        {this.showteams(translateteams)}

      </View>

    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    height:SCREEN_HEIGHT,
    paddingTop:40,
    paddingBottom:40,
    paddingHorizontal:0
  },
  header:{
    flexDirection: 'row',
    justifyContent:'space-around',
    height:70,
  },
  next: {
    height:90,
    width:90,
  },

  logo: {
    height:250,
    width:250,
  },

  text: {
    textAlign:'center',
    fontWeight: 'bold',
  },
  teams:{
    height:50,
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    borderRadius:20,
    margin:15
  },
  card_container: {
  },

  player_container: {
    alignItems:'center',
    flexDirection:'row',
  },

  title_container: {
    height:100,
  },

  question_container: {
    flex:1,
  },

  players:{
    margin:5,
    justifyContent:'center',
    flex:1,
  },

  cardtext: {
    textAlign:'center',
    fontWeight: 'bold',
    flex:1
  },

  choices:{
    height:50,
    margin:10,
    justifyContent:'center',
    borderRadius:40
  },

})
