import React from 'react';
import {View, StyleSheet, Text, Button} from 'react-native';
import { getUser } from '../services/User';

interface Props {
  unregister: ()=>void,
}

const Home: React.FC<Props> = ({unregister}) => {

  const user = getUser()

  return (
    <View style={styles.container}>
      <Text>{user.firstName + ' ' + user.lastName}</Text>
      <Button title={'unregister'} onPress={() => unregister()} />
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

export default Home;