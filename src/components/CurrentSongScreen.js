import EntypoIcon from 'react-native-vector-icons/Entypo';
import FoundationIcon from 'react-native-vector-icons/Foundation';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React from 'react';
import Slider from '@react-native-community/slider';
import TextTicker from 'react-native-text-ticker'
import {Menu, MenuOption, MenuOptions, MenuTrigger, renderers} from 'react-native-popup-menu';
import { StatusBar, StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native';
import { connect } from 'react-redux'

import MediaModule from '../packages/Modules';
import MyMenuOption from './util/MyMenuOption';
import RoundIconButton from './util/RoundIconButton';
import { MEDIA_ACTIONS } from '../store/MediaReducer';
import {TextTickerOptions} from '../util/Constants'

const LOOP_ICONS = ["repeat", "repeat", "repeat-once"]

class CurrentSongScreen extends React.Component {

    constructor(props) {
        // console.log("Constructor CurrentSongScreen")
        super(props)

        this.state = {
            appBarColor: "#373940"
        }
    }

    componentDidMount() {
        this.navListener = this.props.navigation.addListener('focus', (e) => {
            MediaModule.changeNavBarColor("#454853")
        });

        this.navListener = this.props.navigation.addListener('blur', (e) => {
            this.setState({appBarColor:"black"})
        });

    }

    componentWillUnmount() {
        this.props.navigation.removeListener(this.navListener)
    }
    
    _Menu = (
        <Menu ref={(ref) => { this.menuRef = ref; }}>
            <MenuTrigger>
                <RoundIconButton 
                    onPress={() => {this.menuRef.open()}} 
                    icon={<EntypoIcon name="dots-three-vertical" size={20} color="white"/>} 
                    style={styles.optionButton} 
                    hitSlop={10}/> 
            </MenuTrigger>
            <MenuOptions>
                <MyMenuOption onSelect={() => {}} message="TODO" />
            </MenuOptions>
        </Menu>)
    

    _goToPlaylistScreen = () =>{
        this.props.navigation.navigate("CurrentPlaylist",  {})
    }

    render() {
        //TODO animation onButtonPress
        
        return (
        <LinearGradient style={styles.mainContainer} colors={['#373940', '#454853']} >
            <StatusBar backgroundColor={this.state.appBarColor} barStyle={"light-content"} translucent={true}/>
            <View style={styles.appBAr}>
                <RoundIconButton name="arrow-back" size={30} color="white" style={styles.backButton} hitSlop={10} onPress={this._back}/>
                {/* <RoundIconButton icon={<EntypoIcon name="dots-three-vertical" size={20} color="white"/>} style={styles.optionButton} hitSlop={10}/>    */}
                {this._Menu}
            </View>
            
            <View style={styles.albumCoverContainer}>
                <View style={styles.albumCover}/>
            </View>

            <View style={styles.textAndButtonsContainer}>
                <RoundIconButton 
                    style={styles.playlistButton}
                    icon={<MaterialCommunityIcons name="playlist-plus" size={25} color="white" />} 
                    hitSlop={10} 
                    style={styles.playlistButton}
                    onPress={() => alert("Not implemented")} />
                <View style={styles.textContainer}>
                    <TextTicker style={styles.title} {...TextTickerOptions}>{this.props.currentSong.title}</TextTicker>
                    <TextTicker style={styles.artist} {...TextTickerOptions}>{this.props.currentSong.artist}</TextTicker>
                </View>
                <RoundIconButton 
                    style={styles.playlistButton}
                    icon={<MaterialCommunityIcons name="playlist-music" size={25} color="white" />} 
                    hitSlop={10} 
                    style={styles.playlistButton}
                    onPress={this._goToPlaylistScreen} />
            </View>

            <View style={styles.sliderContainer}>
                <Text style={styles.timeText}>0:00</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={1}
                    minimumTrackTintColor="#FFFFFF"
                    maximumTrackTintColor="#000000"
                />
                <Text style={styles.timeText}>5:00</Text>
            </View>

            <View style={styles.mediabuttonsContainer}>
                <RoundIconButton 
                    icon={<MaterialCommunityIcons {...buttonsStyles[this.props.repeatMode]}/>} 
                    onPress={this._changeLoopMode} 
                    style={styles.optionButton} 
                    hitSlop={10}/>   
                <RoundIconButton 
                    icon={<FoundationIcon name="previous" size={35} color="white"/>} 
                    onPress={this._previous} 
                    style={styles.nextButton} 
                    hitSlop={10}/>   
                <RoundIconButton
                    icon={<FoundationIcon size={55} color="white" name={this.props.playState == "play" ? "pause" : "play"}/>} 
                    onPress={this._play} 
                    style={styles.nextButton} 
                    hitSlop={10}/>   
                <RoundIconButton 
                    icon={<FoundationIcon name="next" size={35} color="white"/>} 
                    onPress={this._next} 
                    style={styles.nextButton} 
                    hitSlop={10}/>  
                <RoundIconButton 
                    icon={<MaterialCommunityIcons {...this.props.shuffle ? buttonsStyles.shuffleOn : buttonsStyles.shuffleOff}/>} 
                    onPress={this._toggleShuffle} 
                    style={styles.optionButton} 
                    hitSlop={10}/>    
            </View>

            <View style={styles.bottomContainer}>
                <Text style={styles.numberOfSongsText}>3/1568</Text>
            </View>

        </LinearGradient>
        )
    }

    _back = () => {
        this.props.navigation.goBack()
    }

    _previous = () =>{
        this.props.dispatch({ type: MEDIA_ACTIONS.previousSong })
    }

    _play = () =>{
        this.props.dispatch({ type: MEDIA_ACTIONS.togglePlayState })
    }

    _next = () =>{
        this.props.dispatch({ type: MEDIA_ACTIONS.nextSong })
    }

    _toggleShuffle = () =>{
        let action = { type: "TOGGLE_SHUFFLE" }
        this.props.dispatch(action)

        //TODO send to MediaPlayer. Maybe in ruducer?
    }

    _changeLoopMode = () => {
        let action = { type: "CHANGE_REPEAT_MODE" }
        this.props.dispatch(action)

        //TODO send to MediaPlayer. Maybe in ruducer?
    }
}

const mapStateToProps = (state /*, ownProps*/) => {
    return {
      currentSong: state.MediaReducer.currentSong,
      playState: state.MediaReducer.playState,
      shuffle: state.MediaReducer.shuffle,
      repeatMode: state.MediaReducer.repeatMode
    }
  }
  
  
  export default connect(
    mapStateToProps,
    null
  )(CurrentSongScreen)
  
const styles = StyleSheet.create({
    mainContainer:{
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        // backgroundColor: "red"
    },
    appBAr:{
        height: 58,
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center"
    },
    backButton:{
        padding:10,
        // backgroundColor:"red"
    },
    optionButton:{
        padding:10,
        // backgroundColor:"red",
    },
    albumCoverContainer:{
        flex:5,
        justifyContent:"center",
        alignItems:"center",
    },
    albumCover:{
        backgroundColor:"gray",
        height:300,
        width:300,
        borderRadius:10,
        marginTop: -30
    },
    textAndButtonsContainer:{
        // height:60,
        flexDirection:"row",
        marginVertical:15,
        // backgroundColor:"red",
    },
    textContainer:{
        flex:2.7,
        alignItems:"center",
    },
    title:{
        fontWeight:"bold",
        fontSize:20,
        color:"white",
    },
    artist:{
        fontSize:16,
        color:"white",
    },
    playlistButton:{
        flex:1,
        // paddingHorizontal:30,
        justifyContent:"center",
        alignItems:"center",
        // backgroundColor:"blue",
    },
    sliderContainer:{
        height:80,
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center",
        // backgroundColor:"blue",
    },
    slider:{
        width: 300,
        height: 60,
    },
    timeText:{
        fontSize:12,
        color:"white",
    },
    mediabuttonsContainer:{
        // height:100,
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-around",
        marginBottom:20,
        marginTop:15
        // backgroundColor:"red",
    },
    nextButton:{
        // backgroundColor:"red",
        width: 50,
        alignItems:"center",
        justifyContent:"space-around",
    },
    bottomContainer:{
        height:30,
        justifyContent:"center",
        alignItems:"center",
    },
    numberOfSongsText:{
        fontSize:12,
        color:"white",
    },
});

const buttonsStyles = {
    noRepeat:{
        name : "repeat",
        color:"gray",
        size:23,
    },
    repeatAll:{
        name: "repeat",
        color:"white",
        size:23,
    },
    repeatOne:{
        name: "repeat-once",
        color:"white",
        size:23,
    },

    shuffleOn:{
        name: "shuffle",
        color:"white",
        size:23,
    },
    shuffleOff:{
        name: "shuffle",
        color:"gray",
        size:23,
    },

};

