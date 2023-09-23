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

  const hasValue = !Number.isNaN(grade.value)
  const displayGrade = hasValue ? grade.value : grade.codeValue;

  return (
    <View>
      <GradeModal visible={modalVisible} onDismiss={() => setModalVisible(false)} grade={grade} />
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View style={styles.container}>
          <Text style={[styles.valueText, !grade.significant && {opacity: .6}]}>{displayGrade}</Text>
          {hasValue && <Text style={[styles.denominatorText, !grade.significant && {opacity: .6}]}>/ {grade.denominator}</Text>}
        </View>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: Spaces.extra_small
  },
  valueText: {
    ...SubTitleText,
    fontSize: FontSize.medium,
    color: Colors.lightText,
  },
  denominatorText: {
    ...SubTitleText,
    fontSize: FontSize.extra_small,
    color: Colors.lightText,
    textAlignVertical: 'bottom',
  }
})

export default GradeComponent;