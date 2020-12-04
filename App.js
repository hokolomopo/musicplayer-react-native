import React from 'react';
import {Button, NativeEventEmitter, NativeModules, StyleSheet, Text, View} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { createDrawerNavigator } from '@react-navigation/drawer';

import HomeScreen from './src/components/HomeScreen'
import ToastExample from './src/packages/Modules';

const Drawer = createDrawerNavigator();

function _HomeScreen({ navigation }) {
  return (<HomeScreen what={1}/>);
}

function SettingScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.goBack()} title="Go back home" />
    </View>
  );
}

export default class App extends React.Component {

  componentDidMount() {
    const eventEmitter = new NativeEventEmitter(NativeModules.ToastExample);
    this.eventListener = eventEmitter.addListener('Event', (event) => {
       console.log(event)
    });
  }

  componentWillUnmount() {
    this.eventListener.remove();
  }

  _onPress(){
    console.log("On press?")
    ToastExample.show('Awesome', ToastExample.SHORT)
  }

  render() {
    // return(
    //   <HomeScreen></HomeScreen>
    // )
    return (
      <PaperProvider>
        <NavigationContainer>
          <Drawer.Navigator initialRouteName="Home" edgeWidth={50}>
            <Drawer.Screen name="Home" component={HomeScreen} />
            <Drawer.Screen name="Notifications" component={SettingScreen} />
          </Drawer.Navigator>
        </NavigationContainer>
      </PaperProvider>
    );
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
  toolbar: {
   }
})
