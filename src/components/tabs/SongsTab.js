import React from 'react';
import { BaseScrollView, DataProvider, LayoutProvider, RecyclerListView } from "recyclerlistview";
import {Dimensions, FlatList, StyleSheet, Text, View} from 'react-native';
import { connect } from 'react-redux'

import MainAppbar from '../MainAppbar';
import RecycleTestComponent from '../TestComponent';
import SongItem from '../lists/SongItem'

const dataProvider = new DataProvider((r1, r2) => {
            // return (r1.artist !== r2.artist) && (r1.title !== r2.title);
            return r1 !== r2;
});


class SongsTab extends React.Component {

    constructor(props) {
        super(props)
        let { width } = Dimensions.get("window");

        //Create the data provider and provide method which takes in two rows of data and return if those two are different or not.
        //THIS IS VERY IMPORTANT, FORGET PERFORMANCE IF THIS IS MESSED UP

        this._layoutProvider = new LayoutProvider(
            index => {
                return 0
            },
            (type, dim) => {
                dim.width = width;
                dim.height = 70;
            }
        );

        this._rowRenderer = this._rowRenderer.bind(this);

        //Since component should always render once data has changed, make data provider part of the state
        this.state = {
            data: this._generateArray(10)
        };

        // this.state = {
        //     songs : [],
        // };
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

    _generateArray(n) {
        let arr = new Array(n);
        for (let i = 0; i < n; i++) {
            arr[i] = {title : "me" ,artist : "elle"};
        }
        return arr;
    }

    //Given type and data return the view component
    _rowRenderer(type, data) {
        //You can return any view here, CellContainer has no special significance
            return(<SongItem artist={data.artist} title={data.title}/>)

    }

    _dataProvider = (data) => {
        return dataProvider.cloneWithRows(data)        
    }


    render() {
        console.log("Render")
        // console.log(this.props)
        let data = this.props.songs != undefined ? this.props.songs : [{title : "no", artist : "One"}]
        console.log(data[0])
        return <RecyclerListView 
                layoutProvider={this._layoutProvider} 
                dataProvider={this._dataProvider(data)} 
                rowRenderer={this._rowRenderer} 
                renderAheadOffset={1000}/>;
    }
}

const styles = StyleSheet.create({
    separator:{
        height: StyleSheet.hairlineWidth,
        width: "100%",
        backgroundColor: "darkgray",
    },

        container: {
        justifyContent: "space-around",
        alignItems: "center",
        flex: 1,
        backgroundColor: "#00a1f1"
    },
    containerGridLeft: {
        justifyContent: "space-around",
        alignItems: "center",
        flex: 1,
        backgroundColor: "#ffbb00"
    },
    containerGridRight: {
        justifyContent: "space-around",
        alignItems: "center",
        flex: 1,
        backgroundColor: "#7cbb00"
    }
});

const mapStateToProps = (state /*, ownProps*/) => {
    console.log("MapPorpsToState")
  return {
    songs: state.songs,
  }
}

export default connect(
  mapStateToProps,
  null
)(SongsTab)

