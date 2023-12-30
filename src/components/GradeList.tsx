import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity, Animated } from 'react-native';
import { BorderRadius, Colors, Spaces, SubTitleText } from '../GlobalStyles';
import GradeModal from './GradeModal';
import { Grade, windowHeight, windowWidth } from '../assets/constants';
import { useAppSelector } from '../assets/utils';

interface Props {
  periodIndex: number
}

const ItemSize = windowHeight / 7;

const GradeList: React.FC<Props> = ({ periodIndex }) => {

  const user = useAppSelector(state => state.user)

  const sortedGrades = (Object.values(user.grades ?? []).filter(grade => grade.codePeriod === `A00${periodIndex + 1}`).sort((a, b) => Date.parse(a.displayDate) - Date.parse(b.displayDate))).reverse()
  const [gradeModalId, setGradeModalId] = useState<string | undefined>();

  const scrollY = React.useRef(new Animated.Value(0)).current;



  return (
    <View style={styles.container}>

      <GradeModal visible={gradeModalId !== null} onDismiss={() => setGradeModalId(undefined)} gradeId={gradeModalId} />

      <Animated.FlatList
        data={sortedGrades}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: true}
        )}

        renderItem={({ item: grade, index }) => {

          const inputRange = [
            -1,
            0,
            (ItemSize + Spaces.small) * index,
            (ItemSize + Spaces.small) * (index + 2),
          ];

          const scale = scrollY.interpolate({
            inputRange,
            outputRange: [1, 1, 1, 0]
          })

          const opacity = scrollY.interpolate({
            inputRange,
            outputRange: [1, 1, .8, 0]
          })

          return (
            <Animated.View style={{
              transform: [{scale}],
              opacity,
            }}>

              <TouchableOpacity key={'grade-' + grade.id} onPress={() => setGradeModalId(grade.id)}>

                <View style={[styles.gradeContainer, !grade.significant && { opacity: .4 }]}>

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
            </Animated.View>
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
    height: ItemSize,
    marginBottom: Spaces.small,
    backgroundColor: Colors.lightBackground,
    borderRadius: BorderRadius.medium,
    paddingHorizontal: Spaces.small,
    paddingVertical: Spaces.small,
    // elevation: 5,
    justifyContent: "space-around",
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