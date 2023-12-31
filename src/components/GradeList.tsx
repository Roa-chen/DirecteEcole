import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { BorderRadius, Colors, Spaces, SubTitleText } from '../GlobalStyles';
import GradeModal from './GradeModal';
import { Grade, windowHeight, windowWidth } from '../assets/constants';
import { sort, useAppSelector } from '../assets/utils';
// import { ScrollView } from 'react-native-gesture-handler';

interface Props {
  periodIndex: number
}

const ItemSize = windowHeight / 7;

//TODO add sorting feature (by date / by value / by discipline / by average value)

const GradeList: React.FC<Props> = ({ periodIndex }) => {

  const user = useAppSelector(state => state.user)

  const [sortType, setSortType] = useState(0);

  const sortedGrades = (Object.values(user.grades ?? []).filter(grade => grade.codePeriod === `A00${periodIndex + 1}`).sort((a, b) => sort(a, b, sortType))).reverse()
  const [gradeModalId, setGradeModalId] = useState<string | undefined>();

  const scrollY = React.useRef(new Animated.Value(0)).current;


  return (
    <View style={styles.container}>

      <GradeModal visible={gradeModalId !== null} onDismiss={() => setGradeModalId(undefined)} gradeId={gradeModalId} />

      <View style={styles.headerContainer}>
        <Text style={[styles.text, { marginRight: Spaces.extra_small, fontWeight: 'bold' }]}>Trier par :</Text>
        {['date', 'note'].map((value, index) => (
          <TouchableOpacity key={'headerButton-' + index} onPress={() => setSortType(index)}>
            <View style={[styles.headerButton, sortType === index && styles.headerButtonSelected]}>
              <Text style={styles.text}>{value}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <Animated.FlatList
        data={sortedGrades}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}

        contentContainerStyle={{ paddingBottom: Spaces.large * 1.5, }}

        renderItem={({ item: grade, index }) => {

          let indicatorColor = '';

          if (grade.value === grade.maxClass) { indicatorColor = '#06A77D' }
          else if (grade.value >= grade.averageClass) { indicatorColor = '#FDCC21' }
          else if (grade.value <= grade.averageClass) { indicatorColor = '#FB8B24' }

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
              transform: [{ scale }],
              opacity,
            }}>

              <TouchableOpacity key={'grade-' + grade.id} onPress={() => setGradeModalId(grade.id)}>

                <View style={[styles.gradeContainer, !grade.significant && { opacity: .4 }]}>

                  <View style={styles.gradeSubcontainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={styles.textBold}>{grade.nameDiscipline}</Text>
                      <View style={{
                        backgroundColor: indicatorColor,
                        width: Spaces.small,
                        height: Spaces.small,
                        borderRadius: BorderRadius.infinite,
                        marginLeft: Spaces.small,
                      }} />
                    </View>
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
    // paddingTop: Spaces.medium,
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
  headerContainer: {
    flexDirection: 'row',
    width: '100%',
    height: Spaces.large,
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: Spaces.extra_small,
  },
  headerButton: {
    height: '80%',
    marginRight: Spaces.extra_small,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.small,
    backgroundColor: Colors.lightBackground,
    paddingHorizontal: Spaces.small,
  },
  headerButtonSelected: {
    borderWidth: 1,
    borderColor: Colors.callToAction,
  },
})

export default GradeList;