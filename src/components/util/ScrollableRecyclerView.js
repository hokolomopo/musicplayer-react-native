import React from 'react';
import {Animated, Dimensions, PanResponder, StyleSheet, View} from 'react-native';
import { LayoutProvider, RecyclerListView } from "recyclerlistview";

// Extend the RecyclerListView class to add a scrollbar on the side.
// I'm kinda happy with this class, but there is no reason for React Native to not have either scrollbars or RecyclerViews
class ScrollableRecyclerView extends React.Component {

    constructor(props) {
        super(props)
        let { width } = Dimensions.get("window");

        this._layoutProvider = new LayoutProvider(
            () => {
                return 0
            },
            (type, dim) => {
                dim.width = width;
                dim.height = props.itemHeight;
            }
        );

    }
    
    heightScrollCursor = 0
    cursorMaxY = 0
    pan = new Animated.Value(0);

    scrollingWithCursor = false //To disable onScroll() of the list while we are scrolling with the cursor

    panResponder = PanResponder.create({
        // Ask to be the responder:
        onStartShouldSetPanResponder: () => true,
        onStartShouldSetPanResponderCapture: () =>
            true,
        onMoveShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponderCapture: () =>
            true,
        onPanResponderTerminationRequest: () =>
            true,
        onShouldBlockNativeResponder: () => {
            return true;
        },
        onPanResponderGrant: () => {            
            // console.log("onPanResponderGrant")
            this.scrollingWithCursor = true
            this.pan.setOffset(this.pan._value)
        },
        onPanResponderMove: (evt, gestureState) => {
            let cursorMaxY = this.heightScrollBar - this.heightScrollCursor

            // console.log(evt.nativeEvent)

            // Limit the value to not get the scroll cursor out of the screen
            let panValue = gestureState.dy
            panValue = Math.min(Math.max(panValue, 0 - this.pan._offset), cursorMaxY - this.pan._offset);            
            this.pan.setValue(panValue)

            // Translate scroll cursor position to list index

            // We've got to take into account that the list index is the index of the FIRST item of the list displayed
            let itemsPerPage = Math.floor(this.heightScrollBar / this.props.itemHeight)
            let dataLenght = Math.max(this.props.data.length - itemsPerPage + 1, 1)

            let currentPos = (panValue + this.pan._offset) / (cursorMaxY)
            let index = Math.floor(dataLenght * currentPos)
            index = Math.min(Math.max(index, 0), dataLenght - 1);
            
            this.flatListRef.scrollToIndex(index)     
        },
        onPanResponderRelease: () => {
            this.pan.flattenOffset();
            this.scrollingWithCursor = false
        }

        })

    _onLayout = (event) => {
        this.heightScrollBar = event.nativeEvent.layout.height
    }

    _onScroll = (event) =>{
        // Don't do anything if the user is scrolling with the cursor
        if(this.scrollingWithCursor)
            return
        
        //Move the scroll cursor

        let offsetY = event.nativeEvent.contentOffset.y
        let contentSize = event.nativeEvent.contentSize.height
        let layoutHeight = event.nativeEvent.layoutMeasurement.height
        let cursorMaxY = this.heightScrollBar - this.heightScrollCursor
        
        // Maths : 
        // List position = offsetY, goes from 0 to (contentSize - layoutHeight)
        // Cursor position = panValue, goes from 0 to cursorMaxY
        let panValue = offsetY /(contentSize - layoutHeight) * cursorMaxY 
        panValue = Math.min(Math.max(panValue, 0 - this.pan._offset), cursorMaxY);

        this.pan.setValue(panValue)
    }

    _getScrollCursorHeight = () =>{
        let dataSize = this.props.data.length
        dataSize = Math.min(Math.max(dataSize, 10), 100);
        let cursorSize = dataSize * (-3.8) + 438
        return cursorSize
    }

    render() {
        this.heightScrollCursor = this._getScrollCursorHeight()


        return (
            <View style={styles.vertiContainer}>
                <RecyclerListView 
                    style={styles.container}
                    ref={(ref) => { this.flatListRef = ref; }}
                    layoutProvider={this._layoutProvider} 
                    dataProvider={this.props.getDataProvider.cloneWithRows(this.props.data)} 
                    rowRenderer={this.props.rowRenderer} 
                    renderAheadOffset={1000}
                    showsVerticalScrollIndicator={false}
                    onScroll={this._onScroll}/>
               {this.props.data.length >= 10 ? 
                    <View 
                        style={styles.scrollBarBackground} 
                        opacity={0.7}
                        ref={(ref) => { this.scrollbarRef = ref; }}
                        onLayout={this._onLayout}>
                            <Animated.View 
                                style={[styles.scrollBarCursor, {transform:[{translateY : this.pan}], height:this.heightScrollCursor}]} 
                                hitSlop={{top: 50, bottom: 50, left: 50, right: 50}}
                                {...this.panResponder.panHandlers}/>
                    </View> : null}
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
    container: {
        flex: 1,
    },
    scrollBarBackground: {
        flex: 0.03,
        backgroundColor: "lightgray",
    },
    vertiContainer:{
        flexDirection: "row",
        flex: 1
    },
    scrollBarCursor:{
        backgroundColor: "orange",
    },
});


export default ScrollableRecyclerView

