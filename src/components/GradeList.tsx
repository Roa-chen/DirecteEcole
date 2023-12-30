import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native';
import { BorderRadius, Colors, Spaces, SubTitleText } from '../GlobalStyles';
import GradeModal from './GradeModal';
import { Grade } from '../assets/constants';
import { useAppSelector } from '../assets/utils';

interface Props {
  periodIndex: number
}

const GradeList: React.FC<Props> = ({ periodIndex }) => {

  const user = useAppSelector(state => state.user)

  const sortedGrades = (Object.values(user.grades??[]).filter(grade => grade.codePeriod === `A00${periodIndex + 1}`).sort((a, b) => Date.parse(a.displayDate) - Date.parse(b.displayDate))).reverse()

  const [gradeModalVisible, setGradeModalVisible] = useState<Grade | undefined>();


  return (
    <View style={styles.container}>

      <GradeModal visible={gradeModalVisible !== null} onDismiss={() => setGradeModalVisible(undefined)} grade={gradeModalVisible} />

      <FlatList
        data={sortedGrades}
        showsVerticalScrollIndicator={false}



        renderItem={({ item: grade, index }) => {

          return (
            <TouchableOpacity onPress={() => setGradeModalVisible(grade)}>

              <View style={[styles.gradeContainer, !grade.significant && {opacity: .4}]}>

                <View style={styles.gradeSubcontainer}>
                  <Text style={styles.textBold}>{grade.nameDiscipline}</Text>
                  <Text style={styles.textBold}>{grade.value}/{grade.denominator}</Text>
                </View>


                <View style={styles.gradeSubcontainer}>
                  <View>
                    <Text style={styles.text}>maximum: {grade.maxClass}</Text>
                    <Text style={styles.text}>minimum: {grade.minClass}</Text>
                    <Text style={styles.text}>moyenne: {grade.averageClass}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.text}>({grade.coef})</Text>
                    {/* <Text style={styles.text}>+0.85</Text>
                    <Text style={styles.text}>+0.12</Text> //TODO */}

                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )
        }}
      />

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    paddingTop: Spaces.medium,
    paddingHorizontal: Spaces.small,
  },
  gradeContainer: {
    width: '100%',
    marginBottom: Spaces.small,
    backgroundColor: Colors.lightBackground,
    borderRadius: BorderRadius.medium,
    paddingHorizontal: Spaces.small,
    paddingVertical: Spaces.small,
    elevation: 5,
  },
  gradeSubcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',

  },
  textBold: {
    ...SubTitleText,
    fontWeight: 'bold',
  },
  text: {
    ...SubTitleText,

  },

})

export default GradeList;