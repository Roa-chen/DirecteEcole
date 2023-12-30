import React from 'react';
import { View, StyleSheet, Modal as NativeModal, TouchableWithoutFeedback } from 'react-native';
import { BorderRadius, Colors, Spaces } from '../../GlobalStyles';

interface Props {
  visible: boolean,
  onDismiss: () => void,
  children: React.ReactNode,
}

const Modal: React.FC<Props> = ({ children, visible, onDismiss }) => {


  return (
    <NativeModal
      visible={visible}
      onDismiss={onDismiss}
      transparent={true}
      animationType='fade'
    >
      <TouchableWithoutFeedback onPress={(evt) => evt.target == evt.currentTarget && onDismiss()}>
        <View style={styles.overlay}>
          <View style={styles.contentContainer}>
            {children}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </NativeModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    borderRadius: BorderRadius.medium,
    width: '80%',
    minHeight: '60%',
    backgroundColor: Colors.background,
    padding: Spaces.medium,
    alignItems: 'center',
  },
})

export default Modal;