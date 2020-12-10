import Icon from 'react-native-vector-icons/Foundation';
import React from 'react';
import { Pressable, StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native';
import { connect } from 'react-redux'

import MediaModule from '../packages/Modules';

class CurrentSongBar extends React.Component {

    _previous = () =>{
        console.log("_previous")
        MediaModule.previous()
        // const action = { type: "UPDATE_SONGS", value: [{artist:"This is", title:"" + Math.random()}] }
        // this.props.dispatch(action)

    }

    _play = () =>{
        console.log("_play")
        MediaModule.playPause()
    }

    _next = () =>{
        console.log("_next")
        MediaModule.next()
    }

    render() {
        //TODO animation onButtonPress
      return (
          <View style={styles.container}>
            <View style={styles.cover}></View>
            <View style={styles.textContainer}>
                <View style={styles.artistTextContainer}>
                    <Text numberOfLines={1} style={styles.artistText}>{this.props.song.artist}</Text>
                </View>
                <View  style={styles.titleTextContainer}>
                    <Text numberOfLines={1} style={styles.titleText}>{this.props.song.title}</Text>
                </View>
            </View>
            <View style={styles.buttonsView}> 
                <Pressable  onPress={this._previous} style={styles.button}>
                    {/*Encapsulate in view because I want the view to take all the height to detect touch events, and TouchableWithoutFeedback doesn't seems to take a height*/}
                        <Icon name="previous" size={40} color="#3F2F2F" style={{paddingRight : 6}} />
                </Pressable>
                <Pressable  onPress={this._play} style={styles.button}>
                        <Icon name={this.props.playState == "play" ? "pause" : "play"} size={40} color="#3F2F2F"/>
                </Pressable>
                <Pressable  onPress={this._next} style={styles.button}>
                        <Icon name="next" size={40} color="#3F2F2F"/>
                </Pressable>

            </View>
          </View>
    )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "blue",
        height:70,
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
        flex: 3,
        height:70,
        flexDirection: "row",
        // backgroundColor:"red",
    },
    button:{
        height:70,
        flex:1,
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
