import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { BorderRadius, Colors, FontSize, Spaces, SubTitleText } from '../GlobalStyles';
import GradeModal from './GradeModal';
import { useAppSelector } from '../assets/utils';

interface Props {
  gradeId: string,
}

const GradeComponent: React.FC<Props> = ({ gradeId }) => {

  const [modalVisible, setModalVisible] = useState(false);

  const { grades, unofficialGrades } = useAppSelector(state => state.user);
  const grade = (grades?.[gradeId]) ?? (unofficialGrades?.[gradeId]);
  if (!grade) return;

  const coef = grade.modifiedCoef??grade.coef;
  const denominator = grade.modifiedDenominator??grade.denominator;
  const hasValue = !Number.isNaN(grade.value) && denominator !== 20;
  const displayGrade = grade.modifiedValue??(hasValue ? grade.value : grade.codeValue);
  const modified = grade.modifiedCoef || grade.modifiedDenominator || grade.modifiedValue || !grade.isOfficial;


  let indicatorColor = '';

  if (grade.value === grade.maxClass) { indicatorColor = Colors.color1 }
  else if (grade.value >= grade.averageClass) { indicatorColor = Colors.color2 }
  else if (grade.value <= grade.averageClass) { indicatorColor = Colors.color3 }
  //TODO add color to unofficial grade

  return (
    <View style={[styles.container, grade.isNew && styles.newGrade]}>
      <GradeModal visible={modalVisible} onDismiss={() => setModalVisible(false)} gradeId={grade.id} />
      <View style={[styles.indicator, { backgroundColor: indicatorColor }]} />
      <TouchableOpacity onPress={() =>
        setModalVisible(true)
      }>
        <View style={styles.gradeContainer}>
          {modified && <Text style={styles.valueText}>{grade.isOfficial ? '[':'('}</Text>}
          <Text style={[styles.valueText, !grade.significant && { opacity: .6 }]}>{displayGrade}</Text>
          <View style={styles.extraContainer}>
            {(coef !== 1 || denominator !== 20) && <Text style={[styles.coefText, !grade.significant && { opacity: .6 }]}>{coef !== 1 ? `(${coef})` : ' '}</Text>}
            {hasValue && <Text style={[styles.denominatorText, !grade.significant && { opacity: .6 }]}>/ {denominator}</Text>}
          </View>
          {modified && <Text style={styles.valueText}>{grade.isOfficial?']':')'}</Text>}
        </View>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: Spaces.extra_small,
  },
  newGrade: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.callToAction,
    borderRadius: BorderRadius.small,
  },
  gradeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  valueText: {
    ...SubTitleText,
    fontSize: FontSize.medium,
    color: Colors.lightText,
  },
  denominatorText: {
    ...SubTitleText,
    fontSize: FontSize.extra_small * 3 / 4,
    color: Colors.lightText,
    textAlignVertical: 'bottom',
  },
  coefText: {
    ...SubTitleText,
    fontSize: FontSize.extra_small * 3 / 4,
    color: Colors.lightText,
    textAlignVertical: 'top',
  },
  extraContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginLeft: Spaces.extra_small / 2,
    alignSelf: 'flex-start',
  },
  indicator: {
    height: FontSize.medium,
    width: 4,
    alignSelf: 'center',
    borderRadius: BorderRadius.infinite,
    marginRight: Spaces.extra_small / 2,
  },
})

export default GradeComponent;