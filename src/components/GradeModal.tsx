import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Modal, TouchableWithoutFeedback, Text, Button, TouchableOpacity } from 'react-native';
import { BorderRadius, Colors, FontSize, Spaces, SubTitleText } from '../GlobalStyles';
import { roundGrade, useAppDispatch, useAppSelector } from '../assets/utils';
import { deleteGrade, setSignificant, unModifyGrade } from '../reducers/UserSlice';
import Line from './Modal/Line';
import GradeLine from './Modal/GradeLine';
import SwitchLine from './Modal/SwitchLine';
import TitleLine from './Modal/TitleLine';
import AddGradeModal from './AddGradeModal';
import ModifyGradeModal from './ModifyGradeModal';

interface Props {
  visible: boolean,
  onDismiss: () => void,
  gradeId: string | undefined,
}

const GradeModal: React.FC<Props> = ({ visible, onDismiss, gradeId }) => {

  if (!gradeId) return;

  const user = useAppSelector(state => state.user);
  user.periods

  const grade = (user.grades?.[gradeId]) ?? (user.unofficialGrades?.[gradeId]);
  if (!grade) return;

  const dispatch = useAppDispatch();

  let indicatorColor = '';
  let text = '';

  if (grade.value === grade.maxClass) { indicatorColor = Colors.color1; text = 'Meilleure note' }
  else if (grade.value >= grade.averageClass) { indicatorColor = Colors.color2; text = 'Au dessus de la moyenne' }
  else if (grade.value <= grade.averageClass) { indicatorColor = Colors.color2; text = 'En dessous de la moyenne' }

  const modified = grade.modifiedCoef || grade.modifiedDenominator || grade.modifiedValue;
  const denominator = grade.modifiedDenominator ?? grade.denominator;

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      transparent={true}
      animationType='fade'
    >

      <ModifyGradeModal visible={modalVisible} onDismiss={() => setModalVisible(false)} gradeId={gradeId} />

      <TouchableWithoutFeedback onPress={(evt) => evt.target == evt.currentTarget && onDismiss()}>
        <View style={styles.overlay}>
          <View style={styles.contentContainer}>

            <TitleLine text={grade.name || "Note virtuelle"} />

            <Line name={"Matière"} value={grade.nameDiscipline} />
            {grade.typeTest && <Line name={"Devoir"} value={grade.typeTest} />}
            {grade.date && <Line name={"date"} value={grade.date} />}

            <Line name={"Coefficient"} value={grade.modifiedCoef?.toString() ?? grade.coef.toString()} />

            <View style={styles.separationLine} />

            <GradeLine name={''} value={denominator} denominator={denominator} isTemplate />
            <GradeLine name={"Note"} value={roundGrade(grade.modifiedValue ?? grade.value)} denominator={denominator} />
            {!!grade.averageClass && <GradeLine name={"Moyenne de classe"} value={grade.averageClass} denominator={denominator} />}
            {!!grade.maxClass && <GradeLine name={"Note maximum"} value={grade.maxClass} denominator={denominator} />}
            {!!grade.minClass && <GradeLine name={"Note minimum"} value={grade.minClass} denominator={denominator} />}

            {indicatorColor && <View style={styles.rankIndicatorContainer}>
              <Text style={styles.lineText}>{text}:</Text>
              <View style={{
                backgroundColor: indicatorColor,
                width: Spaces.small,
                height: Spaces.small,
                borderRadius: BorderRadius.infinite,
                marginLeft: Spaces.small,
              }} />
            </View>}

            <View style={styles.separationLine} />

            <SwitchLine name={"Note significative"} value={grade.significant} onPress={() => {
              dispatch(setSignificant({ gradeId: grade.id, significant: !grade.significant }))
            }} />

            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
              <View style={{ width: modified ? '45%' : '100%' }}>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <View style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>Modifier</Text>
                  </View>
                </TouchableOpacity>
              </View>
              {modified &&
                <View style={{ width: '45%' }}>
                  <TouchableOpacity onPress={() => {
                    if (grade.isOfficial) {
                      dispatch(unModifyGrade({ gradeId, codeDiscipline: grade.codeDiscipline, periodIndex: Number(grade.codePeriod[grade.codePeriod.length - 1]) - 1 }))
                    } else {
                      dispatch(deleteGrade({ gradeId, codeDiscipline: grade.codeDiscipline, periodIndex: Number(grade.codePeriod[grade.codePeriod.length - 1]) - 1 }))
                      setModalVisible(false);
                    }
                  }}>

                    <View style={styles.buttonContainer}>
                      <Text style={styles.buttonText}>{grade.isOfficial ? 'Annuler' : 'Supprimer'}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              }
            </View>

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
  buttonContainer: {
    borderColor: Colors.callToAction,
    borderWidth: 1,
    borderRadius: BorderRadius.medium,
    width: '100%',
    paddingVertical: Spaces.small,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: Spaces.medium,
  },
  buttonText: {
    ...SubTitleText,
    fontSize: FontSize.medium,
    fontWeight: 'bold',
    color: Colors.lightText,
  },
})

export default GradeModal;