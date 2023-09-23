import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { getUser } from '../services/User';
import { Discipline } from '../assets/constants';
import { BorderRadius, Colors, FontSize, Spaces, SubTitleText } from '../GlobalStyles';
import GradeComponent from './GradeComponent';

interface Props {
  discipline: Discipline
}

const DisciplineComponent: React.FC<Props> = ({ discipline }) => {

  const averageCalculated = Number.isNaN(discipline.averageCalculated) ? undefined : discipline.averageCalculated;


  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>{discipline.nameDiscipline}</Text>
        <Text style={styles.headerText}>{averageCalculated}</Text>
      </View>
      <View style={styles.gradeContainer}>
        {discipline.grades.map(grade => {
          return (
            <GradeComponent key={'grade' + grade.id} grade={grade} />
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
    marginBottom: Spaces.extra_small,
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