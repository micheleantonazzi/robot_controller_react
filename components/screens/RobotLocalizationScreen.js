import React, {useContext, useEffect, useRef, useState} from 'react';
import 'react-native-get-random-values';
import {Button, Dimensions, Text, View} from 'react-native';
import {Strings} from '../definitions/Strings';
import RosSettingsContext from '../contexts/RosSettingsContext';
import ROSLIB from 'roslib';
import Canvas, {ImageData, Image as CanvasImage} from 'react-native-canvas';
import {useHeaderHeight} from '@react-navigation/stack';

const RobotLocalizationScreen = props => {
  const rosSettingsContext = useContext(RosSettingsContext);
  const [mapListener, setMapListener] = useState(null);
  const [poseListener, setPoseListener] = useState(null);
  const [mapMessage, setMapMessage] = useState(null);
  const [mapImageSource, setMapImageSource] = useState(null);
  const [robotPose, setRobotPose] = useState(null);
  const canvasRef = useRef(null);
  const headerHeight = useHeaderHeight();

  // Returns the up view height in order to center the canvas
  const getViewUpHeight = () => {
    const screenHeight = Dimensions.get('window').height;
    const screenWidth = Dimensions.get('window').width;

    if (screenHeight <= screenWidth) {
      return 0;
    }

    return (screenHeight - headerHeight - screenWidth) / 2;
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

  // Create new map Listener
  const createMapListener = () => {
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
        console.log(message.info);
        setMapMessage(message);
      });

      setMapListener(newMapListener);
    }
  };

  const createPoseListener = () => {
    if (rosSettingsContext.rosSettings.ros_connector !== null) {
      if (poseListener !== null) {
        poseListener.unsubscribe();
      }

      const newPoseListener = new ROSLIB.Topic({
        ros: rosSettingsContext.rosSettings.ros_connector,
        name: '/amcl_pose',
        messageType: 'geometry_msgs/PoseWithCovarianceStamped',
      });

      newPoseListener.subscribe(function(message) {
        setRobotPose(message);
      });

      setPoseListener(newPoseListener);
    }
  };

  // At first render, check if it is connected otherwise open RosConnectionScreen
  useEffect(() => {
    if (rosSettingsContext.rosSettings.is_connected === false) {
      props.navigation.navigate(Strings.rosConnectionScreen);
    }
  }, []);

  // Create a new mapListener only if the ros_connector changes
  useEffect(() => {
    createMapListener();
    createPoseListener();
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
      /*
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

       */

      for (let i = 0; i < mapMessage.info.height; ++i) {
        for (let y = 0; y < mapMessage.info.width; ++y){
          const occupancyGridValue =
            mapMessage.data[i * mapMessage.info.width + y];
          const pixelLuminance =
            occupancyGridValue < 0
              ? 205
              : (255 * (100 - occupancyGridValue)) / 100;

          const pixelCoordinate =
            i * mapMessage.info.width * 4 + (mapMessage.info.width - 1 - y) * 4;
          imageDataArray[pixelCoordinate] = pixelLuminance;
          imageDataArray[pixelCoordinate + 1] = pixelLuminance;
          imageDataArray[pixelCoordinate + 2] = pixelLuminance;
          imageDataArray[pixelCoordinate + 3] = 255;
        }
      }

      const imageData = new ImageData(
        canvasRef.current,
        imageDataArray,
        mapMessage.info.width,
        mapMessage.info.height,
      );

      console.log('draw first');
      context.putImageData(imageData, 0, 0);
      canvasRef.current.toDataURL('image/png').then(res => {
        // Create map image to render in the canvas
        const mapImage = new CanvasImage(canvasRef.current);
        mapImage.addEventListener('load', () => {
          setMapImageSource({
            image: mapImage,
            width: mapMessage.info.width,
            height: mapMessage.info.height,
          });
        });
        mapImage.src = res.substring(1, res.length - 1);
      });
      context.clearRect(0, 0, mapMessage.info.width, mapMessage.info.height);
      canvasRef.current.width = getCanvasDimensions();
      canvasRef.current.height = getCanvasDimensions();
    }
  }, [mapMessage]);

  // Re-render map when the map image changes
  useEffect(() => {
    const canvasDimension = getCanvasDimensions();
    canvasRef.current.width = canvasDimension;
    canvasRef.current.height = canvasDimension;
    if (mapImageSource !== null) {

      const context = canvasRef.current.getContext('2d');
      const scale = canvasDimension / mapImageSource.width;
      context.imageSmoothingEnabled = false;
      context.scale(scale, scale);
      context.drawImage(
        mapImageSource.image,
        0,
        0,
        mapImageSource.width,
        mapImageSource.height,
      );
      drawRobotPoseMarker();
    } else {
      console.log('scrivo');
      const context = canvasRef.current.getContext('2d');
      context.setTransform(1, 0, 0, 1, 0, 0);

      context.font = '100px Comic Sans MS';
      context.fillStyle = 'white';
      context.strokeStyle = 'red';
      context.textAlign = 'center';
      context.fillText('NO MAP DATA', 540, 540);
    }
  }, [mapImageSource, robotPose]);

  const drawRobotPoseMarker = () => {
    if (mapMessage !== null && robotPose !== null) {
      const context = canvasRef.current.getContext('2d');
      context.setTransform(1, 0, 0, 1, 0, 0);
      const translateY =
        (robotPose.pose.pose.position.y - mapMessage.info.origin.position.y) /
        mapMessage.info.resolution;
      const translateX =
        (robotPose.pose.pose.position.x - mapMessage.info.origin.position.x) /
        mapMessage.info.resolution;

      context.translate(
        getCanvasDimensions() -
          translateX * (getCanvasDimensions() / mapMessage.info.width),
        translateY * (getCanvasDimensions() / mapMessage.info.width),
      );
      context.beginPath();

      context.moveTo(0, -37);
      context.lineTo(25, +37);
      context.lineTo(0, 20);
      context.lineTo(-25, +37);
      context.lineTo(0, -37);
      context.closePath();
      context.fill();
    }
  };

  return (
    <View style={{flex: 1}}>
      <View style={{height: getViewUpHeight()}} />
      <Canvas ref={canvasRef} />
    </View>
  );
};

export default RobotLocalizationScreen;
