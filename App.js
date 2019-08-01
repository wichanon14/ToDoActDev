import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Main from './page/Main.js'

export default function App() {
  return (
    <View style={{flex:1}}>
      <Main />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
