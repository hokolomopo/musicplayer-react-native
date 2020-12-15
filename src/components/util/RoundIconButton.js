import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, TouchableNativeFeedback, View } from 'react-native';

// Wrapper for a Button containing an Icon
class RoundIconButton extends React.Component {
    render() {
      return(
        <View style={this.props.style}>
            <TouchableNativeFeedback 
                onPress={this.props.onPress} 
                background={TouchableNativeFeedback.Ripple(this.props.rippleColor, true)}
                hitSlop={{top: this.props.hitSlop, bottom: this.props.hitSlop, left: this.props.hitSlop, right: this.props.hitSlop}}
                useForeground={true}>
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
    },
    iconContainer:{
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