import React, {useState} from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Grade } from '../assets/constants';
import { BorderRadius, Colors, FontSize, Spaces, SubTitleText } from '../GlobalStyles';
import GradeModal from './GradeModal';

interface Props {
  grade: Grade,
}

const GradeComponent: React.FC<Props> = ({ grade }) => {

  const [modalVisible, setModalVisible] = useState(false);

  const coef = grade.coef;
  const hasValue = !Number.isNaN(grade.value) && grade.denominator !== 20;
  const displayGrade = hasValue ? grade.value : grade.codeValue;
  const isNew = Date.now() - Date.parse(grade.displayDate) < 172800000;

  let indicatorColor = '';

  if (grade.value === grade.maxClass) {indicatorColor = '#06A77D'}
  else if (grade.value >= grade.averageClass) {indicatorColor = '#FDCC21'}
  else if (grade.value <= grade.averageClass) {indicatorColor = '#FB8B24'}

  return (
    <View style={[styles.container, isNew && styles.newGrade]}>
      <GradeModal visible={modalVisible} onDismiss={() => setModalVisible(false)} grade={grade} />
      <View style={[styles.indicator, {backgroundColor: indicatorColor}]} />
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View style={styles.gradeContainer}>
          <Text style={[styles.valueText, !grade.significant && {opacity: .6}]}>{displayGrade}</Text>
          <View style={styles.extraContainer}>
            {(coef !== 1 || true) && <Text style={[styles.coefText, !grade.significant && {opacity: .6}]}>{coef !== 1 ? `(${coef})` : ' '}</Text>}
            {hasValue && <Text style={[styles.denominatorText, !grade.significant && {opacity: .6}]}>/ {grade.denominator}</Text>}
          </View>
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