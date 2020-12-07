import Icon from 'react-native-vector-icons/Entypo';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import {Menu, MenuOption, MenuOptions, MenuTrigger} from 'react-native-popup-menu';

class MyMenuOption extends React.Component {

    constructor(props) {
        super(props)
    }


    render(){
        return(
            <MenuOption style={styles.view} {...this.props}>
                <Text style={styles.text}>{this.props.message}</Text>
            </MenuOption>
        )
    }
    
}

const styles = StyleSheet.create({
    view: {
        height: 50,
        // alignItems: "center",
        justifyContent: "center"
    },
    text: {
        fontSize: 20,
        marginLeft: 10,
    },

});


export default MyMenuOption;