import React, { Dispatch, SetStateAction } from 'react';
import { View, StyleSheet, Modal, TouchableWithoutFeedback, Text, Button, Switch, ScrollView, TouchableOpacity, } from 'react-native';
import { BorderRadius, Colors, FontFamily, FontSize, Spaces, SubTitleText } from '../GlobalStyles';
import { roundGrade, useAppSelector } from '../assets/utils';
import LinearGradient from 'react-native-linear-gradient';

interface Props {
  visible: boolean,
  onDismiss: () => void,
  periodIndex: number,
  setPeriodIndex: Dispatch<SetStateAction<number>>,
  childIndex: number,
  setChildIndex: Dispatch<SetStateAction<number>>,
  unregister: () => void,
}

const ProfileModal: React.FC<Props> = ({ visible, onDismiss, periodIndex, setPeriodIndex, childIndex, setChildIndex, unregister }) => {

  const user = useAppSelector(state => state.user)

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
          <ScrollView style={{ width: '100%' }} showsVerticalScrollIndicator={false}>

            <Text style={styles.lineTitle}>Période :</Text>
            <View style={styles.periodsContainer}>
              {Array(user.numberOfPeriod).fill(0).map((_, index) => {
                return (
                  <View key={'periodSelectorButton-' + index} style={{ width: `${100 / (user.numberOfPeriod ?? 3)}%` }}>
                    <TouchableWithoutFeedback onPress={() => setPeriodIndex(index)}>
                      <View style={[styles.button, periodIndex !== index && { opacity: .3 }]}>
                        <Text style={styles.text}>{index + 1}</Text>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                )
              })}
            </View>


            {user.childs.length > 1 &&
              <>
                <LimitBar />
                <Text style={styles.lineTitle}>Enfants :</Text>
                <View style={styles.childsContainer}>
                  {user.childs.map((child, index) => {
                    return (
                      <TouchableWithoutFeedback key={'child-' + child.firstName + '-' + index} onPress={() => setChildIndex(index)} style={{ marginBottom: Spaces.extra_small }}>
                        <View style={[styles.button, { marginBottom: Spaces.extra_small }, childIndex !== index && { opacity: .3 }]}>
                          <Text style={styles.text}>{child.firstName} {child.lastName}</Text>
                        </View>
                      </TouchableWithoutFeedback>
                    )
                  })}
                </View>
              </>
            }

            <LimitBar />

            <TouchableOpacity onPress={() => unregister()}>
              <View style={[styles.button]}>
                <Text style={styles.text}>se déconnecter</Text>
              </View>
            </TouchableOpacity>

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
  button: {
    marginHorizontal: Spaces.extra_small,
    backgroundColor: Colors.lightBackground,
    borderWidth: 2,
    borderColor: Colors.callToAction,
    borderRadius: BorderRadius.small,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...SubTitleText,
    fontWeight: 'bold',
    marginVertical: Spaces.extra_small
  },
  lineTitle: {
    ...SubTitleText,
    fontWeight: 'bold',
    marginVertical: Spaces.small,
  },
  childsContainer: {
    width: '100%',
  },
})

export default ProfileModal;