import React, {useState} from 'react';
import {View, StyleSheet, Text, TextInput, Button, ActivityIndicator} from 'react-native';

interface Props {
  connect: (username: string, password: string) => Promise<boolean>
}

const Auth: React.FC<Props> = ({connect}) => {

  const [usernameText, setUsernameText] = useState('');
  const [passwordText, setPasswordText] = useState('');

  const [fetching, setFetching] = useState(false);


  return (
    <View style={styles.container}>
      <TextInput placeholder='enter username' value={usernameText} onChangeText={setUsernameText} />
      <TextInput placeholder='enter password' value={passwordText} onChangeText={setPasswordText} />
      <Button title='connect' onPress={() => {
        setFetching(true)
        connect(usernameText, passwordText).then(() => setFetching(false))
      }} />
      {fetching && <ActivityIndicator size={'large'} />}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
})

export default Auth;