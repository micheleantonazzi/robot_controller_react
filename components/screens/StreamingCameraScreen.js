import React, {useContext, useState} from 'react';
import {View, Dimensions} from 'react-native';
import RosSettingsContext from '../contexts/RosSettingsContext';
import ROSLIB from 'roslib';
import WebView from 'react-native-webview';

const StreamingCameraScreen = props => {
  const rosSettingsContext = useContext(RosSettingsContext);
  const [webViewDimension, setWebViewDimension] = useState(
    Dimensions.get('window'),
  );

  Dimensions.addEventListener('change', () => {
    const screenWidth = Dimensions.get('screen').width;
    const screenHeight = Dimensions.get('screen').height;

    if (screenHeight >= screenWidth) {
      setWebViewDimension({width: screenWidth, height: screenHeight});
    } else {
      setWebViewDimension({width: screenHeight + 20, height: screenHeight});
    }
  });

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
      }}>
      <WebView
        style={{
          width: webViewDimension.width,
          height: webViewDimension.height,
        }}
        source={{
          uri: 'http://192.168.1.81:8089/stream?topic=/usb_cam/image_raw',
        }}
        scrollEnabled={false}
      />
    </View>
  );
};

export default StreamingCameraScreen;
