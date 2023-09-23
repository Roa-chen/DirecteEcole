import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, TextInput, RefreshControl, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getUser } from '../services/User';
import DisciplineComponent from '../components/DisciplineComponent';
import { Colors, FontFamily, FontSize, Spaces, SubTitleText } from '../GlobalStyles';

interface Props {
  unregister: () => void,
}

const Home: React.FC<Props> = ({ unregister }) => {
  
  const periodIndex = 0;

  const user = getUser()
  const [average, setAverage] = useState<number>();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    updateGrades(true);
    user.subscribe(() => setAverage(user.periods[periodIndex].averageCalculated))
  }, [])

  const updateGrades = (hideRefresh = false) => {
    !hideRefresh && setRefreshing(true)
    user.getGrades().then(() => {
      setAverage(user.periods[periodIndex].averageCalculated)
    }).finally(() => {
      !hideRefresh && setRefreshing(false)
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

        <View style={styles.headerContainer}>
          <Text style={styles.nameText}>{user.firstName + ' ' + user.lastName}</Text>

          <TouchableOpacity onPress={() => unregister()} >
            <Text style={styles.buttonText}>Se déconnecter</Text>
          </TouchableOpacity>
        </View>

        {average !== undefined && <Text style={styles.averageText}>{average}</Text>}
        {average === undefined && <ActivityIndicator style={styles.averageText} color={Colors.transparentCallToAction} size={'large'} />}

        {user.periods[periodIndex]?.disciplines.map(discipline => (
          <DisciplineComponent key={'discipline' + discipline.codeDiscipline} discipline={discipline} />
        ))}
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
    marginVertical: Spaces.large,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorisontal: Spaces.small,
  },
  nameText: {
    ...SubTitleText,
    color: Colors.lightText,
  },
  buttonText: {
    ...SubTitleText,
    color: Colors.callToAction,
    marginVertical: Spaces.extra_small,
    marginLeft: Spaces.small,
  },
})

export default Home;