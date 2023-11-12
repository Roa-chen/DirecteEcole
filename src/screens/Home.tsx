import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, TextInput, RefreshControl, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import DisciplineComponent from '../components/DisciplineComponent';
import { Colors, FontFamily, FontSize, Spaces, SubTitleText } from '../GlobalStyles';
import ProfileModal from '../components/ProfileModal';
import { SvgXml } from 'react-native-svg';
import { settings_icon } from '../assets/svgs';
import { windowWidth } from '../assets/constants';
import GradeList from '../components/GradeList';
import { useAppDispatch, useAppSelector } from '../assets/utils';
import { fetchGrades_ } from '../services';
import { setUserData } from '../reducers/UserSlice';

interface Props {
  unregister: () => void,
}

const Home: React.FC<Props> = ({ unregister }) => {

  const user = useAppSelector(state => state.user)
  const dispatch = useAppDispatch()

  const [periodIndex, setPeriodIndex] = useState(0);
  const [childIndex, setChildIndex] = useState(0);

  const average = user.periods[periodIndex]?.averageCalculated
  
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [isBlocked, setIsBlocked] = useState(false);

  async function fetchGrades() {

    const gradeResponse = await fetchGrades_(user.token??'', user.id??'');

    if (gradeResponse.success && gradeResponse.data) {
      dispatch(setUserData({userInfo: gradeResponse.data}))
    } else {
      Alert.alert('Error', gradeResponse.message)
    }

  }

  useEffect(() => {

    if (!user.connected) {
      //FIXME: unregister
      // getUser().connect(user.username ?? '', user.password ?? '').then((response) => {
      //   if (response.success) {
      //     updateGrades(true);
      //     user.subscribe(() => setAverage(user.periods[periodIndex]?.averageCalculated))
      //   } else {
      //     Alert.alert('Erreur:', response.message)
      //     setIsBlocked(true);
      //   }
      // })
    } else {
      fetchGrades()
    }
  }, [])

  useEffect(() => {
    // setAverage(user.periods[periodIndex]?.averageCalculated)
  }, [periodIndex])

  useEffect(() => {
    // user.changeChild(childIndex)
  }, [childIndex])

  const updateGrades = (hideRefresh = false) => {

    console.log(user)

    // fetchGrades()

    // setIsBlocked(false)
    // !hideRefresh && setRefreshing(true)
    // user.fetchGrades().then((success) => {
    //   if (success) {
    //     const currentPeriod = user.getCurrentPeriod();
    //     setPeriodIndex(currentPeriod);
    //     setAverage(user.periods[currentPeriod].averageCalculated);
    //     setIsBlocked(false)
    //   } else {
    //     setIsBlocked(true)
    //   }
    // }).finally(() => {
    //   !hideRefresh && setRefreshing(false)
    // })
  }

  return (
    <View style={styles.container}>

      <ProfileModal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        periodIndex={periodIndex}
        setPeriodIndex={setPeriodIndex}
        childIndex={childIndex}
        setChildIndex={setChildIndex}
        unregister={unregister}
      />

      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => setModalVisible(true)} >
          <Text style={styles.nameText}>{(user.firstName ?? '') + ' ' + (user.lastName ?? '')}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setModalVisible(true)} >
          <View style={styles.settingsButton}>
            <SvgXml xml={settings_icon} width={FontSize.medium} height={FontSize.medium} />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        style={{ width: windowWidth }}
        pagingEnabled
      >

        <View style={{ width: windowWidth }}>
          <ScrollView
            style={{ width: '100%' }}
            contentContainerStyle={styles.disciplineContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl onRefresh={updateGrades} refreshing={refreshing} colors={[Colors.lightBackground]} />}
          >
            {average !== undefined && <Text style={styles.averageText}>{!Number.isNaN(average) ? average : 'Pas de note'}</Text>}
            {(average === undefined && !isBlocked) && <ActivityIndicator style={styles.averageText} color={Colors.transparentCallToAction} size={'large'} />}
            {(average === undefined && isBlocked) && (
              <TouchableOpacity onPress={() => updateGrades(true)} >
                <Text style={styles.errorText}>Recharger</Text>
              </TouchableOpacity>
            )}
            {user.periods.length !== 0 && user.periods[periodIndex]?.disciplines.map(discipline => (
              <DisciplineComponent key={'discipline-' + discipline.codeDiscipline + '-period-' + periodIndex} discipline={discipline} />
            ))}
          </ScrollView>
        </View>

        <View style={{ width: windowWidth }}>
          <GradeList />
        </View>

      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexGrow: 1,
    width: '100%',
  },
  disciplineContainer: {
    width: '100%',
    paddingHorizontal: Spaces.small,
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
    paddingHorizontal: Spaces.small,
    paddingTop: Spaces.small,
  },
  nameText: {
    ...SubTitleText,
    color: Colors.lightText,
    marginVertical: Spaces.extra_small,
    marginRight: Spaces.small,
  },
  errorText: {
    ...SubTitleText,
    color: Colors.callToAction,
    fontSize: FontSize.medium,
    marginTop: Spaces.large,
    fontWeight: 'bold',
  },
  settingsButton: {
    marginLeft: Spaces.small,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spaces.extra_small,
  },
})

export default Home;