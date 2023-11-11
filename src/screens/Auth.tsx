import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, Button, ActivityIndicator, TouchableOpacity, Alert, Switch, Keyboard } from 'react-native';
import { BorderRadius, Colors, FontSize, Spaces, SubTitleText, TitleText } from '../GlobalStyles';
import { ConnectionResponse } from '../assets/constants';

interface Props {
  connect: (username: string, password: string) => Promise<ConnectionResponse>
}

const Auth: React.FC<Props> = ({ connect }) => {

  const [usernameText, setUsernameText] = useState('');
  const [passwordText, setPasswordText] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const [fetching, setFetching] = useState(false);


  return (
    <View style={styles.container}>

      <Text style={styles.title}>DirecteEcole</Text>

      <View style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
      }}>

        <TextInput style={styles.textInput} placeholder='Identifiant EcoleDirecte' value={usernameText} onChangeText={setUsernameText} cursorColor={Colors.callToAction} selectionColor={Colors.transparentCallToAction} autoCapitalize='none' />
        <TextInput style={styles.textInput} placeholder='Mot de passe EcoleDirecte' value={passwordText} onChangeText={setPasswordText} cursorColor={Colors.callToAction} selectionColor={Colors.transparentCallToAction} autoCapitalize='none' secureTextEntry={!showPassword} />

        <View style={styles.showPasswordContainer} >
          <Text style={styles.showPasswordText} >Afficher le mot de passe</Text>
          <Switch
            value={showPassword}
            thumbColor={Colors.callToAction}
            trackColor={{
              true: Colors.transparentCallToAction
            }}
            onValueChange={(value) => setShowPassword(!showPassword)}
          />
        </View>

        <View style={{
          width: '70%',
          height: 1,
          backgroundColor: Colors.lightBackground,
          marginTop: Spaces.small,
          marginBottom: Spaces.medium,
        }} />

        <TouchableOpacity
          onPress={() => {
            setFetching(true)
            connect(usernameText, passwordText).then((response) => {
              setFetching(false)
              if (!response.success) {
                Alert.alert('Erreur:', response.message)
              }
              Keyboard.dismiss()
            })
          }}
          style={{ width: '100%' }}
        >
          <>
            <View style={styles.connectionButton}>
              <Text style={styles.connectionText}>Se connecter</Text>
              {fetching && <ActivityIndicator color={Colors.transparentCallToAction} style={styles.activityIndicator} size={'large'} />}
            </View>
          </>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: Spaces.large,
  },
  title: {
    ...TitleText,
    fontSize: FontSize.large * 2,
    
  },
  textInput: {
    backgroundColor: Colors.lightBackground,
    width: '100%',
    paddingHorizontal: Spaces.small,
    marginBottom: Spaces.small,
    borderRadius: BorderRadius.infinite,
    ...SubTitleText,
    color: Colors.lightText,
  },
  connectionButton: {
    borderColor: Colors.callToAction,
    borderWidth: 3,
    borderRadius: BorderRadius.infinite,
    width: '100%',
    paddingVertical: Spaces.small,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  connectionText: {
    ...SubTitleText,
    fontSize: FontSize.medium,
    fontWeight: 'bold',
    color: Colors.lightText,
  },
  activityIndicator: {
    marginLeft: Spaces.small,
  },

  showPasswordContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  showPasswordText: {
    ...SubTitleText,
    marginLeft: Spaces.extra_small,
  },
})

export default Auth;