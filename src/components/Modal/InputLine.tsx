import React from "react"
import { StyleSheet, Text, View, TextInput } from "react-native"
import { BorderRadius, Colors, FontSize, Spaces, SubTitleText } from "../../GlobalStyles"

const InputLine: React.FC<{
  name: string,
  value: string,
  onChange: (text: string) => void,
  numeric?: boolean,
}> = ({ name, value, onChange, numeric = false }) => {
  return (
    <View style={styles.lineContainer}>
      <Text style={styles.lineText}>{name}:</Text>
      <TextInput
        value={value.toString()}
        keyboardType={numeric ? "numeric" : undefined}
        onChangeText={onChange}
        cursorColor={Colors.callToAction}
        selectTextOnFocus
        selectionColor={Colors.transparentCallToAction}
        style={styles.input}
        textAlign="center"
        textAlignVertical="center"
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
  input: {
    backgroundColor: Colors.lightBackground,
    borderRadius: BorderRadius.small,
    paddingVertical: 0,
    paddingHorizontal: Spaces.small,
  }
})

export default InputLine;