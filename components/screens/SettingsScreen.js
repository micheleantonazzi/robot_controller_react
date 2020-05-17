import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Button,
  AsyncStorage,
} from 'react-native';
import AppThemeContext from '../contexts/AppThemeContext';
import TextInputStyled from '../styledComponets/TextInputStyled';
import RosSettingsContext from '../contexts/RosSettingsContext';
import ButtonStyled from '../styledComponets/ButtonStyled';
import {Strings} from '../definitions/Strings';
import SimpleToast from 'react-native-simple-toast';
import ROSLIB from 'roslib';

const SettingsScreen = props => {
  const theme = useContext(AppThemeContext);
  const rosSettingsContext = useContext(RosSettingsContext);

  const [mapTopicValue, setMapTopicValue] = useState(
    rosSettingsContext.rosSettings.map_topic,
  );
  const [poseTopicValue, setPoseTopicValue] = useState(
    rosSettingsContext.rosSettings.pose_topic,
  );
  const [cameraUrlValue, setCameraUrlValue] = useState(
    rosSettingsContext.rosSettings.camera_url,
  );
  const [controlTopicValue, setControlTopicValue] = useState(
    rosSettingsContext.rosSettings.control_topic,
  );

  const saveSettings = () => {
    AsyncStorage.multiSet([
      [Strings.mapTopicKey, JSON.stringify(mapTopicValue)],
      [Strings.poseTopicKey, JSON.stringify(poseTopicValue)],
      [Strings.cameraUrlKey, JSON.stringify(cameraUrlValue)],
      [Strings.controlTopicKey, JSON.stringify(controlTopicValue)],
    ])
      .catch(e => console.log(e))
      .done();

    if (rosSettingsContext.rosSettings.map_listener !== null) {
      rosSettingsContext.rosSettings.map_listener.unsubscribe();
    }

    if (rosSettingsContext.rosSettings.pose_listener !== null) {
      rosSettingsContext.rosSettings.pose_listener.unsubscribe();
    }

    if (rosSettingsContext.rosSettings.camera_info_listener !== null) {
      rosSettingsContext.rosSettings.camera_info_listener.unsubscribe();
    }

    // Create map listener
    const newMapListener = new ROSLIB.Topic({
      ros: rosSettingsContext.rosSettings.ros_connector,
      name: mapTopicValue,
      messageType: 'nav_msgs/OccupancyGrid',
    });

    // Create pose listener
    const newPoseListener = new ROSLIB.Topic({
      ros: rosSettingsContext.rosSettings.ros_connector,
      name: poseTopicValue,
      messageType: 'geometry_msgs/PoseWithCovarianceStamped',
    });

    // Create camera info listener
    const newCameraInfoListener = new ROSLIB.Topic({
      ros: rosSettingsContext.rosSettings.ros_connector,
      name: '/usb_cam/camera_info',
      messageType: 'sensor_msgs/CameraInfo',
    });

    // Create cmd_vel publisher
    const newCmdVelPublisher = new ROSLIB.Topic({
      ros: rosSettingsContext.rosSettings.ros_connector,
      name: controlTopicValue,
      messageType: 'geometry_msgs/Twist',
    });

    rosSettingsContext.changeProperty([
      {name: 'map_listener', value: newMapListener},
      {name: 'pose_listener', value: newPoseListener},
      {name: 'camera_info_listener', value: newCameraInfoListener},
      {name: 'cmd_vel_publisher', value: newCmdVelPublisher},
      {name: 'map_topic', value: mapTopicValue},
      {name: 'pose_topic', value: poseTopicValue},
      {name: 'camera_url', value: cameraUrlValue},
      {name: 'control_topic', value: controlTopicValue},
    ]);

    SimpleToast.show('Saved new settings');
  };

  const resetSettings = () => {
    setMapTopicValue(rosSettingsContext.rosSettings.map_topic);
    setPoseTopicValue(rosSettingsContext.rosSettings.pose_topic);
    setCameraUrlValue(rosSettingsContext.rosSettings.camera_url);
    setControlTopicValue(rosSettingsContext.rosSettings.control_topic);

    SimpleToast.show('New settings discarded');
  };

  return (
    <View style={styles.mainViewStyle}>
      <ScrollView>
        <Text style={{color: theme.colors.textDark, ...styles.textStyle}}>
          Map topic
        </Text>
        <TextInputStyled
          style={{fontSize: 17, ...styles.textInputStyle}}
          value={mapTopicValue}
          onChangeText={text => setMapTopicValue(text)}
          autoCapitalize={'none'}
        />

        <Text style={{color: theme.colors.textDark, ...styles.textStyle}}>
          Pose topic
        </Text>
        <TextInputStyled
          style={{fontSize: 17, ...styles.textInputStyle}}
          value={poseTopicValue}
          onChangeText={text => setPoseTopicValue(text)}
          autoCapitalize={'none'}
        />

        <Text style={{color: theme.colors.textDark, ...styles.textStyle}}>
          Camera streaming URL
        </Text>
        <TextInputStyled
          style={{fontSize: 17, ...styles.textInputStyle}}
          value={cameraUrlValue}
          onChangeText={text => setCameraUrlValue(text)}
          autoCapitalize={'none'}
        />

        <Text style={{color: theme.colors.textDark, ...styles.textStyle}}>
          Control topic
        </Text>
        <TextInputStyled
          style={{fontSize: 17, ...styles.textInputStyle}}
          value={controlTopicValue}
          onChangeText={text => setControlTopicValue(text)}
          autoCapitalize={'none'}
        />
        <View style={styles.buttonBoxStyle}>
          <View style={{marginRight: 15}}>
            <Button
              title={'Reset'}
              onPress={() => {
                resetSettings();
              }}
              color={theme.colors.gyroscopeDisabled}
            />
          </View>
          <ButtonStyled
            title={'Save'}
            onPress={() => {
              saveSettings();
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainViewStyle: {
    margin: 20,
  },
  textStyle: {
    fontSize: 17,
  },
  textInputStyle: {
    marginBottom: 25,
  },
  buttonBoxStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default SettingsScreen;
