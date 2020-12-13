import Icon from 'react-native-vector-icons/Foundation';
import React from 'react';
import TextTicker from 'react-native-text-ticker'
import { PanResponder, StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native';
import { connect } from 'react-redux'

import RoundIconButton from './util/RoundIconButton';
import { MEDIA_ACTIONS } from '../store/MediaReducer';
import {TextTickerOptions} from '../util/Constants'

class CurrentSongBar extends React.Component {

    currentSongViewY = 0
    touchDowntime = 0

    panResponder = PanResponder.create({
        // Ask to be the responder:
        onStartShouldSetPanResponder: () => true,
        onStartShouldSetPanResponderCapture: () =>
            false,
        onMoveShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponderCapture: () =>
            false,
        onPanResponderTerminationRequest: () =>
            false,
        onShouldBlockNativeResponder: () => {
            return false
        },
        onPanResponderGrant: (event, gestureState) => {          
            this.touchDowntime = performance.now()
        },
        onPanResponderMove: (event, gestureState) => {
            // console.log(gestureState)
        },
        onPanResponderRelease: (event, gestureState) => {
            //End of touch inside the component
            if(gestureState.moveY >= this.currentSongViewY)
                this._onTouch()
            
            //Swipe up movement
            let elapsedTime = performance.now() - this.touchDowntime
            // console.log("ElapsedTime : " + elapsedTime + " dy : " + gestureState.dy)
            if(elapsedTime < 300 && gestureState.dy < -60)
                this._onTouch()
        }

        })

    _onTouch = () => {
        this.props.navigation.navigate("CurrentSong",  {})
    }

    _onLayout = (event) => {
        this.currentSongViewY = event.nativeEvent.layout.y
        // console.log(event.nativeEvent)
    }


    render() {
      return (
          <View style={styles.mainContainer}>
            <View {...this.panResponder.panHandlers} onLayout={this._onLayout} style={styles.container}>
                <View style={styles.cover}></View>
                <View style={styles.textContainer}>
                    <View style={styles.artistTextContainer}>
                        <TextTicker {...TextTickerOptions} style={styles.artistText}>{this.props.song.artist}</TextTicker>
                    </View>
                    <View  style={styles.titleTextContainer}>
                        <TextTicker {...TextTickerOptions} style={styles.titleText}>{this.props.song.title}</TextTicker>
                    </View>
                </View>
            </View>
            <View style={styles.buttonsView}> 
                <RoundIconButton 
                        onPress={() => {this._previous}} 
                        icon={<Icon name="previous" size={40} color="#3F2F2F" style={{paddingRight : 6}} />} 
                        style={styles.button} 
                        hitSlop={5}/> 
                <RoundIconButton 
                        onPress={() => {this._play}} 
                        icon={<Icon name={this.props.playState == "play" ? "pause" : "play"} size={40} color="#3F2F2F" />} 
                        style={styles.button} 
                        hitSlop={5}/> 
                <RoundIconButton 
                        onPress={() => {this._previous}} 
                        icon={<Icon name="next" size={40} color="#3F2F2F" />} 
                        style={styles.button} 
                        hitSlop={5}/> 
            </View>
          </View>
    )
    }

    _previous = () =>{
        console.log("_previous")
        this.props.dispatch({ type: MEDIA_ACTIONS.previousSong })
    }

    _play = () =>{
        console.log("_play")
        this.props.dispatch({ type: MEDIA_ACTIONS.togglePlayState })
    }

    _next = () =>{
        console.log("_next")
        this.props.dispatch({ type: MEDIA_ACTIONS.nextSong })
    }

}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: "blue",
        height:70,
        flexDirection: "row",
        alignItems: "center"
    },
    container:{
        flex:2,
        flexDirection: "row",
        alignItems: "center"

    },
    cover: {
        height: 55,
        width: 55,
        backgroundColor: "gray",
        margin: 7.5,
        marginRight: 15
    },
    textContainer: {
        flex : 4,
        marginRight: 10,
    },
    artistTextContainer:{
        flex : 1,
        justifyContent : "flex-end"
    },
    titleTextContainer:{
        flex : 1,
        justifyContent : "flex-start"
    },
    titleText: {
    },
    artistText: {
        fontSize: 17
    },
    buttonsView: {
        flex: 1,
        height:70,
        flexDirection: "row",
        justifyContent: 'space-around',
        // backgroundColor:"red",
    },
    button:{
        // height:70,
        // flex:1,
        // backgroundColor:"orange",
        justifyContent: "center",
        alignItems:"center"
    }

});

const mapStateToProps = (state /*, ownProps*/) => {
  return {
    song: state.MediaReducer.currentSong,
    playState: state.MediaReducer.playState
  }
}


export default connect(
  mapStateToProps,
  null
)(CurrentSongBar)
