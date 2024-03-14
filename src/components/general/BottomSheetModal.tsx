import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Animated, { Extrapolation, SharedValue, interpolate, interpolateColor, runOnJS, runOnUI, useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import { windowHeight } from '../../assets/constants'
import { BorderRadius, Colors, FontFamily, FontSize, Spaces } from '../../GlobalStyles';

interface BottomSheetModalProps {
  visible: boolean;
  onDismiss: () => void;
  children: React.ReactNode
}

const BottomSheetModal: React.FC<BottomSheetModalProps> = ({ visible, onDismiss, children }) => {

  const top = useSharedValue(windowHeight);

  const open = () => {
    "worklet";
    top.value = withTiming(0, { duration: 300 })
  }

  const close = () => {
    "worklet";
    top.value = withTiming(windowHeight, { duration: 100 }, () => runOnJS(onDismiss)())

  }

  useEffect(() => {
    if (visible) {
      runOnUI(open)();
    }
  }, [visible])

  return (
    <View>
      <Modal
        transparent
        animationType='none'
        visible={visible}
        onRequestClose={() => runOnUI(close)()}
      >
        <ContentContainer top={top} open={open} close={close} >
          {children}
        </ContentContainer>
      </Modal>
    </View>
  )
}

interface ContentContainerProps {
  children: React.ReactNode;
  top: SharedValue<number>;
  open: () => void;
  close: () => void;
}

const ContentContainer: React.FC<ContentContainerProps> = ({ children, top, open, close }) => {

  const [height, setHeight] = useState(1);

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (evt) => {
      top.value = Math.max(evt.translationY, 0)
    },
    onEnd: (evt) => {
      if (evt.translationY > height / 2 || evt.velocityY > 2000) {
        close();
      } else {
        open();
      }
    }
  });

  const animatedStyle = useAnimatedStyle(() => ({
    top: top.value,
  }))

  const animatedOpacity = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(top.value, [0, height], ['#00000080', '#00000000'])
  }))

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PanGestureHandler onGestureEvent={gestureHandler} >
        <Animated.View style={[styles.overlay, animatedOpacity]}>
          <Animated.View style={[styles.container, animatedStyle]}>
            <TouchableWithoutFeedback
              onPress={(evt) => evt.target == evt.currentTarget && close()}
            >
              <View style={{ width: '100%', flex: 1 }} />
            </TouchableWithoutFeedback>
            <View style={styles.contentContainer} onLayout={(evt) => setHeight(evt.nativeEvent.layout.height)}>
              <View style={styles.indicatorContainer}>
                <View style={styles.indicator} />
              </View>
              {children}
            </View>
          </Animated.View>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: '#00000080',
    flex: 1,
    justifyContent: 'flex-end',
    height: 100,
  },
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  contentContainer: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    width: '100%',
    bottom: 0,
    backgroundColor: Colors.background,
    paddingBottom: Spaces.small,
    opacity: 1,
    maxHeight: '90%',
  },
  indicatorContainer: {
    width: '100%',
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightBackground,
  },
  indicator: {
    height: '30%',
    width: '10%',
    borderRadius: BorderRadius.infinite,
    backgroundColor: Colors.lightBackground,
  },
  content: {
    width: '100%',
    alignItems: 'center',
    padding: Spaces.medium,
  },
  text: {
    fontFamily: FontFamily.regular,
    color: Colors.text,
    fontSize: FontSize.small
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.background,
    marginBottom: Spaces.small,
    justifyContent: 'space-between',
    alignItems: 'center',

  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spaces.small,
  },
  headerText: {
    fontSize: FontSize.medium,
    fontWeight: "600",
    fontFamily: "Inter-SemiBold",
    color: Colors.lightText,
    textAlign: "left",
  }
})

export default BottomSheetModal;