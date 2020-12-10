import Icon from 'react-native-vector-icons/Entypo';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableNativeFeedback, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import {Menu, MenuOption, MenuOptions, MenuTrigger} from 'react-native-popup-menu';

import MediaModule from '../../packages/Modules';
import MyMenuOption from '../util/MyMenuOption';

class SongItem extends React.Component {

    constructor(props) {
        super(props)
    
        this.state = {
             songs : props.data
        }
    }

    _SongMenu = () => {
        return(
                <Menu>
                    <MenuTrigger customStyles={{TriggerTouchableComponent: TouchableWithoutFeedback}}>
                        <Icon name="dots-three-vertical" size={20} color="darkgray" style={styles.pointsIcon}/>
                    </MenuTrigger>
                    <MenuOptions>
                        <MyMenuOption onSelect={() => alert(`Save`)} message='Save' />
                        <MyMenuOption onSelect={() => alert(`Delete`)} message='Help' />
                        <MyMenuOption onSelect={() => alert(`Not called`)} disabled={true} message='Disabled' />
                    </MenuOptions>
                </Menu>
        )
    }

    _onSongClick = () =>{
        console.log("OnSongclick")
        var playlist = this.props.getPlaylist();
        MediaModule.init(playlist, playlist.findIndex(item => (item.artist === this.props.artist && item.title === this.props.title)))

    }

    render(){
        //TODO implement animation that activate only on onTouchUp to avoir animation while scrolling
        return(
            <TouchableWithoutFeedback onPress={this._onSongClick}>
                <View style={styles.listItemView}>
                    <View style={styles.cover}></View>
                    <View style={styles.textContainer}>
                        <View style={styles.artistTextContainer}>
                            <Text numberOfLines={1} style={styles.artistText}>{this.props.artist}</Text>
                        </View>
                        <View  style={styles.titleTextContainer}>
                            <Text numberOfLines={1} style={styles.titleText}>{this.props.title}</Text>
                        </View>
                    </View>
                    {this._SongMenu()}
                </View>
            </TouchableWithoutFeedback>)
    }
    
}

const styles = StyleSheet.create({
    listItemView: {
        height: 70,
        flexDirection: "row",
        alignItems: "center"
    },
    cover: {
        height: 60,
        width: 60,
        backgroundColor: "gray",
        margin: 10
    },
    textContainer: {
        flex : 1,
    },
    artistTextContainer:{
        flex : 1,
        justifyContent : "flex-end"
    },
    titleTextContainer:{
        flex : 1,
        justifyContent : "flex-start"
    },
    titleText: {
    },
    artistText: {
        fontSize: 17
    },
    pointsIcon: {
        marginHorizontal: 10
    },

});

export default SongItem;