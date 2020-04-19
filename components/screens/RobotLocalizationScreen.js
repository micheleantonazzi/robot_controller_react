import React, {useContext, useEffect, useRef, useState} from 'react';
import 'react-native-get-random-values';
import {Dimensions, View} from 'react-native';
import {Strings} from '../definitions/Strings';
import RosSettingsContext from '../contexts/RosSettingsContext';
import ROSLIB from 'roslib';
import Canvas, {ImageData, Image as CanvasImage} from 'react-native-canvas';
import {useHeaderHeight} from '@react-navigation/stack';

const RobotLocalizationScreen = props => {
  const rosSettingsContext = useContext(RosSettingsContext);
  const [mapListener, setMapListener] = useState(null);
  const [mapMessage, setMapMessage] = useState(null);
  const [mapImageSource, setMapImageSource] = useState(null);
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

  // Get the canvas dimensions based on the screen size
  const getCanvasDimensions = () => {
    const screenWidth =
      Dimensions.get('screen').width * Dimensions.get('screen').scale;
    const screenHeight =
      Dimensions.get('screen').height * Dimensions.get('screen').scale;

    // Canvas must be a square
    const canvasDimension =
      screenWidth > screenHeight
        ? Math.floor(screenHeight)
        : Math.floor(screenWidth);

    return canvasDimension;
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

  // Generate the map image if the map message changes
  useEffect(() => {

    if (mapMessage !== null) {
      canvasRef.current.width = mapMessage.info.width;
      canvasRef.current.height = mapMessage.info.height;
      const context = canvasRef.current.getContext('2d');
      context.clearRect(0, 0, mapMessage.info.width, mapMessage.info.height);
      const imageSize = mapMessage.info.width * mapMessage.info.height;
      const imageDataArray = new Array(imageSize * 4);
      for (let i = 0; i < imageSize; ++i) {
        const occupancyGridValue = mapMessage.data[i];
        const pixelLuminance =
          occupancyGridValue < 0
            ? 205
            : (255 * (100 - occupancyGridValue)) / 100;
        imageDataArray[i * 4] = pixelLuminance;
        imageDataArray[i * 4 + 1] = pixelLuminance;
        imageDataArray[i * 4 + 2] = pixelLuminance;
        imageDataArray[i * 4 + 3] = 255;
      }

      const imageData = new ImageData(
        canvasRef.current,
        imageDataArray,
        mapMessage.info.width,
        mapMessage.info.height,
      );

      context.putImageData(imageData, 0, 0);
      canvasRef.current.toDataURL('image/png').then(res => {
        setMapImageSource({
          data: res.substring(1, res.length - 1),
          width: mapMessage.info.width,
          height: mapMessage.info.height,
        });
      });
      context.clearRect(0, 0, mapMessage.info.width, mapMessage.info.height);
    }
  }, [mapMessage]);

  // Re-render canvas when the map image and position changes
  useEffect(() => {
    if (mapImageSource !== null) {
      const canvasDimension = getCanvasDimensions();
      canvasRef.current.width = canvasDimension;
      canvasRef.current.height = canvasDimension;

      const context = canvasRef.current.getContext('2d');
      context.clearRect(0, 0, canvasDimension, canvasDimension);
      const mapImage = new CanvasImage(canvasRef.current);
      mapImage.addEventListener('load', () => {
        context.imageSmoothingEnabled = false;
        context.drawImage(mapImage, 0, 0, canvasDimension, canvasDimension);
      });
      mapImage.src = mapImageSource.data;
    }
  }, [mapImageSource]);

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
