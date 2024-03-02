import React from 'react'
import { StyleSheet } from 'react-native'


/* fonts */
export const FontFamily = {
  regular: "Inter-Regular",
  black: "Inter-Black",
  interBold: "Inter-Bold",
};
/* font sizes */
export const FontSize = {
  extra_small: 12,
  small: 14,
  medium: 18,
  large: 24,
};
/* Colors */
export const Colors = {
  background: '#1A1821',
  lightBackground: '#2F2B3A',
  transparentBackground: '#1A1821C0',
  callToAction: '#8F6BFF',
  selectionColor: '#8F6BFF55',
  transparentCallToAction: '#8F6BFF80',
  lightText: "#F6F3FD",
  text: '#88858F',
  black: "#000000",
  red: "#FE6B6B",
  color1: "#06A7ED",
  color2: "#06A77D",
  color3: "#FDCC21",
  color4: "#FB8B24",
};

/* Paddings */
export const Spaces = {
  extra_small: 6,
  small: 12,
  medium: 24,
  large: 32,
};
/* border radiuses */
export const BorderRadius = {
  small: 6,
  medium: 18,
  infinite: 10000,
};


const styles = StyleSheet.create({
  TitleText: {
    color: '#F6F3FD',
    fontSize: FontSize.large,
    fontFamily: FontFamily.interBold,
    fontWeight: 'bold',
  },
  SubTitleText: {
    color: Colors.lightText,
    fontSize: FontSize.small,
    // lineHeight: 26,
    fontFamily: FontFamily.regular,
  },
  AnotationText: {

  }
})

export const SubTitleText = styles.SubTitleText
export const TitleText = styles.TitleText