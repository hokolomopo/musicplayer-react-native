import React from 'react';
import { MenuProvider } from 'react-native-popup-menu';
import { NavigationContainer } from '@react-navigation/native';
import {PermissionsAndroid, StatusBar, StyleSheet, Text, View} from 'react-native';
import { Provider as ReduxProvider } from 'react-redux'
import { createDrawerNavigator } from '@react-navigation/drawer';

import HomeScreen from './src/components/HomeScreen'
import Store from './src/store/Config';

//TODO : init MediaPlayer somewhere

const Drawer = createDrawerNavigator();


function SettingScreen({ }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>This is a screen</Text>
    </View>
  );
}

export default class App extends React.Component {


  componentDidMount(){
    requestPermission()
  }

  render() {
    return (
      <View style={styles.main_container}>
        <StatusBar backgroundColor="rgba(0,0,0,0)" barStyle={"light-content"} translucent={true}/>
        <ReduxProvider store={Store}>
          <MenuProvider backHandler={true}>
            <NavigationContainer>
              <Drawer.Navigator initialRouteName="Home" edgeWidth={50}>
                <Drawer.Screen name="Home" component={HomeScreen} />
                <Drawer.Screen name="Notifications" component={SettingScreen} />
              </Drawer.Navigator>
            </NavigationContainer>
          </MenuProvider>
        </ReduxProvider>   
      </View> 
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
     flex:1
   }
})


const requestPermission = async () => {

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
      if (hasPerm === true) {
      // console.log("You can use the camera");
    } else {
      // console.log("Camera permission denied");
    }

  } catch (err) {
    console.warn(err);
  }
};