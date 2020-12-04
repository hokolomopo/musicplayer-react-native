import React from 'react';
import {Dimensions, FlatList, StyleSheet, Text, View} from 'react-native';
import { SceneMap, TabView } from 'react-native-tab-view';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { connect } from 'react-redux'
import { createStackNavigator } from '@react-navigation/stack';

import MainAppbar from './MainAppbar';
import MediaModule from '../packages/Modules';
import TabComponent from './tabs/TabComponent';

const data = ["a", "z","e","r","t","y","u","i","o","p","q","s","d","f","g","h","j","k","l","m","ù","w","x"]



const Stack = createStackNavigator();

const initialLayout = { width: Dimensions.get('window').width };

class HomeScreen extends React.Component {

    constructor(props) {
        super(props)
    
    }

    componentDidMount(){
        this._getSongs()
    }

    async _getSongs() {
        console.log("GetSongs")
        const media = await MediaModule.getMedia();
        const action = { type: "UPDATE_SONGS", value: media }
        this.props.dispatch(action)
    }

    _onTouch = () => {
        this.props.navigation.navigate("CurrentSong",  {})
    }

    _Home = () => {
        return(
            <View style={styles.container}>
                <TabComponent/>
                <TouchableOpacity onPressOut = { this._onTouch } style={styles.currentSong}>
                    <Text>CurrentSong</Text>
                </TouchableOpacity>
            </View>
        )
    }

    _CurrentSong(){
        return(
            <Text>CurrentSong</Text>
        )
    }

  render() {
    return (
      <Stack.Navigator initialRouteName="Home" edgeWidth={50} style={styles.stackNavigator} screenOptions={{headerShown: false}}>
            <Stack.Screen name="Home" component={this._Home}/>
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
