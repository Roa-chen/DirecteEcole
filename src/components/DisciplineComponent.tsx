import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { Discipline } from '../assets/constants';
import { BorderRadius, Colors, FontSize, Spaces, SubTitleText } from '../GlobalStyles';
import GradeComponent from './GradeComponent';
import DisciplineModal from './DisciplineModal';
import { useAppDispatch, useAppSelector } from '../assets/utils';
import { Svg, SvgXml } from 'react-native-svg';
import AddGradeModal from './AddGradeModal';

interface Props {
  discipline: Discipline,
  periodIndex: number,
}

const DisciplineComponent: React.FC<Props> = ({ discipline, periodIndex }) => {

  const averageCalculated = Number.isNaN(discipline.averageCalculated) ? undefined : discipline.averageCalculated;

  const [modalVisible, setModalVisible] = useState(false);


  return (
    <View style={styles.container}>
      <DisciplineModal visible={modalVisible} onDismiss={() => setModalVisible(false)} discipline={discipline} />
      <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
        <View style={styles.headerContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.headerText}>{discipline.nameDiscipline}</Text>
            <AddGradeButton discipline={discipline} periodIndex={periodIndex} />
          </View>
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

const AddGradeButton: React.FC<{ discipline: Discipline, periodIndex: number }> = ({ discipline, periodIndex }) => {

  const xml = `
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g id="Add 1">
  <g id="add-1--expand-cross-buttons-button-more-remove-plus-add-+-mathematics-math">
  <path id="Vector" d="M11.5 2.85718V19.8572" stroke="#8F6BFF" stroke-width="1.71429" stroke-linecap="round" stroke-linejoin="round"/>
  <path id="Vector_2" d="M3 11.3049H20" stroke="#8F6BFF" stroke-width="1.71429" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  </g>
  </svg>
`;

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View>
      <AddGradeModal visible={modalVisible} onDismiss={() => setModalVisible(false)} discipline={discipline} periodIndex={periodIndex} />
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View style={styles.buttonContainer}>
          <View style={{
            paddingHorizontal: Spaces.extra_small,
            paddingVertical: Spaces.extra_small,
            backgroundColor: Colors.lightBackground,
            borderRadius: BorderRadius.infinite,
            elevation: 10,
          }}>
            <SvgXml xml={xml} width={Spaces.small} height={Spaces.small} />
          </View>
        </View>
      </TouchableOpacity>
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
    alignItems: 'center',
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
  },
  buttonContainer: {
    paddingHorizontal: Spaces.small,
  },
})

export default DisciplineComponent;