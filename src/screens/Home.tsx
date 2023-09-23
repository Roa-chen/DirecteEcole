import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Button, RefreshControl, ScrollView } from 'react-native';
import { getUser } from '../services/User';
import DisciplineComponent from '../components/DisciplineComponent';
import { Colors, FontFamily, FontSize, Spaces } from '../GlobalStyles';

interface Props {
  unregister: () => void,
}

const Home: React.FC<Props> = ({ unregister }) => {

  const user = getUser()
  const [average, setAverage] = useState(-1);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    updateGrades();
  }, [])

  const updateGrades = () => {
    setRefreshing(true)
    user.getGrades().then(() => {
      setAverage(user.periods[0].averageCalculated)
    }).finally(() => {
      setRefreshing(false)
    })
  }

  return (
    <View style={styles.container}>

      <ScrollView
        style={{ width: '100%' }}
        contentContainerStyle={styles.disciplineContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl onRefresh={updateGrades} refreshing={refreshing} colors={[Colors.lightBackground]} />}
      >

        <Text style={{
          color: Colors.lightText,
        }}>{user.firstName + ' ' + user.lastName}</Text>
        <Text style={styles.averageText}>{average}</Text>

        <Button title={'unregister'} onPress={() => unregister()} />

        {user.periods[0]?.disciplines.map(discipline => {

          return (
            <DisciplineComponent key={'discipline' + discipline.codeDiscipline} discipline={discipline} />
          )
        })}
      </ScrollView>


    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexGrow: 1,
  },
  disciplineContainer: {
    width: '100%',
    paddingHorizontal: Spaces.small,
    paddingTop: Spaces.small,
    flexGrow: 1,
    alignItems: 'center',
  },
  averageText: {
    color: Colors.lightText,
    fontSize: FontSize.large * 2,
    fontFamily: FontFamily.interBold,
    fontWeight: 'bold',
  }
})

export default Home;