import React from "react"
import { StyleSheet, Switch, Text, View } from "react-native"
import { Colors, FontSize, Spaces, SubTitleText } from "../../GlobalStyles"

const SwitchLine: React.FC<{
  name: string,
  value: boolean,
  onPress: () => void,
}> = ({ name, value, onPress }) => {
  return (
    <View style={styles.lineContainer}>
      <Text style={styles.lineText}>{name}:</Text>
      <Switch
        value={value}
        thumbColor={Colors.callToAction}
        trackColor={{
          true: Colors.transparentCallToAction
        }}
        onTouchEnd={onPress}
      />
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
})

export default SwitchLine;