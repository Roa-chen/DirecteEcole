import React from "react"
import { StyleSheet, Text, View } from "react-native"
import { Colors, FontSize, Spaces, SubTitleText } from "../../GlobalStyles"



const TitleLine: React.FC<{
  text: string,
}> = ({ text }) => {
  return (
    <Text style={{
      ...SubTitleText,
      color: Colors.lightText,
      fontSize: FontSize.medium,
      fontWeight: 'bold',
      marginBottom: Spaces.medium,
    }}>{text}:</Text>
  )
}


export default TitleLine;