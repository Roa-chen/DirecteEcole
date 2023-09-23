
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import MainNavigator from './src/navigators/MainNavigator';
import { Colors } from './src/GlobalStyles';

const App = () => {

  return (
    <SafeAreaView style={styles.container}>
      <MainNavigator />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
});

export default App;
