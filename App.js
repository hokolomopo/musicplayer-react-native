import React from 'react';
import {Button, NativeEventEmitter, NativeModules, StyleSheet, Text, View} from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';

import MainAppbar from './src/components/MainAppbar';
import ToastExample from './src/packages/Modules';

//TODO : remove toolbarandroid lib
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
    return (
      <PaperProvider>
        <MainAppbar/>
        <Text>Hi</Text>
        <Button
          onPress={() => this._onPress()}
          title={'Toast'}
        />
      </PaperProvider>
    );
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
  toolbar: {
    backgroundColor: '#2196F3',
    height: 56,
    alignSelf: 'stretch',
    textAlign: 'center',
   }
})
