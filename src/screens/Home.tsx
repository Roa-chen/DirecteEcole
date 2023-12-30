import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, TextInput, RefreshControl, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import DisciplineComponent from '../components/DisciplineComponent';
import { BorderRadius, Colors, FontFamily, FontSize, Spaces, SubTitleText } from '../GlobalStyles';
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

  const [periodIndex, setPeriodIndex] = useState(0); //TODO set index to current period
  const [childIndex, setChildIndex] = useState(0);

  const average = user.periods?.[periodIndex]?.averageCalculated
  
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);

  const [isBlocked, setIsBlocked] = useState(false);

  async function fetchGrades() {

    const gradeResponse = await fetchGrades_(user.token??'', user.id??'');

    if (gradeResponse.success && gradeResponse.data) {
      dispatch(setUserData({userInfo: gradeResponse.data}))
      setLoading(0)
    } else {
      Alert.alert('Erreur:', gradeResponse.message)
      setLoading(2)
    }

  }

  useEffect(() => {
    fetchGrades()
  }, [])

  useEffect(() => {
    // user.changeChild(childIndex) //TODO
  }, [childIndex])

  const updateGrades = () => {
    setRefreshing(true);
    fetchGrades().then(() => {
      setRefreshing(false)
    })
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

      {loading ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          {loading === 1 && <ActivityIndicator style={styles.averageText} color={Colors.transparentCallToAction} size={'large'} />}
          {loading === 2 && 
            <TouchableOpacity onPress={() => {
              setLoading(1)
              fetchGrades()
            }}>
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Recharger</Text>
              </View>
            </TouchableOpacity>
          }
          
          
        </View>
      ) : (
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
              {average !== undefined && <Text style={styles.averageText}>{!Number.isNaN(average) ? average : '-'}</Text>}{/* Pas de note */}
              {(average === undefined && !isBlocked) && <ActivityIndicator style={styles.averageText} color={Colors.transparentCallToAction} size={'large'} />}
              {(average === undefined && isBlocked) && (
                <TouchableOpacity onPress={() => updateGrades()} >
                  <Text style={styles.errorText}>Recharger</Text>
                </TouchableOpacity>
              )}
              {user.periods?.length !== 0 && user.periods?.[periodIndex]?.disciplines.map(discipline => (
                <DisciplineComponent key={'discipline-' + discipline.codeDiscipline + '-period-' + periodIndex} discipline={discipline} />
              ))}
            </ScrollView>
          </View>

          <View style={{ width: windowWidth }}>
            <GradeList periodIndex={periodIndex} />
          </View>

        </ScrollView>
      )}

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
    fontWeight: 'bold',
  },
  errorContainer: {
    paddingHorizontal: Spaces.medium,
    paddingVertical: Spaces.small,
    borderRadius: BorderRadius.small,
    borderWidth: 2,
    borderColor: Colors.callToAction,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsButton: {
    marginLeft: Spaces.small,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spaces.extra_small,
  },
})

export default Home;