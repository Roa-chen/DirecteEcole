import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Button, RefreshControl, ScrollView, TouchableOpacity } from 'react-native';
import { getUser } from '../services/User';
import DisciplineComponent from '../components/DisciplineComponent';
import { Colors, FontFamily, FontSize, Spaces, SubTitleText} from '../GlobalStyles';

interface Props {
  unregister: () => void,
}

const Home: React.FC<Props> = ({ unregister }) => {

  const user = getUser()
  const [average, setAverage] = useState<number>();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    updateGrades(true);
    user.subscribe(() => setAverage(user.periods[0].averageCalculated))
  }, [])

  const updateGrades = (hideRefresh = false) => {
    !hideRefresh && setRefreshing(true)
    user.getGrades().then(() => {
      setAverage(user.periods[0].averageCalculated)
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


        <Text style={styles.averageText}>{average}</Text>

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