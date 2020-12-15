import React from 'react';
import {FlatList, PanResponder, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import { connect } from 'react-redux'

// Screen displaying the songs that are currenstly queued to be played
// Not finished because I wanted to do a list supporting drag & drop , but the only one available on ReactNative are FlatList, and Flatlists
class CurrentPlaylistScreen extends React.Component {

      renderItem = ({ item, index, drag, isActive }) => {
        return (
            <TouchableOpacity onPress={drag} onLongPress={drag}>
                <View style={styles.listItemView}>
                    <View style={styles.cover}></View>
                    <View style={styles.textContainer}>
                        <View style={styles.artistTextContainer}>
                            <Text numberOfLines={1} style={styles.artistText}>{item.artist}</Text>
                        </View>
                        <View  style={styles.titleTextContainer}>
                            <Text numberOfLines={1} style={styles.titleText}>{item.title}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
            );
      };
    
      render() {
        return (
          <View style={styles.container}>
            <FlatList
              data={this.props.playlist}
              renderItem={this.renderItem}
              keyExtractor={(item, index) => `draggable-item-${item.title + item.artist + item.folder}`}
              initialNumToRender={100}
              onEndReachedThreshold={40}
              maxToRenderPerBatch={10}
              getItemLayout = {(data, index) => ({
                length: 70,
                offset: 70 * index,
                index
              })}
            />
          </View>
        );
      }
    }

const mapStateToProps = (state) => {
  return {
    playlist: state.MediaReducer.playingList,
  }
}

export default connect(mapStateToProps, null)(CurrentPlaylistScreen)

const styles = StyleSheet.create({
    container:{
        flex: 1,
        // backgroundColor:"red",
        paddingTop: StatusBar.currentHeight,
    },
    listItemView: {
        height: 70,
        flexDirection: "row",
        alignItems: "center",
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
});



