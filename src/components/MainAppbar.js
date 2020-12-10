import AwesomeAlert from 'react-native-awesome-alerts';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import React from 'react';
import { BackHandler, Pressable, StyleSheet, Text, TextInput, TouchableNativeFeedback, TouchableWithoutFeedback, View } from 'react-native';
import {Menu, MenuOption, MenuOptions, MenuTrigger, renderers} from 'react-native-popup-menu';
import { connect } from 'react-redux'

import MyMenuOption from './util/MyMenuOption';
import RadioButtonRN from './util/RadioButtonRN';
import RoundIconButton from './util/RoundIconButton';
import SortByAlert from './util/SortByAlert';
import {SORT_SONGS_BY_VALUES} from '../store/UIReducer';
import { SongTabActions } from './tabs/ActionsByTabs';

const BAR_HEIGHT = 58

class MainAppbar extends React.Component {

  
  constructor(props) {
    super(props)
  
    this.sortSongsByValues = []
    SORT_SONGS_BY_VALUES.forEach(item => this.sortSongsByValues.push({label:item}))

    this.state = {
        isSearching : false,
        searchString : "",
        showSortByAlert: false
    }
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this._backAction
    );
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  _backAction = () => {
    if(this.state.isSearching){
      this._stopSearch()
      return true
    }
    return false
  };

  _backNavButtonPress = () => {
    if(this.state.isSearching){
      this._stopSearch()
    }
    else{
      this.props.navigation.openDrawer()
    }

  }

  _stopSearch = () => {
    this.setState({
      isSearching : false,
      searchString: ""
    })
  }
  
  _startSearch = () => {
    this.setState({
      isSearching : true,
      searchString: ""
    })
  }

    SearchingBar = () => {
      return(
        <View style={styles.container}>
            {this.state.searchString != "" ? null :
              <View style={styles.searchIconContainer}>
                  <MaterialIcon name="search" size={28} color="rgba(0, 0, 0, 0.4)"/>
              </View>}
            <TextInput
                ref={(ref) => { this.textInputRef = ref; }}
                onLayout={() => {this.textInputRef.focus()}}
                style={styles.input}
                onChangeText={(searchString) => {this.setState({searchString : searchString})}}
                underlineColorAndroid="transparent"
            />

        </View>
      )
    }

    _getMenuOptions = () =>{
      let menuOptions = []

      switch(this.props.currentTab){
        case "titles":
          menuOptions.push(<SongTabActions key="3" closeParentMenu={this._closeMenu}/>)
          break;
      }

      menuOptions.push(<MyMenuOption onSelect={() => alert(`Delete`)} message='Help' key="2" />)

      return menuOptions
    }

    _closeMenu = () =>{
      this.menuRef.close()
    }

    StandardBar = () => {

      return(
        <View style={styles.container}>
            <Text style={styles.titleStyle}>{this.props.title}</Text>
            <Pressable style={styles.iconContainer} onPress={this._startSearch}>
              <MaterialIcon name="search" size={31} color={styles.iconStyle.color}/>
            </Pressable>
            <Menu 
                ref={(ref) => { this.menuRef = ref; }}>
                <MenuTrigger
                  customStyles={{TriggerTouchableComponent: TouchableNativeFeedback,
                                triggerTouchable:{background:TouchableNativeFeedback.Ripple('darkgray', true)}}}>
                  <View style={styles.dotIconContainer}>
                    <EntypoIcon name="dots-three-vertical" size={20} color={styles.iconStyle.color}/>
                  </View>
                </MenuTrigger>
                <MenuOptions>
                  {this._getMenuOptions()}
                </MenuOptions>
              </Menu>
        </View>
      )
    }

    render() {
      let bar = null
      if(this.state.isSearching == false){
        bar = this.StandardBar()
      }
      else{
        bar =  this.SearchingBar()
      }
      return(
        <View style={styles.mainContainer}>
          <View style={styles.iconContainer}>
            <RoundIconButton name={this.state.isSearching ? "arrow-back" : "menu"} size={30} color={styles.iconStyle.color} onPress={this._backNavButtonPress}/>
          </View>
          {bar}
        </View>
      )
    }
  }

const styles = StyleSheet.create({
    mainContainer:{
      backgroundColor: "blue",
      flexDirection: "row",
      alignItems:"center",
      height:BAR_HEIGHT, 
    },
    container:{
        flexDirection: "row",
        alignItems:"center",
        height:BAR_HEIGHT, 
        flex:1,
    },
    iconContainer:{
      height:BAR_HEIGHT, 
      width:BAR_HEIGHT,
      alignItems:"center", 
      justifyContent:"center",
      // borderRadius: 35,
      // backgroundColor:"white"
    },
    dotIconContainer:{
      // height:BAR_HEIGHT, 
      alignItems:"center", 
      justifyContent:"center",
      paddingHorizontal: 10,
    },
    iconStyle:{
        color: "black"
    },
    texContainer:{
      height:BAR_HEIGHT, 
      // justifyContent:"center"
    },
    titleStyle:{
      flex:1,
      fontSize: 22,
      color:"black",
      fontWeight:"bold",
      textAlignVertical: 'center',
      // backgroundColor:"white",,
      marginLeft:15
      },
    searchSection: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    searchIconContainer: {
      position:"absolute",
      left: 5,
      height:BAR_HEIGHT, 
      alignItems:"center", 
      justifyContent:"center"       
    },
    input: {
      // left: 60,
      fontSize: 20,
      flex : 1,
      // backgroundColor: "white"
    },
});

const mapStateToProps = (state) => {
  return {
    // sortBy: state.UIReducer.sortSongsBy
  }
}


export default connect(mapStateToProps, null)(MainAppbar)