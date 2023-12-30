import React from 'react';
import { View, StyleSheet, Modal, TouchableWithoutFeedback, Text } from 'react-native';
import { BorderRadius, Colors, FontSize, Spaces, SubTitleText } from '../GlobalStyles';
import { roundGrade, useAppDispatch, useAppSelector } from '../assets/utils';
import { setSignificant } from '../reducers/UserSlice';
import Line from './Modal/Line';
import GradeLine from './Modal/GradeLine';
import SwitchLine from './Modal/SwitchLine';
import TitleLine from './Modal/TitleLine';

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

  let indicatorColor = '';
  let text = '';

  if (grade.value === grade.maxClass) { indicatorColor = '#06A77D'; text = 'Meilleure note' }
  else if (grade.value >= grade.averageClass) { indicatorColor = '#FDCC21'; text = 'Au dessus de la moyenne' }
  else if (grade.value <= grade.averageClass) { indicatorColor = '#FB8B24'; text = 'En dessous de la moyenne' }

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

            <TitleLine text={grade.name} />

            <Line name={"Matière"} value={grade.nameDiscipline} />
            <Line name={"Devoir"} value={grade.typeTest} />
            <Line name={"date"} value={grade.date} />
            <Line name={"Coefficient"} value={grade.coef.toString()} />

            <View style={styles.separationLine} />

            <GradeLine name={''} value={grade.denominator} denominator={grade.denominator} isTemplate />
            <GradeLine name={"Note"} value={roundGrade(grade.value)} denominator={grade.denominator} />
            <GradeLine name={"Moyenne de classe"} value={grade.averageClass} denominator={grade.denominator} />
            <GradeLine name={"Note maximum"} value={grade.maxClass} denominator={grade.denominator} />
            <GradeLine name={"Note minimum"} value={grade.minClass} denominator={grade.denominator} />

            <View style={styles.rankIndicatorContainer}>
              <Text style={styles.lineText}>{text}:</Text>
              <View style={{
                backgroundColor: indicatorColor,
                width: Spaces.small,
                height: Spaces.small,
                borderRadius: BorderRadius.infinite,
                marginLeft: Spaces.small,
              }} />
            </View>

            <View style={styles.separationLine} />

            <SwitchLine name={"Note significative"} value={grade.significant} onPress={() => {
              dispatch(setSignificant({ gradeId: grade.id, significant: !grade.significant }))

            }} />

          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
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
  lineText: {
    ...SubTitleText,
    color: Colors.lightText,
    fontSize: FontSize.small,
  },
  separationLine: {
    height: 1,
    width: '100%',
    backgroundColor: Colors.lightBackground,
    marginVertical: Spaces.small,
  },
  rankIndicatorContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})

export default GradeModal;