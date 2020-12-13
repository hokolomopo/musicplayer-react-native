import React from 'react';
import {Animated, Dimensions, FlatList, PanResponder, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import { BaseScrollView, DataProvider, LayoutProvider, RecyclerListView } from "recyclerlistview";
import { connect } from 'react-redux'

import ScrollableRecyclerView from '../util/ScrollableRecyclerView';
import SongItem from '../lists/SongItem'
import { MEDIA_ACTIONS } from '../../store/MediaReducer';

const dataProvider = new DataProvider((r1, r2) => {
            return (r1.artist !== r2.artist) && (r1.title !== r2.title);
            // return r1 !== r2;
});



class SongsList extends React.Component  {
    
    constructor(props) {
        super(props)
        let { width } = Dimensions.get("window");

        this._layoutProvider = new LayoutProvider(
            index => {
                return 0
            },
            (type, dim) => {
                dim.width = width * 0.97;
                dim.height = 70;
            }
        );

    }
    
    _getSortedSongs = () => {
        let sortedArray = [...this.props.songs]
        switch(this.props.sortBy){
            case "artist":
                sortedArray.sort((a, b) => a.artist.localeCompare(b.artist))
                break;
            case "title":
                sortedArray.sort((a, b) => a.title.localeCompare(b.title))
                break;

        }
        return sortedArray
    }    
    
    _Separator(){
        return(<View style={styles.separator}/>)
    }

    _onSongClick = (song) =>{
        this.props.dispatch({ type: MEDIA_ACTIONS.updatePlayingList, value: {list : this.props.songs, currentSong : song} })
    }

    _rowRenderer = (type, data) =>{
            return(
                <View>
                    <SongItem song={data} onSongClick={this._onSongClick}/>
                    <View style={styles.separator}/>
                </View>
            )
    }

    _DataProvider(){
        return new DataProvider((r1, r2) => {
            return (r1.artist !== r2.artist) || (r1.title !== r2.title); 
        })       
    }


    render() {
        // console.log("Render SongList")
        //TODO : end of preoject, verify that we only call render when the songs/the sort order change. If not, we call a sort function every time.

        let toRender = this.props.songs.length == 0 ? null :
            <ScrollableRecyclerView 
            getDataProvider={this._DataProvider()}
            rowRenderer={this._rowRenderer}
            itemHeight={70}
            data={this._getSortedSongs()}/>
        
        return toRender
    }
}

SongsList.defaultProps = {
    sortBy:"artist"
}

const styles = StyleSheet.create({
    separator:{
        height: StyleSheet.hairlineWidth,
        width: "100%",
        backgroundColor: "darkgray",
    },
    container: {
        flex: 1,
    },
    scrollBarBackground: {
        flex: 0.03,
        backgroundColor: "black"
    },
    vertiContainer:{
        flexDirection: "row",
        flex: 1
    },
    scrollBarCursor:{
        height : 100,
        backgroundColor: "orange"
    },
});
  
  export default connect(
    null,
    null
  )(SongsList)
  
