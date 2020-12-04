import React from 'react';
import {Dimensions, FlatList, StyleSheet, Text, View} from 'react-native';
import { SceneMap, TabView } from 'react-native-tab-view';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { connect } from 'react-redux'
import { cos } from 'react-native-reanimated';
import { createStackNavigator } from '@react-navigation/stack';

import MainAppbar from '../MainAppbar';
import SongItem from '../lists/SongItem'

class SongsTab extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            songs : [],
        };
    }
    
    _Separator(){
        return(<View style={styles.separator}/>)
    }

    _SongItem(item){
        return(
            <SongItem artist={item.item.artist} title={item.item.title}/>
        )
    }

    _getItemLayout(data, index){
        return{length : 70, offset: 70 * index, index}
    }

    render() {
        return (
            <View style={{ flex: 1}}>
            <FlatList
                data={this.props.songs}
                keyExtractor={(item) => item.title.toString() + item.artist.toString()}
                renderItem={(item) => this._SongItem(item)}
                ItemSeparatorComponent={this._Separator}
                // getItemLayout={this._getItemLayout}
            />     
            </View>
        );
    }
}

const styles = StyleSheet.create({
    separator:{
        height: StyleSheet.hairlineWidth,
        width: "100%",
        backgroundColor: "darkgray",
    },
});

const mapStateToProps = (state /*, ownProps*/) => {
  return {
    songs: state.songs
  }
}

export default connect(
  mapStateToProps,
  null
)(SongsTab)

