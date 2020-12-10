import Icon from 'react-native-vector-icons/Foundation';
import React from 'react';
import { Pressable, StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native';
import { connect } from 'react-redux'

import MediaModule from '../packages/Modules';

class CurrentSongScreen extends React.Component {

    _previous = () =>{
        MediaModule.previous()
    }

    _play = () =>{
        MediaModule.playPause()
    }

    _next = () =>{
        MediaModule.next()
    }


    _onStartShouldSetResponder(){
        console.log("onStartShouldSetResponder Child")
        return true
    }

    render() {
        //TODO animation onButtonPress
      return (
          <View style={styles.mainContainer}>
              <Text>Hello</Text>
          </View>
    )
    }
}

const styles = StyleSheet.create({
    mainContainer:{
        flex: 1
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
)(CurrentSongScreen)
