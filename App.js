import Icon from 'react-native-vector-icons/Foundation';
import React from 'react';
import {Button, PanResponder, PermissionsAndroid, Pressable, StyleSheet, Text, View} from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux'
import { createDrawerNavigator } from '@react-navigation/drawer';

import HomeScreen from './src/components/HomeScreen'
import MediaModule from './src/packages/Modules';
import Store from './src/store/Config';
import ToastExample from './src/packages/Modules';

const Drawer = createDrawerNavigator();

function onTouch1(){
  console.log("OnTouch1")
}

function onTouch2(){
  console.log("OnTouch2")
}

function SettingScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={requestPermission} title="Go back home" />
      <Pressable style={{ height:100, backgroundColor:"orange", justifyContent:"center"}}  onPress={onTouch1}>
        <Pressable style={{ height:50, backgroundColor:"red"}}  onPress={onTouch2}>
              <Icon name="previous" size={40} color="black" style={{marginRight : 6}} />
        </Pressable>
      </Pressable>
    </View>
  );
}

export default class App extends React.Component {

  _onPress(){
    console.log("On press?")
    ToastExample.show('Awesome', ToastExample.SHORT)
  }

  componentDidMount(){
    requestPermission()
  }

  render() {
    // return(
    //     <View style={{backgroundColor:"black", height:100}}></View>
    // )

    return (
      <ReduxProvider store={Store}>
        <PaperProvider>
          <MenuProvider backHandler={true}>
            <NavigationContainer>
              <Drawer.Navigator initialRouteName="Home" edgeWidth={50}>
                <Drawer.Screen name="Home" component={HomeScreen} />
                <Drawer.Screen name="Notifications" component={SettingScreen} />
              </Drawer.Navigator>
            </NavigationContainer>
          </MenuProvider>
        </PaperProvider>
      </ReduxProvider>    
    );
  }
}



const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
  toolbar: {
   },
   test:{
     backgroundColor:"black",
     flex:1
   }
})


const requestPermission = async () => {
  // const media = await MediaModule.getMedia();

  // var t0 = performance.now()
  // var artists = new Set()
  // var albums = new Set()
  // var folders = new Set()

  // media.map((song) => {
  //   artists.add(song.artist)
  //   albums.add(song.albums)
  //   folders.add(song.folder)
  // });


  // var t1 = performance.now()
  // console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")
  // console.log("Number of artists : " + artists.size)

  // console.log(artists)

  //TODO : refresh songs on permission grant
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: "MusicPlayer Storage Permission",
        message:
          "MusicPlayers needs to access your files to work",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      // console.log("You can use the camera");
    } else {
      // console.log("Camera permission denied");
    }
    const hasPerm = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
    console.log(hasPerm)
      if (hasPerm === true) {
      // console.log("You can use the camera");
    } else {
      // console.log("Camera permission denied");
    }

  } catch (err) {
    console.warn(err);
  }
};