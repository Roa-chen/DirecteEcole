import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, Button, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { BorderRadius, Colors, FontSize, Spaces, SubTitleText } from '../GlobalStyles';
import { ConnectionResponse } from '../assets/constants';

interface Props {
  connect: (username: string, password: string) => Promise<ConnectionResponse>
}

const Auth: React.FC<Props> = ({ connect }) => {

  const [usernameText, setUsernameText] = useState('arsene.chardon');
  const [passwordText, setPasswordText] = useState('larsenaldu26');

  const [fetching, setFetching] = useState(false);


  return (
    <View style={styles.container}>
      <TextInput style={styles.textInput} placeholder='Identifiant EcoleDirecte' value={usernameText} onChangeText={setUsernameText} cursorColor={Colors.callToAction} selectionColor={Colors.transparentCallToAction} autoCapitalize='none' />
      <TextInput style={styles.textInput} placeholder='Mot de passe EcoleDirecte' value={passwordText} onChangeText={setPasswordText} cursorColor={Colors.callToAction} selectionColor={Colors.transparentCallToAction} autoCapitalize='none' secureTextEntry />

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
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spaces.large,
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
})

export default Auth;