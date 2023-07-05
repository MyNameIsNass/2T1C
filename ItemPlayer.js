import React from 'react'
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions, Animated, PanResponder,Easing } from 'react-native'

const SCREEN_WIDTH = Math.round(Dimensions.get('window').width);
const SCREEN_HEIGHT = Math.round(Dimensions.get('window').height);

export default class ItemPlayer extends React.Component {

  _isMounted = false;

  componentDidMount () {
    this._isMounted=true
    if (this._isMounted=true){
      this.Animateadd()
    }
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  constructor(props) {
    super(props);

    this.position = new Animated.ValueXY();

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gesture) => {
        this.setState({index:1,grabshowing:1})
        this.position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (evt, gesture) => {
        this.resetPosition();

        let distmid = this.state.myPage[1] - SCREEN_HEIGHT/2

        if (distmid * (distmid + gesture.dy) < 0 ) {
          this.props.button_function[0](this.props.player)
        }
        this.setState({index:0,myPage:0,grabshowing:0})
      },
    });

    this.state = {
      index:0,
      myPage:[0,0],
      grabshowing:0,
      deleteactive:false
    }

    this.scaleadd = new Animated.Value(0.9)
    this.scaledelete = new Animated.Value(0)
  };

  Animateadd() {
    this.scaleadd.setValue(0.9)
    Animated.spring(this.scaleadd,{
      toValue: 1,
      friction: 4,
      useNativeDriver: false,
    }).start(() => this.activedelete())
  }

  activedelete(){
    setTimeout(() => this.setState({deleteactive:true}))
  }


  Animatedelete(button,player) {
    if (this.state.deleteactive){
      this.scaledelete.setValue(0)
      Animated.timing(this.scaledelete, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.linear
      }).start(() => button[0](player))
    }
  }


  getCardStyle() {
    const { position } = this;
    return {
      ...position.getLayout(),
    };
  }

  resetPosition() {
    Animated.spring(this.position, {
      toValue: {x:0,y:0},
      useNativeDriver: false,
    }).start();
  };


  render() {
      const {avatar, button, player, button_function,format} = this.props
      let itemformat

      const scaledelete = this.scaledelete.interpolate({
        inputRange: [0, 1],
        outputRange: [0, SCREEN_WIDTH]
      })



      if (format === 'big'){
        return <Animated.View style={[styles.main_container,{transform: [{scale:this.scaleadd},{translateX:scaledelete}],margin:15,height:35}]}>
                        <View style={[styles.figure_container, {padding:5}]}>
                          <Image style={{width:45,height:45}} source={avatar} />
                        </View>
                        <View style={{flex:1,flexDirection:'row'}}>
                          <Text style={{flex:1,fontWeight:'bold',fontSize: 16,flexWrap:'wrap'}}> {player} </Text>
                        </View>
                        <TouchableOpacity style={styles.close_container} onPress={() => {this.Animatedelete(button_function,player)}}>
                          <Image style={{width:20,height:20}} source={button} />
                        </TouchableOpacity>
                      </Animated.View >
      } else if (format === 'small'){
        if (this.state.grabshowing === 0) {
          return <Animated.View
                          onTouchStart={(e) => {this.setState({myPage:[e.nativeEvent.pageX,e.nativeEvent.pageY],grabshowing:1})}}
                          {...this._panResponder.panHandlers}
                          style={[this.getCardStyle(),styles.main_container,{height:26,zIndex:this.state.index,elevation:this.state.index,width:SCREEN_WIDTH/2-25,margin:5}]}>

                          <View style={[styles.figure_container, {padding:4}]}>
                            <Image style={{width:24,height:24}} source={avatar} />
                          </View>
                          <View style={{flex:1,flexDirection:'row'}}>
                            <Text style={{flex:1,fontWeight:'bold',fontSize: 14,flexWrap:'wrap'}}> {player} </Text>
                          </View>
                          <View style={styles.close_container}>
                            <Image style={{width:15,height:15}} source={button} />
                          </View>
                        </Animated.View>
        } else {
          return <Animated.View
                          onTouchStart={(e) => {this.setState({myPage:[e.nativeEvent.pageX,e.nativeEvent.pageY]})}}
                          {...this._panResponder.panHandlers}
                          style={[this.getCardStyle(),{zIndex:this.state.index,elevation:this.state.index,borderRadius:40,}]}>

                          <View style={[styles.figure_container, {padding:5}]}>
                            <Image style={{width:55,height:55}} source={avatar} />
                          </View>
                        </Animated.View>
        }
      }
  }
}

const styles = StyleSheet.create({
  main_container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor:'rgb(200,200,200)',
    borderRadius:30,
    backgroundColor:'rgba(255,255,255,0.5)',
  },

  figure_container: {
    backgroundColor:'rgb(255,255,255)',
    borderWidth:0,
    borderColor:'rgb(230,230,230)',
    borderRadius:40,
  },

  name_container: {
    flex:1,

  },

  close_container: {
    alignItems: 'center',
    justifyContent:'center',
    width:40,
  },
})
