import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, Switch, Text, Dimensions} from 'react-native';
import RobotLocalizationScreen from './RobotLocalizationScreen';
import StreamingCameraScreen from './StreamingCameraScreen';
import RosSettingsContext from '../contexts/RosSettingsContext';
import AppThemeContext from '../contexts/AppThemeContext';

const RobotControlScreen = props => {
  const getScreenOrientation = () => {
    return Dimensions.get('screen').width >= Dimensions.get('screen').height
      ? 'landscape'
      : 'portrait';
  };
  const theme = useContext(AppThemeContext);
  const [switchViewIsEnable, setSwitchViewEnable] = useState(false);
  const [screenOrientation, setScreenOrientation] = useState(
    getScreenOrientation(),
  );

  useEffect(() => {
    Dimensions.addEventListener('change', () => {
      setScreenOrientation(getScreenOrientation());
    });
  }, []);

  return (
    <View style={styles.mainViewStyle}>
      <View
        style={
          screenOrientation === 'portrait'
            ? styles.switchMapCameraViewCenterStyle
            : styles.switchMapCameraViewRightStyle
        }>
        {switchViewIsEnable ? (
          <Text style={{color: theme.colors.text}}>Show map</Text>
        ) : (
          <Text style={{color: theme.colors.text}}>Show camera</Text>
        )}
        <Switch
          onValueChange={() => setSwitchViewEnable(!switchViewIsEnable)}
          value={switchViewIsEnable}
          trackColor={{
            false: 'rgba(255, 255, 255, 0.4)',
            true: theme.colors.secondary,
          }}
          style={styles.switchMapCameraStyle}
        />
      </View>
      <View style={{flex: 1}}>
        {switchViewIsEnable ? (
          <RobotLocalizationScreen {...props} />
        ) : (
          <StreamingCameraScreen {...props} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainViewStyle: {
    flex: 1,
  },
  switchMapCameraViewCenterStyle: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    zIndex: 1,
    alignItems: 'center',
  },
  switchMapCameraViewRightStyle: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
    alignItems: 'center',
  },
  switchMapCameraStyle: {
    transform: [{scaleX: 1.25}, {scaleY: 1.25}],
    marginTop: 5,
  },
});

export default RobotControlScreen;
