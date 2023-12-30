import React from "react"
import { StyleSheet, Text, View } from "react-native"
import { Colors, FontSize, Spaces, SubTitleText } from "../../GlobalStyles"
import { roundGrade } from "../../assets/utils";

const GradeLine: React.FC<{
  name: string,
  value: number,
  denominator?: number,
  isTemplate?: boolean,
  isAverage?: boolean,
}> = ({ name, value, denominator, isTemplate: template = false, isAverage = false }) => {

  if (isNaN(value)) return;

  return (
    <View style={[styles.lineContainer, template && { marginBottom: Spaces.small }]}>
      <Text style={styles.lineText}>{name}{template ? "" : ":"}</Text>
      <View style={styles.lineGradeContainer}>
        {!isAverage && <View style={styles.gradeContainer}>
          {(denominator && denominator !== 20) && <Text style={styles.lineText}>{template ? '/' : ''}{roundGrade((value / denominator) * 20).toString()}</Text>}
        </View>}
        <View style={styles.gradeContainer}>
          {<Text style={styles.lineText}>{template ? '/' : ''}{value.toString()}</Text>}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  lineContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: Spaces.extra_small,
  },
  lineText: {
    ...SubTitleText,
    color: Colors.lightText,
    fontSize: FontSize.small,
  },
  lineGradeContainer: {
    width: '35%',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
  gradeContainer: {
    width: '50%',
    alignContent: "flex-end",
  },
})

export default GradeLine;