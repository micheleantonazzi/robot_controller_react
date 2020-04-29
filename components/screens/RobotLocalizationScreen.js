import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import 'react-native-get-random-values';
import {Dimensions, View} from 'react-native';
import {Strings} from '../definitions/Strings';
import RosSettingsContext from '../contexts/RosSettingsContext';
import ROSLIB from 'roslib';
import Canvas, {ImageData, Image as CanvasImage} from 'react-native-canvas';
import {useHeaderHeight} from '@react-navigation/stack';
import {useFocusEffect} from '@react-navigation/native';
import AppThemeContext from '../contexts/AppThemeContext';

const RobotLocalizationScreen = props => {
  const rosSettingsContext = useContext(RosSettingsContext);
  const themeContext = useContext(AppThemeContext);
  //const [mapListener, setMapListener] = useState(null);
  //const [poseListener, setPoseListener] = useState(null);
  const [mapMessage, setMapMessage] = useState(null);
  const [mapImageSource, setMapImageSource] = useState(null);
  const [screenDimension, setScreenDimension] = useState(
    Dimensions.get('screen'),
  );
  const canvasRef = useRef(null);
  const headerHeight = useHeaderHeight();

  Dimensions.addEventListener('change', () => {
    setScreenDimension(Dimensions.get('screen'));
  });

  // Returns the up view height in order to center the canvas
  const getViewUpHeight = () => {
    const screenHeight = screenDimension.height;
    const screenWidth = screenDimension.width;

    if (screenHeight <= screenWidth) {
      return 0;
    }

    return (screenHeight - headerHeight * 1.4 - screenWidth) / 2.0;
  };

  // Returns the up view height in order to center the canvas
  const getViewUpWidth = () => {
    const screenHeight = screenDimension.height;
    const screenWidth = screenDimension.width;

    if (screenHeight >= screenWidth) {
      return 0;
    }

    return (screenWidth - screenHeight + headerHeight * 0.4) / 2;
  };

  // Get the canvas dimensions based on the screen size
  const getCanvasDimensions = () => {
    const screenWidth = screenDimension.width * screenDimension.scale;
    const screenHeight = screenDimension.height * screenDimension.scale;

    // Canvas must be a square
    const canvasDimension =
      screenWidth > screenHeight
        ? Math.floor(screenHeight) - headerHeight * screenDimension.scale
        : Math.floor(screenWidth);

    return canvasDimension;
  };

  // Create new map Listener
  const createMapListener = () => {
    if (rosSettingsContext.rosSettings.ros_connector !== null) {
      rosSettingsContext.rosSettings.map_listener.unsubscribe();
      rosSettingsContext.rosSettings.map_listener.subscribe(function(message) {
        setMapMessage(message);
      });
    }
  };

  const createPoseListener = () => {
    if (rosSettingsContext.rosSettings.ros_connector !== null) {
      rosSettingsContext.rosSettings.pose_listener.unsubscribe();
      rosSettingsContext.rosSettings.pose_listener.subscribe(function(message) {
        drawRobotPoseMarker(message);
      });
    }
  };

  // At first render, check if it is connected otherwise open RosConnectionScreen
  useEffect(() => {
    if (rosSettingsContext.rosSettings.is_connected === false) {
      props.navigation.navigate(Strings.rosConnectionScreenName);
    }
  }, []);

  // Create a new mapListener only if the ros_connector changes
  useEffect(() => {
    createMapListener();
    createPoseListener();
  }, [rosSettingsContext.rosSettings.ros_connector]);

  // Generate the map image if the map message changes
  useEffect(() => {
    if (mapMessage !== null && canvasRef.current !== null) {
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
        for (let y = 0; y < mapMessage.info.width; ++y) {
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
    drawImageMap();
    createPoseListener();
  }, [screenDimension, mapImageSource]);

  const drawImageMap = () => {

    if (mapImageSource !== null && canvasRef.current !== null) {
      const canvasDimension = getCanvasDimensions();
      canvasRef.current.width = canvasDimension;
      canvasRef.current.height = canvasDimension;
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
      drawRobotPoseMarker(null);
    } else {
      const context = canvasRef.current.getContext('2d');
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.font = '100px Comic Sans MS';
      context.fillStyle = themeContext.colors.text;
      context.strokeStyle = 'red';
      context.textAlign = 'center';
      context.fillText(
        'NO MAP DATA',
        getCanvasDimensions() / 2,
        getCanvasDimensions() / 2,
      );
    }
  };
  const drawRobotPoseMarker = robotPose => {
    if (
      mapMessage !== null &&
      robotPose !== null &&
      canvasRef.current !== null
    ) {
      drawImageMap();
      const context = canvasRef.current.getContext('2d');
      context.setTransform(1, 0, 0, 1, 0, 0);
      const translateY =
        (robotPose.pose.pose.position.y - mapMessage.info.origin.position.y) /
        mapMessage.info.resolution;
      const translateX =
        (robotPose.pose.pose.position.x - mapMessage.info.origin.position.x) /
        mapMessage.info.resolution;

      // Translate
      context.translate(
        getCanvasDimensions() -
          translateX * (getCanvasDimensions() / mapMessage.info.width),
        translateY * (getCanvasDimensions() / mapMessage.info.width),
      );

      // Scale to adjust the marker to the map dimensions
      context.scale(
        384.0 / mapMessage.info.width / 1.5,
        384.0 / mapMessage.info.width / 1.5,
      );

      // Rotate
      const orientation = robotPose.pose.pose.orientation;
      const siny_cosp =
        2 * (orientation.w * orientation.z + orientation.x * orientation.y);
      const cosy_cosp =
        1 - 2 * (orientation.y * orientation.y + orientation.z * orientation.z);
      const theta = Math.atan2(siny_cosp, cosy_cosp);
      context.rotate(-theta - Math.PI / 2);
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
    <View
      style={{
        flex: 1,
        flexDirection:
          screenDimension.height >= screenDimension.width ? 'column' : 'row',
      }}>
      <View style={{height: getViewUpHeight(), width: getViewUpWidth()}} />
      <Canvas ref={canvasRef} />
    </View>
  );
};

export default RobotLocalizationScreen;
