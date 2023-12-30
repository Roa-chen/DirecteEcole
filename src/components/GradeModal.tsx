import React, { useEffect } from 'react';
import { View, StyleSheet, Modal, TouchableWithoutFeedback, Text, Button, Switch } from 'react-native';
import { BorderRadius, Colors, FontFamily, FontSize, Spaces, SubTitleText } from '../GlobalStyles';
import { Grade } from '../assets/constants';
import { roundGrade, useAppDispatch, useAppSelector } from '../assets/utils';
import { setSignificant } from '../reducers/UserSlice';

interface Props {
  visible: boolean,
  onDismiss: () => void,
  gradeId: string | undefined,
}

const GradeModal: React.FC<Props> = ({ visible, onDismiss, gradeId }) => {

  if (!gradeId) return;




  const user = useAppSelector(state => state.user);

  const grade = user.grades?.[gradeId];
  if (!grade) return;

  const dispatch = useAppDispatch();

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
            <LineGrade name={"Note"} value={roundGrade(grade.value)} denominator={grade.denominator} />
            <LineGrade name={"Moyenne de classe"} value={grade.averageClass} denominator={grade.denominator} />
            <LineGrade name={"Note maximum"} value={grade.maxClass} denominator={grade.denominator} />
            <LineGrade name={"Note minimum"} value={grade.minClass} denominator={grade.denominator} />

            <View style={styles.separationLine} />

            <LineSwitch name={"Note significative"} value={grade.significant} onPress={() => {
              dispatch(setSignificant({ gradeId: grade.id, significant: !grade.significant }))

            }} />

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
  denominator: number,
  template?: boolean,
}> = ({ name, value, denominator, template = false }) => {
  return (
    <View style={[styles.lineContainer, template && { marginBottom: Spaces.small }]}>
      <Text style={styles.lineText}>{name}{template ? "" : ":"}</Text>
      <View style={styles.lineGradeContainer}>
        <View style={styles.gradeContainer}>
          {<Text style={styles.lineText}>{template ? '/' : ''}{value.toString()}</Text>}
        </View>
        <View style={styles.gradeContainer}>
          {denominator !== 20 && <Text style={styles.lineText}>{template ? '/' : ''}{roundGrade((value / denominator) * 20).toString()}</Text>}
        </View>
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
    // fontWeight: 'bold',
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
  lineGradeContainer: {
    width: '35%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gradeContainer: {
    width: '50%',
    alignContent: "flex-end",
  },
})

export default GradeModal;