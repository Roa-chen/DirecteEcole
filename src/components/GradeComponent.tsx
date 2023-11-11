import React, {useState} from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Grade } from '../assets/constants';
import { Colors, FontSize, Spaces, SubTitleText } from '../GlobalStyles';
import GradeModal from './GradeModal';

interface Props {
  grade: Grade,
}

const GradeComponent: React.FC<Props> = ({ grade }) => {

  const [modalVisible, setModalVisible] = useState(false);

  const coef = grade.coef;
  const hasValue = !Number.isNaN(grade.value) && grade.denominator !== 20;
  const displayGrade = hasValue ? grade.value : grade.codeValue;

  return (
    <View>
      <GradeModal visible={modalVisible} onDismiss={() => setModalVisible(false)} grade={grade} />
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View style={styles.container}>
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
    alignItems: 'flex-end',
    padding: Spaces.extra_small,
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
})

export default GradeComponent;