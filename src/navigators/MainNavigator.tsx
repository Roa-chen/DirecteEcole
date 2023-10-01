import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import Auth from '../screens/Auth';
import Home from '../screens/Home';
import { PASSWORD_KEY, USERNAME_KEY } from '../assets/constants';
import { clearUser, getUser } from '../services/User';
import { Colors } from '../GlobalStyles';

const Stack = createStackNavigator();

interface Props {

}

const MainNavigator: React.FC<Props> = ({ }) => {

  const [connectionState, setConnectionState] = useState(0);

  useEffect(() => {

    AsyncStorage.getItem(USERNAME_KEY).then(
      username => {
        console.log('username: ', username)

        if (username) {
          AsyncStorage.getItem(PASSWORD_KEY).then(
            password => {
              console.log('password: ', password)
              if (password) {
                getUser().connect(JSON.parse(username), JSON.parse(password)).then((response) => {
                  if (response.success) {
                    setConnectionState(2)
                  } else {
                    // Alert.alert('Erreur:', response.message)
                    setConnectionState(1)
                  }
                })
              } else {
                setConnectionState(1)
              }
            }
          )
        }
        else {
          setConnectionState(1)
        }
      }
    )
  }, [])




  async function connect(username: string, password: string) {

    const connectionResponse = await getUser().connect(username, password)

    if (connectionResponse.success) {
      AsyncStorage.setItem(USERNAME_KEY, JSON.stringify(connectionResponse.username))
      AsyncStorage.setItem(PASSWORD_KEY, JSON.stringify(connectionResponse.password))
      setConnectionState(2)
    }
    return connectionResponse;
  }

  const unregister = () => {
    AsyncStorage.removeItem(USERNAME_KEY)
    AsyncStorage.removeItem(PASSWORD_KEY)

    setConnectionState(1)

    clearUser();

    console.log('unregistered')
  }

  if (connectionState === 0) return (
    <View style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <ActivityIndicator color={Colors.transparentCallToAction} size={'large'} />

    </View>
  )

  if (connectionState === 1) return (
    <Auth connect={connect} />
  )

  if (connectionState === 2) return (
    <Home unregister={unregister} />
  )

}


const styles = StyleSheet.create({
  container: {

  }
})

export default MainNavigator;