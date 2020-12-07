import React from 'react';
import {Animated, Dimensions, PanResponder, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { connect } from 'react-redux'
import { createStackNavigator } from '@react-navigation/stack';

import CurrentSong from '../CurrentSong';
import MainAppbar from '../MainAppbar';
import SongsList from './SongsList'

const SecondRoute = () => (
  <View style={{ backgroundColor: '#673ab7', flex: 1}} />
);
  
  
const initialLayout = { width: Dimensions.get('window').width };

const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: 'orange' }}
      scrollEnabled={true}
      tabStyle={{width:100}}
      style={{ backgroundColor: 'lightskyblue' }}
      pressColor="rgba(0, 0, 0, 0)"
    />
  );
  
class TabsScreen extends React.Component {

    constructor(props) {
        super(props)
    

        this.state = {
            renderScene: null,
             index: 0,
             tabs: [
            { key: 'first', title: 'Titles' },
            { key: 'second', title: 'Second' },{ key: 'third', title: 'third' },{ key: 'fourth', title: 'fourth' },{ key: 'fifth', title: 'fifth' },]
        };
    }

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
        console.log("CurrentSongOnTouch")
        this.props.navigation.navigate("CurrentSong",  {})
    }

    _onLayout = (event) => {
        this.currentSongViewY = event.nativeEvent.layout.y
        // console.log(event.nativeEvent)
    }

    SongsTab = () => {
        return(
            <SongsList style={styles.container} songs={this.props.songs}/>
        )
    }

    render() {
        if(this.state.renderScene == null){
            this.state.renderScene = SceneMap({
                    first: SongsTab,
                    second: SecondRoute,
                    third: SecondRoute,
                    fourth: SecondRoute,
                    fifth: SecondRoute,
                });
        }
        return (
            <View style={styles.container}> 
                <MainAppbar />
                <TabView
                    renderTabBar={renderTabBar}
                    navigationState={{index : this.state.index, routes: this.state.tabs}}
                    renderScene={this.state.renderScene}
                    onIndexChange={(i) => {this.setState({ index: i })}}
                    initialLayout={initialLayout}
                    />
                <View {...this.panResponder.panHandlers} onLayout={this._onLayout}>
                    <CurrentSong/>
                </View>
            </View>
        );
    }
}

export default TabsScreen

class _SongsTab extends React.Component {
    render(){
        return (
            <SongsList style={styles.container} songs={this.props.songs}/>
        )
    }
}

const mapStateToProps = (state) => {
  return {
    songs: state.songs
  }
}

const SongsTab = connect(mapStateToProps, null)(_SongsTab)

const styles = StyleSheet.create({
    container: {
        marginTop: 0,
        flex: 1
    },
    scene: {
        flex: 1,
    },
    bigText: {
        fontSize: 60,
    },
    viewPager: {
        flex: 1,
    },
    test: {
        height:70,
        flex:1
    },

});



