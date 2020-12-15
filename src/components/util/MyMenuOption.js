import React from 'react';
import {MenuOption} from 'react-native-popup-menu';
import { StyleSheet, Text } from 'react-native';

// Custom view displayed in DragDown menus
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
        justifyContent: "center"
    },
    text: {
        fontSize: 20,
        marginLeft: 10,
    },

});


export default MyMenuOption;