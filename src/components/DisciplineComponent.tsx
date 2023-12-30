import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';
import { Discipline } from '../assets/constants';
import { BorderRadius, Colors, FontSize, Spaces, SubTitleText } from '../GlobalStyles';
import GradeComponent from './GradeComponent';
import DisciplineModal from './DisciplineModal';

interface Props {
  discipline: Discipline
}

const DisciplineComponent: React.FC<Props> = ({ discipline }) => {

  const averageCalculated = Number.isNaN(discipline.averageCalculated) ? undefined : discipline.averageCalculated;

  const [modalVisible, setModalVisible] = useState(false);


  return (
    <View style={styles.container}>
      <DisciplineModal visible={modalVisible} onDismiss={() => setModalVisible(false)} discipline={discipline} />
      <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>{discipline.nameDiscipline}</Text>
          <Text style={styles.headerText}>{averageCalculated}</Text>
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.gradeContainer}>
        {discipline.gradeIds.map(gradeId => {
          return (
            <GradeComponent key={'grade' + gradeId} gradeId={gradeId} />
          )
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: Spaces.small,
    backgroundColor: Colors.lightBackground,
    borderRadius: BorderRadius.medium,
    paddingHorizontal: Spaces.small,
    paddingVertical: Spaces.small,
    elevation: 5,
  },
  headerContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    paddingVertical: Spaces.extra_small,
  },
  gradeContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  headerText: {
    ...SubTitleText,
    color: Colors.lightText,
    fontSize: FontSize.small,
    fontWeight: 'bold',
  }
})

export default DisciplineComponent;