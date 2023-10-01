import React from 'react';
import { View, StyleSheet, Modal, TouchableWithoutFeedback, Text, Button, Switch, ScrollView, } from 'react-native';
import { BorderRadius, Colors, FontFamily, FontSize, Spaces, SubTitleText } from '../GlobalStyles';
import { roundGrade } from '../assets/utils';
import { getUser } from '../services/User';
import LinearGradient from 'react-native-linear-gradient';

interface Props {
  visible: boolean,
  onDismiss: () => void,
  // grade: Grade,
}

const ProfileModal: React.FC<Props> = ({ visible, onDismiss }) => {
  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      transparent={true}
      animationType='slide'
    >
      <LinearGradient style={styles.overlay} colors={[Colors.background, 'transparent']} start={{x: 0, y: .8}} end={{x: 0, y: 0}} >
        <TouchableWithoutFeedback onPress={(evt) => { evt.target == evt.currentTarget && onDismiss() }}>
          <View style={{ flex: 1, width: '100%' }} />
        </TouchableWithoutFeedback>

        <View style={{
        width: '35%',
        height: 5,
        backgroundColor: Colors.lightBackground,
        marginBottom: Spaces.extra_small,
        borderRadius: BorderRadius.infinite,
        
      }} />

        <View style={styles.contentContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>

          </ScrollView>
        </View>
      </LinearGradient>
    </Modal>
  );
}

const Line: React.FC<{
  name: string,
  value: string
}> = ({ name, value }) => {
  return (
    <View style={styles.lineContainer}>
      <Text style={styles.lineText}>{name}:</Text>
      <Text style={styles.lineText}>{value}</Text>
    </View>
  )
}

const LineSwitch: React.FC<{
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

const LineGrade: React.FC<{
  name: string,
  value: number,
  denominator: number,
  template?: boolean,
}> = ({ name, value, denominator, template = false }) => {
  return (
    <View style={[styles.lineContainer, template && { marginBottom: Spaces.small }]}>
      <Text style={styles.lineText}>{name}{template ? "" : ":"}</Text>
      <View style={styles.lineGradeContainer}>
        <View style={styles.gradeContainer}>
          {<Text style={styles.lineText}>{template ? '/' : ''}{value.toString()}</Text>}
        </View>
        <View style={styles.gradeContainer}>
          {denominator !== 20 && <Text style={styles.lineText}>{template ? '/' : ''}{roundGrade((value / denominator) * 20).toString()}</Text>}
        </View>
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    // marginTop: 20,
  },
  contentContainer: {
    elevation: 20,
    borderTopLeftRadius: BorderRadius.medium,
    borderTopRightRadius: BorderRadius.medium,
    width: '100%',
    minHeight: '60%',
    backgroundColor: Colors.background,
    padding: Spaces.medium,
    alignItems: 'center',
  },
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
    fontWeight: 'bold',
  },
  separationLine: {
    height: 1,
    width: '100%',
    backgroundColor: Colors.lightBackground,
    marginVertical: Spaces.small,
  },
  titleText: {
    ...SubTitleText,
    color: Colors.lightText,
    fontSize: FontSize.medium,
    fontWeight: 'bold',
    marginBottom: Spaces.medium,
  },
  lineGradeContainer: {
    width: '35%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gradeContainer: {
    width: '50%',
    alignContent: "flex-end",
  },
})

export default ProfileModal;