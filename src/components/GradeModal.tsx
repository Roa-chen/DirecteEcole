import React from 'react';
import { View, StyleSheet, Modal, TouchableWithoutFeedback, Text } from 'react-native';
import { BorderRadius, Colors, FontFamily, FontSize, Spaces, SubTitleText } from '../GlobalStyles';
import { Grade } from '../assets/constants';
import { roundGrade } from '../assets/utils';

interface Props {
  visible: boolean,
  onDismiss: () => void,
  grade: Grade,
}

const GradeModal: React.FC<Props> = ({ visible, onDismiss, grade }) => {
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

            <Text style={styles.titleText}>{grade.name}:</Text>

            <Line name={"Matière"} value={grade.nameDiscipline} />
            <Line name={"Devoir"} value={grade.typeTest} />
            <Line name={"date"} value={grade.date} />
            <Line name={"Coefficient"} value={grade.coef.toString()} />

            <View style={styles.separationLine} />

            <LineGrade name={''} value={grade.denominator} denominator={grade.denominator} template />

            <LineGrade name={"note"} value={roundGrade(grade.value)} denominator={grade.denominator} />
            <LineGrade name={"Moyenne de classe"} value={grade.averageClass} denominator={grade.denominator} />
            <LineGrade name={"Note maximum"} value={grade.maxClass} denominator={grade.denominator} />
            <LineGrade name={"Note minimum"} value={grade.minClass} denominator={grade.denominator} />


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

const LineGrade: React.FC<{
  name: string,
  value: number,
  denominator: number,
  template: boolean,
}> = ({ name, value, denominator, template }) => {
  return (
    <View style={[styles.lineContainer, template&&{marginBottom: Spaces.small}]}>
      <Text style={styles.lineText}>{name}{template ? "" : ":"}</Text>
      <View style={{
        width: '35%',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
        {<Text style={styles.lineText}>{template ? '/' : ''}{value.toString()}</Text>}
        {denominator !== 20 && <Text style={styles.lineText}>{template ? '/' : ''}{roundGrade((value / denominator) * 20).toString()}</Text>}
      </View>
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

export default GradeModal;