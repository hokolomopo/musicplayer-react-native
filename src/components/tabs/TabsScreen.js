import LinearGradient from 'react-native-linear-gradient';
import React from 'react';
import {Dimensions, PanResponder, StatusBar, StyleSheet, Text, TextInput, View} from 'react-native';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { connect } from 'react-redux'
import { createStackNavigator } from '@react-navigation/stack';

import CurrentSongBar from '../CurrentSongBar';
import MainAppbar from '../MainAppbar';
import MediaModule from '../../packages/Modules';
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
  
// Screen with a list of tabs
class TabsScreen extends React.Component {

    constructor(props) {
        super(props)
    

        this.state = {
            renderScene: null,
             index: 0,
             tabs: [
                { key: 'titles', title: 'Titles' },
                { key: 'second', title: 'Artists' },
                { key: 'third', title: 'Albums' },
                { key: 'fourth', title: 'Playlists' },
                { key: 'fifth', title: 'Folders' },]
        };
    }

    // Change navbar color on mount or on navigation
    componentDidMount() {
        MediaModule.changeNavBarColor("white")
        
        this.navListener = this.props.navigation.addListener('focus', (e) => {
            MediaModule.changeNavBarColor("white")
        });

    }

    componentWillUnmount() {
        this.props.navigation.removeListener(this.navListener)
      }


    SongsTab = () => {
        return(
            <SongsList style={styles.container} songs={this.props.songs}/>
        )
    }

    render() {
        if(this.state.renderScene == null){
            this.state.renderScene = SceneMap({
                    titles: SongsTab,
                    second: SecondRoute,
                    third: SecondRoute,
                    fourth: SecondRoute,
                    fifth: SecondRoute,
                });
        }
        return (
            <View style={styles.container}> 
                <StatusBar backgroundColor="rgba(0,0,0,1)" barStyle={"light-content"} translucent={true}/>
                <MainAppbar title="MusicPlayer" navigation={this.props.navigation} currentTab={this.state.tabs[this.state.index].key}/>
                <TabView
                    renderTabBar={renderTabBar}
                    navigationState={{index : this.state.index, routes: this.state.tabs}}
                    renderScene={this.state.renderScene}
                    onIndexChange={(i) => {this.setState({ index: i })}}
                    initialLayout={initialLayout}
                    />
                <CurrentSongBar navigation={this.props.navigation}/>
            </View>
        );
    }
}

export default TabsScreen

// Wrapper for a SongList with Redux
class _SongsTab extends React.Component {
    render(){
        return (
            <SongsList style={styles.container} songs={this.props.songs} sortBy={this.props.sortBy}/>
        )
    }
}

const mapStateToProps = (state) => {
  return {
    songs: state.MediaReducer.songs,
    sortBy: state.UIReducer.sortSongsBy
  }
}

const SongsTab = connect(mapStateToProps, null)(_SongsTab)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        // backgroundColor:"blue",
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



