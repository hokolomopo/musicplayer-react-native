import Icon from 'react-native-vector-icons/Entypo';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

class SongItem extends React.Component {

    constructor(props) {
        super(props)
    
        this.state = {
             songs : props.data
        }
    }

    render(){
        return(
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
                <Icon name="dots-three-vertical" size={20} color="darkgray" style={styles.pointsIcon}/>
            </View>)
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