
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import MainNavigator from './src/navigators/MainNavigator';

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
  },
});

export default App;
