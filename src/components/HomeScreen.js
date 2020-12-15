import React from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import {NativeEventEmitter, NativeModules, StyleSheet} from 'react-native';
import { connect } from 'react-redux'

import CurrentPlaylistScreen from './CurrentPlaylistScreen';
import CurrentSongScreen from './CurrentSongScreen';
import MediaModule from '../packages/Modules';
import TabsScreen from './tabs/TabsScreen';

const { EVENT_SONG_CHANGED , EVENT_PLAY_PAUSE} = MediaModule.getConstants();

const Stack = createStackNavigator();

// Home screen of the application
class HomeScreen extends React.Component {

    constructor(props) {
        super(props)
    
    }

    // Define listeners that will recieve events from the Android code
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

    // Get all the songs from the Android code
    async _getSongs() {
        console.log("GetSongs")
        const media = await MediaModule.getMedia();
        
        let aa = [...media]

        // delete duplicates
        let seen = new Set();
        aa= aa.filter(item => {
            return seen.has(item) ? false : seen.add(item);
        });
    

        const action = { type: "UPDATE_SONGS", value: aa }
        this.props.dispatch(action)
    }



  render() {
    return (
      <Stack.Navigator 
          initialRouteName="Home" 
          edgeWidth={50} 
          style={styles.stackNavigator}
          screenOptions={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS  }}
            on
          >
            <Stack.Screen name="Home" component={TabsScreen}/>
            <Stack.Screen name="CurrentSong" component={CurrentSongScreen}/> 
            <Stack.Screen name="CurrentPlaylist" component={CurrentPlaylistScreen}/> 

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
