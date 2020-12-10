import EntypoIcon from 'react-native-vector-icons/Entypo';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import React from 'react';
import { Appbar } from 'react-native-paper';
import { BackHandler, Pressable, StyleSheet, Text, TextInput, TouchableNativeFeedback, TouchableWithoutFeedback, View } from 'react-native';
import {Menu, MenuOption, MenuOptions, MenuTrigger} from 'react-native-popup-menu';
import { Searchbar } from 'react-native-paper';

class RoundIconButton extends React.Component {
    render() {
      return(
        <View style={styles.iconContainer}>
            <TouchableNativeFeedback onPress={this.props.onPress} background={TouchableNativeFeedback.Ripple('darkgray', true)}>
                <View style={styles.iconContainer}>
                    <MaterialIcon name={this.props.name} size={this.props.size} color={this.props.color}  />
                </View>
            </TouchableNativeFeedback>
        </View>
      )
  }
}

const styles = StyleSheet.create({
    mainContainer:{
    //   backgroundColor: "blue",
    //   flexDirection: "row",
    //   alignItems:"center",
    //   height:BAR_HEIGHT, 
    },
    iconContainer:{
    //   height:BAR_HEIGHT, 
    //   width:BAR_HEIGHT,
    //   alignItems:"center", 
    //   justifyContent:"center",
    //   borderRadius: 35,
    //   backgroundColor:"white"
    },
});


export default RoundIconButton