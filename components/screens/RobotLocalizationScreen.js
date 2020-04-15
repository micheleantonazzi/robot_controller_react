import React, {useContext, useEffect, useState} from 'react';
import {Button, Text, View} from 'react-native';
import {Strings} from '../definitions/Strings';
import RosSettingsContext from '../contexts/RosSettingsContext';
import ROSLIB from 'roslib';
import Canvas from 'react-native-canvas';

const RobotLocalizationScreen = props => {
  const rosSettingsContext = useContext(RosSettingsContext);
  const [mapListener, setMapListener] = useState(null);

  // Create new map Listener
  const createMapListener = () => {
    console.log('createMapListener');
    if (rosSettingsContext.rosSettings.ros_connector !== null) {

      if (mapListener !== null) {
        mapListener.unsubscribe();
      }

      const newMapListener = new ROSLIB.Topic({
        ros: rosSettingsContext.rosSettings.ros_connector,
        name: '/map',
        messageType: 'nav_msgs/OccupancyGrid',
      });

      newMapListener.subscribe(function(message) {
        console.log('messag');
      });

      setMapListener(newMapListener);
    }
  };

  // At first render, check if it is connected otherwise open RosConnectionScreen
  useEffect(() => {
    if (!rosSettingsContext.rosSettings.is_connected) {
      props.navigation.navigate(Strings.rosConnectionScreen);
    }
  }, []);

  // Create a new mapListener only if the ros_connector changes
  useEffect(() => {
    createMapListener();
  }, [rosSettingsContext.rosSettings.ros_connector]);

  const handleCanvas = (canvas) => {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'purple';
    ctx.fillRect(0, 0, 100, 100);
  };

  return (
    <View style={{flex:1}}>
    <Canvas ref={handleCanvas}/>

    </View>
  );
};

export default RobotLocalizationScreen;
