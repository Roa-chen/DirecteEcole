import React, { Dispatch, SetStateAction } from 'react';
import { View, StyleSheet, Modal, TouchableWithoutFeedback, Text, Button, Switch, ScrollView, } from 'react-native';
import { BorderRadius, Colors, FontFamily, FontSize, Spaces, SubTitleText } from '../GlobalStyles';
import { roundGrade } from '../assets/utils';
import { getUser } from '../services/User';
import LinearGradient from 'react-native-linear-gradient';

interface Props {
  visible: boolean,
  onDismiss: () => void,
  periodIndex: number,
  setPeriodIndex: Dispatch<SetStateAction<number>>,
}

const ProfileModal: React.FC<Props> = ({ visible, onDismiss, periodIndex, setPeriodIndex }) => {

  const user = getUser();

  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      transparent={true}
      animationType='slide'
    >
      <LinearGradient style={styles.overlay} colors={[Colors.background, 'transparent']} start={{ x: 0, y: .8 }} end={{ x: 0, y: 0 }} >
        <TouchableWithoutFeedback onPress={(evt) => { evt.target == evt.currentTarget && onDismiss() }}>
          <View style={{ flex: 1, width: '100%' }} />
        </TouchableWithoutFeedback>

        <View style={{
          width: '35%',
          height: 5,
          backgroundColor: Colors.lightBackground,
          marginBottom: Spaces.extra_small,
          borderRadius: BorderRadius.infinite,
        }} />

        <View style={styles.contentContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>

            <Text style={styles.lineTitle}>Période :</Text>

            <View style={styles.periodsContainer}>
              {Array(user.numberOfPeriod).fill(0).map((_, index) => {
                return (
                  <View key={'periodSelectorButton-' + index} style={{width: `${100/(user.numberOfPeriod??3)}%`}}>
                    <TouchableWithoutFeedback onPress={() => setPeriodIndex(index)}>
                      <View style={[styles.periodButton, periodIndex === index && {opacity: 1}]}>
                        <Text style={styles.periodText}>{index + 1}</Text>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                )
              })}
            </View>

            <LimitBar />


          </ScrollView>
        </View>
      </LinearGradient>
    </Modal>
  );
}

const LimitBar = () => {
  return (<View style={{
    width: '80%',
    height: 1,
    backgroundColor: Colors.lightBackground,
    marginVertical: Spaces.medium,
    alignSelf: 'center',
  }} />)
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  contentContainer: {
    elevation: 20,
    borderTopLeftRadius: BorderRadius.medium,
    borderTopRightRadius: BorderRadius.medium,
    width: '100%',
    minHeight: '40%',
    backgroundColor: Colors.background,
    padding: Spaces.medium,
    alignItems: 'center',
  },
  periodsContainer: {
    width: '100%',
    flexDirection: 'row',
  },
  periodButton: {
    marginHorizontal: Spaces.extra_small,
    backgroundColor: Colors.lightBackground,
    borderWidth: 2,
    borderColor: Colors.callToAction,
    borderRadius: BorderRadius.small,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: .3
  },
  periodText: {
    ...SubTitleText,
    fontWeight: 'bold',
    marginVertical: Spaces.extra_small
  },
  lineTitle: {
    ...SubTitleText,
    fontWeight: 'bold',
    marginVertical: Spaces.small,
  },
})

export default ProfileModal;