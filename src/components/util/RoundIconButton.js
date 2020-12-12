import EntypoIcon from 'react-native-vector-icons/Entypo';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';
import React from 'react';
import { Appbar } from 'react-native-paper';
import { BackHandler, Pressable, StyleSheet, Text, TextInput, TouchableNativeFeedback, TouchableOpacity, View } from 'react-native';
import {Menu, MenuOption, MenuOptions, MenuTrigger} from 'react-native-popup-menu';
import { Searchbar } from 'react-native-paper';

class RoundIconButton extends React.Component {
    render() {
      return(
        <View style={this.props.style}>
            <TouchableNativeFeedback onPress={this.props.onPress} background={TouchableNativeFeedback.Ripple(this.props.rippleColor, true)}
                hitSlop={{top: this.props.hitSlop, bottom: this.props.hitSlop, left: this.props.hitSlop, right: this.props.hitSlop}}>
                <View style={styles.iconContainer}>
                    {this.props.icon != null ?
                        this.props.icon :
                        <MaterialIcon name={this.props.name} size={this.props.size} color={this.props.color}  />
                    }
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
    //   backgroundColor:"red"
    },
});

RoundIconButton.propTypes = {
    rippleColor : PropTypes.string,
    hitSlop: PropTypes.number
};

RoundIconButton.defaultProps = {
    rippleColor: "darkgray",
    icon: null,
    hitSlop: 0
};

export default RoundIconButton