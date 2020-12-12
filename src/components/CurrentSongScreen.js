import EntypoIcon from 'react-native-vector-icons/Entypo';
import FoundationIcon from 'react-native-vector-icons/Foundation';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React from 'react';
import Slider from '@react-native-community/slider';
import TextTicker from 'react-native-text-ticker'
import { Easing, StatusBar, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux'

import MediaModule from '../packages/Modules';
import RoundIconButton from './util/RoundIconButton';
import {TextTickerOptions} from '../util/Constants'

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
    
    _previous = () =>{
        MediaModule.previous()
    }

    _play = () =>{
        MediaModule.playPause()
    }

    _next = () =>{
        MediaModule.next()
    }


    render() {
        //TODO animation onButtonPress
      return (
        <LinearGradient style={styles.mainContainer} colors={['#373940', '#454853']} >
            <StatusBar backgroundColor={this.state.appBarColor} barStyle={"light-content"} translucent={true}/>
            <View style={styles.appBAr}>
                <RoundIconButton name="arrow-back" size={30} color="white" style={styles.backButton} hitSlop={10}/>
                <RoundIconButton icon={<EntypoIcon name="dots-three-vertical" size={20} color="white"/>} style={styles.optionButton} hitSlop={10}/>   
            </View>
            <View style={styles.albumCoverContainer}>
                <View style={styles.albumCover}/>
            </View>
            <View style={styles.textAndButtonsContainer}>
                <RoundIconButton style={styles.playlistButton} icon={<MaterialCommunityIcons name="playlist-plus" size={25} color="white" />} hitSlop={10} style={styles.playlistButton}/>
                <View style={styles.textContainer}>
                    <TextTicker style={styles.title} {...TextTickerOptions}>They'll Never Take The Goood years I guess</TextTicker>
                    <TextTicker style={styles.artist} {...TextTickerOptions}>William Fitzsimmons</TextTicker>
                </View>
                <RoundIconButton icon={<MaterialCommunityIcons name="playlist-music" size={25} color="white"/>}  hitSlop={10} style={styles.playlistButton}/>
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
                <RoundIconButton icon={<MaterialCommunityIcons name="repeat" size={23} color="white"/>} style={styles.optionButton} hitSlop={10}/>   
                <RoundIconButton icon={<FoundationIcon name="previous" size={35} color="white"/>} style={styles.nextButton} hitSlop={10}/>   
                <RoundIconButton icon={<FoundationIcon name="play" size={55} color="white"/>} style={styles.nextButton} hitSlop={10}/>   
                <RoundIconButton icon={<FoundationIcon name="next" size={35} color="white"/>} style={styles.nextButton} hitSlop={10}/>  
                <RoundIconButton icon={<MaterialCommunityIcons name="shuffle" size={23} color="white"/>} style={styles.optionButton} hitSlop={10}/>    
            </View>
            <View style={styles.bottomContainer}>
                <Text style={styles.numberOfSongsText}>3/1568</Text>
            </View>

        </LinearGradient>
    )
    }
}

const styles = StyleSheet.create({
    mainContainer:{
        flex: 1,
        paddingTop: StatusBar.currentHeight,
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
        paddingHorizontal:10,
        borderRadius: 24,
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
        // padding:10,
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
