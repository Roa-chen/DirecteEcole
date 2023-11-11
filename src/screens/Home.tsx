import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, TextInput, RefreshControl, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { getUser } from '../services/User';
import DisciplineComponent from '../components/DisciplineComponent';
import { Colors, FontFamily, FontSize, Spaces, SubTitleText } from '../GlobalStyles';
import ProfileModal from '../components/ProfileModal';
import { SvgXml } from 'react-native-svg';
import { settings_icon } from '../assets/svgs';

interface Props {
  unregister: () => void,
}

const Home: React.FC<Props> = ({ unregister }) => {

  const [periodIndex, setPeriodIndex] = useState(0);
  const [childIndex, setChildIndex] = useState(0);

  const user = getUser()
  const [average, setAverage] = useState<number>();
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    if (!user.connected) {
      getUser().connect(user.username ?? '', user.password ?? '').then((response) => {
        if (response.success) {
          updateGrades(true);
          user.subscribe(() => setAverage(user.periods[periodIndex]?.averageCalculated))
        } else {
          Alert.alert('Erreur:', response.message)
          setIsBlocked(true);
        }

      })
    } else {
      updateGrades(true);
      user.subscribe(() => setAverage(user.periods[periodIndex]?.averageCalculated))
    }
  }, [])

  useEffect(() => {
    setAverage(user.periods[periodIndex]?.averageCalculated)
  }, [periodIndex])

  useEffect(() => {
    user.changeChild(childIndex)
  }, [childIndex])

  const updateGrades = (hideRefresh = false) => {
    setIsBlocked(false)
    !hideRefresh && setRefreshing(true)
    user.getGrades().then((success) => {
      if (success) {
        const currentPeriod = user.getCurrentPeriod();
        setPeriodIndex(currentPeriod);
        setAverage(user.periods[currentPeriod].averageCalculated);
        setIsBlocked(false)
      } else {
        setIsBlocked(true)
      }
    }).finally(() => {
      !hideRefresh && setRefreshing(false)
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

      <ScrollView
        style={{ width: '100%' }}
        contentContainerStyle={styles.disciplineContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl onRefresh={updateGrades} refreshing={refreshing} colors={[Colors.lightBackground]} />}
      >

        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => setModalVisible(true)} >
            <Text style={styles.nameText}>{(user.firstName ?? '') + ' ' + (user.lastName ?? '')}</Text>
          </TouchableOpacity>


          <TouchableOpacity onPress={() => setModalVisible(true)} >
            {/* <Text style={styles.buttonText}>Se déconnecter</Text> */}
            <View style={styles.settinfgsButton}>
              <SvgXml xml={settings_icon} width={FontSize.medium} height={FontSize.medium} />
            </View>
          </TouchableOpacity>
        </View>

        {average !== undefined && <Text style={styles.averageText}>{!Number.isNaN(average) ? average : 'Pas de note'}</Text>}
        {(average === undefined && !isBlocked) && <ActivityIndicator style={styles.averageText} color={Colors.transparentCallToAction} size={'large'} />}
        {(average === undefined && isBlocked) && (
          <TouchableOpacity onPress={() => updateGrades(true)} >
            <Text style={styles.errorText}>Recharger</Text>
          </TouchableOpacity>
        )}

        { user.periods.length !== 0 && user.periods[periodIndex]?.disciplines.map(discipline => (
          <DisciplineComponent key={'discipline-' + discipline.codeDiscipline + '-period-' + periodIndex} discipline={discipline} />
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
    width: '100%',
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
    marginVertical: Spaces.extra_small,
    marginRight: Spaces.small,
  },
  buttonText: {
    ...SubTitleText,
    color: Colors.callToAction,
  },
  errorText: {
    ...SubTitleText,
    color: Colors.callToAction,
    fontSize: FontSize.medium,
    marginTop: Spaces.large,
    fontWeight: 'bold',
  },
  settinfgsButton: {
    marginHorizontal: Spaces.small,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spaces.extra_small,
  },
})

export default Home;