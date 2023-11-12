
import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import MainNavigator from './src/navigators/MainNavigator';
import { Colors } from './src/GlobalStyles';
import { Provider } from 'react-redux';
import store from './src/reducers';

const App = () => {

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        animated={true}
        backgroundColor={Colors.background}
        barStyle={'light-content'}
      />
      <Provider store={store}>
        <MainNavigator />
      </Provider>
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
