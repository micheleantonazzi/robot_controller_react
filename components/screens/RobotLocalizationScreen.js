import React, {useContext, useEffect, useRef, useState} from 'react';
import 'react-native-get-random-values';
import {Dimensions, View} from 'react-native';
import {Strings} from '../definitions/Strings';
import RosSettingsContext from '../contexts/RosSettingsContext';
import ROSLIB from 'roslib';
import Canvas, {ImageData} from 'react-native-canvas';
import resizeImageData from '../algorithms/resizeImageData';
import {useHeaderHeight} from '@react-navigation/stack';

const RobotLocalizationScreen = props => {
  const rosSettingsContext = useContext(RosSettingsContext);
  const [mapListener, setMapListener] = useState(null);
  const [mapMessage, setMapMessage] = useState(null);
  const canvasRef = useRef(null);
  const headerHeight = useHeaderHeight();

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
        setMapMessage(message);
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

  // Rerender canvas
  useEffect(() => {
    const screenWidth =
      Dimensions.get('screen').width * Dimensions.get('screen').scale;
    const screenHeight =
      Dimensions.get('screen').height * Dimensions.get('screen').scale;

    // Canvas must be a square
    const canvasDimension =
      screenWidth > screenHeight
        ? Math.floor(screenHeight)
        : Math.floor(screenWidth);

    canvasRef.current.width = canvasDimension;
    canvasRef.current.height = canvasDimension;
    const context = canvasRef.current.getContext('2d');
    context.clearRect(0, 0, canvasDimension, canvasDimension);
    if (mapMessage !== null) {
      const a = [];
      for (let i = 0; i < mapMessage.info.width * mapMessage.info.height; ++i) {
        const occupancyGridValue = mapMessage.data[i];
        const pixelLuminance =
          occupancyGridValue < 0
            ? 205
            : (255 * (100 - occupancyGridValue)) / 100;
        a.push(pixelLuminance);
        a.push(pixelLuminance);
        a.push(pixelLuminance);
        a.push(255);
      }
      const imgSrc = {
        data: a,
        width: mapMessage.info.width,
        height: mapMessage.info.height,
      };
      const imgDst = resizeImageData(
        imgSrc,
        canvasDimension,
        canvasDimension,
        'nearest-neighbor',
      );
      const imageData = new ImageData(
        canvasRef.current,
        imgDst.data,
        imgDst.width,
        imgDst.height,
      );

      context.putImageData(imageData, 0, 0);
    }
  }, [mapMessage]);

  const getViewUpHeight = () => {
    const screenHeight = Dimensions.get('window').height;
    const screenWidth = Dimensions.get('window').width;

    if (screenHeight <= screenWidth) {
      return screenHeight;
    }

    return (screenHeight - headerHeight - screenWidth) / 2;
  };

  return (
    <View style={{flex: 1}}>
      <View style={{height: getViewUpHeight()}} />
      <Canvas ref={canvasRef} />
    </View>
  );
};

export default RobotLocalizationScreen;
