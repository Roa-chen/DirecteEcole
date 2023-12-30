import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Alert, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import Auth from '../screens/Auth';
import Home from '../screens/Home';
import { PASSWORD_KEY, USERNAME_KEY } from '../assets/constants';
import { Colors } from '../GlobalStyles';
import { useAppDispatch } from '../assets/utils';
import { logIn_ } from '../services';
import { clearUser, setUserData } from '../reducers/UserSlice';

interface Props {

}

const MainNavigator: React.FC<Props> = ({ }) => {

  const [connectionState, setConnectionState] = useState(0);

  const dispatch = useAppDispatch()

  useEffect(() => {

    AsyncStorage.getItem(USERNAME_KEY).then(
      username => {
        // console.log('username: ', username)
        if (username) {
          AsyncStorage.getItem(PASSWORD_KEY).then(
            password => {
              // console.log('password: ', password)
              if (password) {
                logIn(JSON.parse(username), JSON.parse(password)).then(connectionResponse => {
                  if (!connectionResponse.success) {
                    Alert.alert('Erreur:', connectionResponse.message, [
                      {
                        text: 'Réesayer',
                        onPress: () => {
                          logIn(username, password)
                        }
                      }
                    ],
                      {
                        cancelable: true,
                        onDismiss: () => {
                          BackHandler.exitApp()
                        }
                      })
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

  async function logIn(username: string, password: string) {

    const connectionResponse = await logIn_(username, password)

    if (connectionResponse.success) {
      AsyncStorage.setItem(USERNAME_KEY, JSON.stringify(connectionResponse.data?.username))
      AsyncStorage.setItem(PASSWORD_KEY, JSON.stringify(connectionResponse.data?.password))
      dispatch(setUserData({ userInfo: connectionResponse.data }))
      setConnectionState(2)
    } 

    return connectionResponse;
  }

  const unregister = () => {
    AsyncStorage.removeItem(USERNAME_KEY)
    AsyncStorage.removeItem(PASSWORD_KEY)

    setConnectionState(1)

    dispatch(clearUser());

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
    <Auth logIn={logIn} />
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