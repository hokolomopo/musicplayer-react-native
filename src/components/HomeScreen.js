import React from 'react';
import {Dimensions, NativeEventEmitter, NativeModules, StyleSheet, Text, TextInput} from 'react-native';
import { SceneMap, TabView } from 'react-native-tab-view';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { connect } from 'react-redux'
import { createStackNavigator } from '@react-navigation/stack';

import MainAppbar from './MainAppbar';
import MediaModule from '../packages/Modules';
import TabsScreen from './tabs/TabsScreen';

const { EVENT_SONG_CHANGED , EVENT_PLAY_PAUSE} = MediaModule.getConstants();



const Stack = createStackNavigator();


class HomeScreen extends React.Component {

    constructor(props) {
        super(props)
    
    }

    componentDidMount(){
        const eventEmitter = new NativeEventEmitter(NativeModules.MediaModule);
        this.eventListener = eventEmitter.addListener(EVENT_SONG_CHANGED, (event) => {
          console.log("Update current song event");
          const action = { type: "UPDATE_CURRENT_SONG", value: event.currentSong }
          this.props.dispatch(action)
        });
        this.eventListener = eventEmitter.addListener(EVENT_PLAY_PAUSE, (event) => {
          console.log("Event play pause event");
          const action = { type: "UPDATE_PLAY_STATE", value: event.playState }
          this.props.dispatch(action)
        });

        this._getSongs()
    }

    componentWillUnmount() {
      this.eventListener.remove();
    }

    async _getSongs() {
        console.log("GetSongs")
        const media = await MediaModule.getMedia();
        
        let aa = [...media]
        aa = media.slice(0, 15)
        // console.log(aa)
        
        const action = { type: "UPDATE_SONGS", value: aa }
        this.props.dispatch(action)
    }


    _CurrentSong(){
        return(
            <Text>CurrentSong</Text>
        )
    }

  render() {
    return (
      <Stack.Navigator initialRouteName="Home" edgeWidth={50} style={styles.stackNavigator} screenOptions={{headerShown: false}}>
            <Stack.Screen name="Home" component={TabsScreen}/>
            <Stack.Screen name="CurrentSong" component={this._CurrentSong}/> 
      </Stack.Navigator>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 0,
        flex: 1
    },
    scene: {
        flex: 1,
    },
    currentSong: {
        height: 80,
        backgroundColor : "orange"
    },
    bigText: {
        fontSize: 60,
    },
    viewPager: {
        flex: 1,
    },
    stackNavigator: {

    },

});


const mapStateToProps = (state /*, ownProps*/) => {
  return {
    songs: state.songs
  }
}

export default connect(
  mapStateToProps,
  null
)(HomeScreen)
