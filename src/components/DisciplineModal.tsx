import React from 'react';
import { View, StyleSheet, Modal, TouchableWithoutFeedback, Text, Button, Switch } from 'react-native';
import { BorderRadius, Colors, FontFamily, FontSize, Spaces, SubTitleText } from '../GlobalStyles';
import { Discipline, Grade } from '../assets/constants';
import { roundGrade } from '../assets/utils';
import { getUser } from '../services/User';

interface Props {
  visible: boolean,
  onDismiss: () => void,
  discipline: Discipline,
}

const DisciplineModal: React.FC<Props> = ({ visible, onDismiss, discipline }) => {
  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      transparent={true}
      animationType='fade'
    >
      <TouchableWithoutFeedback onPress={(evt) => evt.target == evt.currentTarget && onDismiss()}>
        <View style={styles.overlay}>
          <View style={styles.contentContainer}>

            <Text style={styles.titleText}>{discipline.nameDiscipline}:</Text>

            <Line name={"Coefficient"} value={discipline.coef.toString()} />

            <View style={styles.separationLine} />

            <LineGrade name={"Moyenne Calculée"} value={roundGrade(discipline.averageCalculated)} />
            <LineGrade name={"Moyenne Officielle"} value={roundGrade(discipline.averageOfficial)} />
            <LineGrade name={"Moyenne de classe"} value={discipline.averageClass} />
            <LineGrade name={"Moyenne maximum"} value={discipline.maxAverageClass} />
            <LineGrade name={"Moyenne minimum"} value={discipline.minAverageClass} />

          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const Line: React.FC<{
  name: string,
  value: string
}> = ({ name, value }) => {
  return (
    <View style={styles.lineContainer}>
      <Text style={styles.lineText}>{name}:</Text>
      <Text style={styles.lineText}>{value}</Text>
    </View>
  )
}

const LineSwitch: React.FC<{
  name: string,
  value: boolean,
  onPress: () => void,
}> = ({ name, value, onPress }) => {
  return (
    <View style={styles.lineContainer}>
      <Text style={styles.lineText}>{name}:</Text>
      <Switch
        value={value}
        thumbColor={Colors.callToAction}
        trackColor={{
          true: Colors.transparentCallToAction
        }}
        onTouchEnd={onPress}
      />
    </View>
  )
}

const LineGrade: React.FC<{
  name: string,
  value: number,
}> = ({ name, value }) => {
  return (
    <View style={styles.lineContainer}>
      <Text style={styles.lineText}>{name}:</Text>
      <Text style={styles.lineText}>{value.toString()}</Text>
    </View>
  )
}


const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    borderRadius: BorderRadius.medium,
    width: '80%',
    minHeight: '60%',
    backgroundColor: Colors.background,
    padding: Spaces.medium,
    alignItems: 'center',
  },
  lineContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: Spaces.extra_small,
  },
  lineText: {
    ...SubTitleText,
    color: Colors.lightText,
    fontSize: FontSize.small,
    fontWeight: 'bold',
  },
  separationLine: {
    height: 1,
    width: '100%',
    backgroundColor: Colors.lightBackground,
    marginVertical: Spaces.small,
  },
  titleText: {
    ...SubTitleText,
    color: Colors.lightText,
    fontSize: FontSize.medium,
    fontWeight: 'bold',
    marginBottom: Spaces.medium,
  },
})

export default DisciplineModal;