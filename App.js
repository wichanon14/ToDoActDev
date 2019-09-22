import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Routes from './Route.js';

export default class App extends Component {
  
  render(){
    return (
      <Routes />
    );
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
