import React from 'react';
import ViewPager from '@react-native-community/viewpager';
import {Dimensions, FlatList, StyleSheet, Text, View} from 'react-native';
import { SceneMap, TabView } from 'react-native-tab-view';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';

import MainAppbar from './MainAppbar';
import TabComponent from './TabComponent';

const data = ["a", "z","e","r","t","y","u","i","o","p","q","s","d","f","g","h","j","k","l","m","ù","w","x"]


const FirstRoute = () => (
  <View style={{ backgroundColor: '#ff4081', flex: 1}}>
      <FlatList
            data={data}
            keyExtractor={(item) => item.toString()}
            renderItem={({item}) => <Text style={styles.bigText}>{item}</Text>}
        />
    </View>
);

const SecondRoute = () => (
  <View style={{ backgroundColor: '#673ab7', flex: 1}} />
);

const Stack = createStackNavigator();

const initialLayout = { width: Dimensions.get('window').width };

class HomeScreen extends React.Component {

    constructor(props) {
        super(props)
    
        this.renderScene = SceneMap({
                first: FirstRoute,
                second: SecondRoute,
            });

        this.state = {
             index: 0,
             routes: [
            { key: 'first', title: 'First' },
            { key: 'second', title: 'Second' },]
        };
    }
    
    _onTouch = () => {
        this.props.navigation.navigate("CurrentSong",  {})
    }

    _Home = () => {
        return(
            <View style={styles.container}>
                <TabComponent/>
                <TouchableOpacity onPressOut = { this._onTouch } style={styles.currentSong}>
                    <Text>CurrentSong</Text>
                </TouchableOpacity>
            </View>
        )
    }

    _CurrentSong(){
        return(
            <Text>CurrentSong</Text>
        )
    }

  render() {
    return (
      <Stack.Navigator initialRouteName="Home" edgeWidth={50} style={styles.stackNavigator} screenOptions={{headerShown: false}}>
            <Stack.Screen name="Home" component={this._Home}/>
            <Stack.Screen name="CurrentSong" component={this._CurrentSong}/> 
      </Stack.Navigator>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 0,
        flex: 1
    },
    scene: {
        flex: 1,
    },
    currentSong: {
        height: 80,
        backgroundColor : "orange"
    },
    bigText: {
        fontSize: 60,
    },
    viewPager: {
        flex: 1,
    },
    stackNavigator: {

    },

});

export default HomeScreen;
