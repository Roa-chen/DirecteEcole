import React, { } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { BorderRadius, Colors, Spaces, SubTitleText } from '../GlobalStyles';
import { getUser } from '../services/User';

interface Props {

}

const GradeList: React.FC<Props> = ({ }) => {

  const user = getUser()

  const grades = Object.values(user.getGrades()).sort((a, b) => Date.parse(a.displayDate) - Date.parse(b.displayDate))


  return (
    <View style={styles.container}>

      <FlatList
        data={grades.reverse()}
        showsVerticalScrollIndicator={false}



        renderItem={({ item: grade }) => {
          return (
            <View style={styles.gradeContainer}>
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
                <View style={{alignItems: 'flex-end'}}>
                  <Text style={styles.text}>({grade.coef})</Text>
                  <Text style={styles.text}>+0.85</Text>
                  <Text style={styles.text}>+0.12</Text>

                </View>
              </View>
            </View>
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