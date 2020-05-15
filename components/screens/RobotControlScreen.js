import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Switch,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import RobotLocalizationScreen from './RobotLocalizationScreen';
import StreamingCameraScreen from './StreamingCameraScreen';
import AppThemeContext from '../contexts/AppThemeContext';
import RNGamePad from 'react-native-game-pad';
import ROSLIB from 'roslib';
import RosSettingsContext from '../contexts/RosSettingsContext';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowsAltH} from '@fortawesome/free-solid-svg-icons';
import {
  setUpdateIntervalForType,
  SensorTypes,
  absoluterotationvector,
} from 'react-native-sensors';

setUpdateIntervalForType(SensorTypes.absoluterotationvector, 100);

const RobotControlScreen = props => {
  const rosSettingsContext = useContext(RosSettingsContext);
  const getScreenOrientation = () => {
    return Dimensions.get('screen').width >= Dimensions.get('screen').height
      ? 'landscape'
      : 'portrait';
  };
  const theme = useContext(AppThemeContext);
  const [robotMovement, setRobotMovement] = useState({linear: 0, angular: 0});
  const [switchViewIsEnable, setSwitchViewEnable] = useState(false);
  const [switchGyroscopeIsEnable, setSwitchGyroscopeEnable] = useState(false);
  const [screenOrientation, setScreenOrientation] = useState(
    getScreenOrientation(),
  );
  const [rotationVectorEnabled, setRotationVectorEnabled] = useState(false);
  const [rotationVectorValue, setRotationVectorValue] = useState(0);
  const [rotationVectorHandle, setRotationVectorHandle] = useState(null);

  useEffect(() => {
    Dimensions.addEventListener('change', () => {
      setScreenOrientation(getScreenOrientation());
    });
  }, []);

  // Send cmd_vel command only if the joysticks or gyroscope change values
  useEffect(() => {
    if (rosSettingsContext.rosSettings.cmd_vel_publisher !== null) {
      let twist = new ROSLIB.Message({
        linear: {
          x: robotMovement.linear,
          y: 0.0,
          z: 0,
        },
        angular: {
          x: 0.0,
          y: 0.0,
          z: robotMovement.angular,
        },
      });
      rosSettingsContext.rosSettings.cmd_vel_publisher.publish(twist);
    }
  }, [robotMovement, rosSettingsContext.rosSettings.cmd_vel_publisher]);

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
      <View
        style={
          screenOrientation === 'portrait'
            ? styles.switchGyroscopeViewPortraitStyle
            : styles.switchGyroscopeViewLandscapeStyle
        }>
        {!switchGyroscopeIsEnable ? (
          <Text style={{color: theme.colors.text}}>Gyroscope OFF</Text>
        ) : (
          <Text style={{color: theme.colors.text}}>Gyroscope ON</Text>
        )}
        <Switch
          onValueChange={() =>
            setSwitchGyroscopeEnable(!switchGyroscopeIsEnable)
          }
          value={switchGyroscopeIsEnable}
          trackColor={{
            false: 'rgba(255, 255, 255, 0.4)',
            true: theme.colors.secondary,
          }}
          style={styles.switchMapCameraStyle}
        />
      </View>
      <View style={{flex: 4}}>
        {switchViewIsEnable ? (
          <RobotLocalizationScreen {...props} />
        ) : (
          <StreamingCameraScreen {...props} isControlScreen={true} />
        )}
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: 175,
          width: 150,
        }}>
        <RNGamePad
          onLeftEnd={() => {
            setRobotMovement({linear: 0, angular: robotMovement.angular});
          }}
          onLeftMove={(evt, data) => {
            if (data.direction) {
              const value = data.distance / 200;
              setRobotMovement({
                linear: data.direction.angle === 'down' ? value * -1 : value,
                angular: robotMovement.angular,
              });
            }
          }}
          options={{
            size: 100,
            color: 'red',
            lockY: true,
          }}
          joystickType={'single-joystick'}
          backgroundColor={theme.colors.background}
        />
      </View>
      {!switchGyroscopeIsEnable ? (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            height: 175,
            width: 150,
          }}>
          <RNGamePad
            onLeftEnd={() => {
              setRobotMovement({linear: robotMovement.linear, angular: 0});
            }}
            onLeftMove={(evt, data) => {
              if (data.direction) {
                const value = data.distance / 125;
                setRobotMovement({
                  linear: robotMovement.linear,
                  angular:
                    data.direction.angle === 'right' ? value * -1 : value,
                });
              }
            }}
            options={{
              size: 100,
              color: 'red',
              lockX: true,
            }}
            joystickType={'single-joystick'}
            backgroundColor={theme.colors.background}
          />
        </View>
      ) : (
        <View
          style={{
            position: 'absolute',
            bottom: 39,
            right: 30,
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: theme.colors.text,
              marginBottom: 15,
              fontSize: 25,
            }}>
            {rotationVectorValue}%
          </Text>
          <View
            style={{
              borderRadius: 50,
              padding: 15,
              backgroundColor: rotationVectorEnabled
                ? theme.colors.secondary
                : theme.colors.gyroscopeDisabled,
            }}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPressIn={() => {
                setRotationVectorEnabled(true);
                const rotationVectorSubscription = absoluterotationvector.subscribe(
                  ({x, y, z, timestamp}) => {
                    let newZ = z;
                    if (z < -Math.PI / 2) {
                      newZ = -Math.PI / 2;
                    } else if (z > Math.PI / 2) {
                      newZ = Math.PI / 2;
                    }
                    let value = Math.round((newZ * 180) / Math.PI);
                    setRotationVectorValue(value);
                    setRobotMovement({
                      linear: robotMovement.linear,
                      angular: newZ * -1,
                    });
                  },
                );
                setRotationVectorHandle(rotationVectorSubscription);
              }}
              onPressOut={() => {
                setRotationVectorEnabled(false);
                if (rotationVectorHandle !== null) {
                  rotationVectorHandle.unsubscribe();
                }
                setRotationVectorValue(0);
                setRobotMovement({
                  linear: robotMovement.linear,
                  angular: 0,
                });
              }}>
              <FontAwesomeIcon
                icon={faArrowsAltH}
                size={45}
                color={theme.colors.text}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
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
    alignSelf: 'center',
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
  switchGyroscopeViewPortraitStyle: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    zIndex: 1,
    alignItems: 'center',
  },
  switchGyroscopeViewLandscapeStyle: {
    position: 'absolute',
    bottom: 160,
    left: 20,
    zIndex: 1,
    alignItems: 'center',
  },
  switchMapCameraStyle: {
    transform: [{scaleX: 1.25}, {scaleY: 1.25}],
    marginTop: 5,
  },
});

export default RobotControlScreen;
