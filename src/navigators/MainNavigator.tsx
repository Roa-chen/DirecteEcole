import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Alert, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Auth from '../screens/Auth';
import Home from '../screens/Home';
import { CN_KEY, CV_KEY, PASSWORD_KEY, USERNAME_KEY, UserInfo } from '../assets/constants';
import { Colors } from '../GlobalStyles';
import { useAppDispatch } from '../assets/utils';
import { logIn_, unrealPassword, unrealUsername } from '../services';
import { clearUser, setUserData } from '../reducers/UserSlice';

interface Props {

}

const MainNavigator: React.FC<Props> = ({ }) => {

  const [connectionState, setConnectionState] = useState(0);

  const dispatch = useAppDispatch()

  useEffect(() => {
    AsyncStorage.multiGet([USERNAME_KEY, PASSWORD_KEY, CN_KEY, CV_KEY], (err, store) => {

      console.log(store)

      let username = store?.find(elem => elem[0] == USERNAME_KEY)?.[1] ?? '';
      let password = store?.find(elem => elem[0] == PASSWORD_KEY)?.[1] ?? '';
      let cn = store?.find(elem => elem[0] == CN_KEY)?.[1] ?? '';
      let cv = store?.find(elem => elem[0] == CV_KEY)?.[1] ?? '';

      if (username) username = JSON.parse(username);
      if (password) password = JSON.parse(password);
      if (cn) cn = JSON.parse(cn);
      if (cv) cv = JSON.parse(cv);

      if (username && password && cn && cv) {
        logIn(username, password, undefined, undefined, cn, cv).then(connectionResponse => {
          if (!connectionResponse.success) {
            Alert.alert('Erreur:', connectionResponse.message, [
              {
                text: 'Réesayer',
                onPress: () => {
                  logIn(username, password, cn, cv)
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
        });
      } else {
        setConnectionState(1);
      }
    });
  }, [])

  async function logIn(username: string, password: string, response?: string, token?: string, cn?: string, cv?: string) {

    const connectionResponse = await logIn_(username, password, response, token, cn, cv)

    if (username === unrealUsername && password === unrealPassword) {

      dispatch(setUserData({ userInfo: connectionResponse.data }))
      console.log(connectionResponse.data);
      setConnectionState(2)
      return connectionResponse;
    }

    if (connectionResponse.success) {
      AsyncStorage.setItem(USERNAME_KEY, JSON.stringify(connectionResponse.data?.username))
      AsyncStorage.setItem(PASSWORD_KEY, JSON.stringify(connectionResponse.data?.password))
      AsyncStorage.setItem(CN_KEY, JSON.stringify(connectionResponse.doubleAuthInfo?.cn))
      AsyncStorage.setItem(CV_KEY, JSON.stringify(connectionResponse.doubleAuthInfo?.cv))
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