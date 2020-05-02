import React, {useRef, useState, useEffect, useContext} from 'react';
import {View, Dimensions, Text, TouchableOpacity} from 'react-native';
import WebView from 'react-native-webview';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faRedo} from '@fortawesome/free-solid-svg-icons';
import SimpleToast from 'react-native-simple-toast';
import AppThemeContext from '../contexts/AppThemeContext';
import {useIsFocused} from '@react-navigation/native';
import RosSettingsContext from '../contexts/RosSettingsContext';

const StreamingCameraScreen = props => {
  const theme = useContext(AppThemeContext);
  const rosSettingsContext = useContext(RosSettingsContext);
  const getScreenOrientation = () => {
    return Dimensions.get('screen').width >= Dimensions.get('screen').height
      ? 'landscape'
      : 'portrait';
  };
  const webViewRef = useRef();
  const isFocused = useIsFocused();

  // Create the uri for the web view
  const createUri = () => {
    return isFocused
      ? {uri: 'http://192.168.1.81:8089/stream?topic=/usb_cam/image_raw'}
      : {uri: ''};
  };
  const [webViewDimension, setWebViewDimension] = useState(
    Dimensions.get('window'),
  );

  const [cameraDimension, setCameraDimension] = useState({width: 1, height: 1});

  const [screenOrientation, setScreenOrientation] = useState(
    getScreenOrientation(),
  );

  const [k, setK] = useState(0);

  const calculateWebViewDimension = showWebView => {
    if (showWebView === false) {
      setWebViewDimension({width: 0, height: 0});
    } else {
      const screenWidth = Dimensions.get('screen').width;
      const screenHeight = Dimensions.get('screen').height;

      if (screenHeight >= screenWidth) {
        setWebViewDimension({
          width: screenWidth,
          height:
            screenWidth * (cameraDimension.height / cameraDimension.width),
        });
      } else {
        setWebViewDimension({
          width:
            screenHeight + 20,
          height: screenHeight,
        });
      }
    }
  };

  const onScreenDimensionChange = () => {
    calculateWebViewDimension(webViewDimension.width > 0);
  };

  useEffect(() => {
    Dimensions.addEventListener('change', onScreenDimensionChange);
    Dimensions.addEventListener('change', () => {
      setScreenOrientation(getScreenOrientation());
    });
  }, []);

  // On screen focus reload webview
  useEffect(() => {
    props.navigation.addListener('focus', () => {
      incrementK();
    });
  }, [props.navigation]);

  // Read camera dimension when new listener is created
  useEffect(() => {
    if (rosSettingsContext.rosSettings.camera_info_listener !== null) {
      rosSettingsContext.rosSettings.camera_info_listener.subscribe(function(
        message,
      ) {
        console.log(message);
        setCameraDimension({
          width: message.width,
          height: message.height,
        });
        rosSettingsContext.rosSettings.camera_info_listener.unsubscribe();
        Dimensions.removeEventListener('change', onScreenDimensionChange);
      });
    }
  }, [rosSettingsContext.rosSettings.camera_info_listener]);

  useEffect(() => {
    calculateWebViewDimension(true);
    Dimensions.addEventListener('change', onScreenDimensionChange);
  }, [cameraDimension]);

  const incrementK = () => {
    setK(k + 1);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
      }}>
      <WebView
        // The page which share cam finishes loading only if it fails, otherwise it doesn't terminate
        key={k}
        ref={webViewRef}
        style={{
          height: webViewDimension.height,
          maxHeight: webViewDimension.height,
          backgroundColor: theme.colors.background,
        }}
        containerStyle={{
          width: webViewDimension.width,
          maxHeight: webViewDimension.height,
          backgroundColor: theme.colors.background,
        }}
        source={createUri()}
        scrollEnabled={false}
        cacheEnabled={false}
        onError={() => calculateWebViewDimension(false)}
        onLoadStart={e => {
          if (e.nativeEvent.loading === true) {
            calculateWebViewDimension(true);
          }
        }}
        onLoadEnd={e => {
          calculateWebViewDimension(false);
        }}
      />
      {webViewDimension.width <= 0 ? (
        <Text
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            right: 0,
            color: theme.colors.text,
            textAlign: 'center',
            textAlignVertical: 'center',
            fontSize: 38,
            backgroundColor: theme.colors.background,
          }}>
          NO VIDEO DATA
        </Text>
      ) : (
        <Text style={{position: 'absolute', zIndex: -1}} />
      )}
      <View
        style={
          !props.isControlScreen
            ? {
                position: 'absolute',
                right: 20,
                bottom: 20,
                backgroundColor: theme.colors.primary,
                padding: 12,
                borderRadius: 50,
              }
            : screenOrientation === 'portrait'
            ? {
                position: 'absolute',
                right: 20,
                top: 24,
                backgroundColor: theme.colors.primary,
                padding: 12,
                borderRadius: 50,
              }
            : {
                position: 'absolute',
                left: 20,
                top: 20,
                backgroundColor: theme.colors.primary,
                padding: 12,
                borderRadius: 50,
              }
        }>
        <TouchableOpacity
          onPress={() => {
            SimpleToast.show('Reconnect to camera server');
            incrementK();
          }}
          activeOpacity={0.7}>
          <FontAwesomeIcon icon={faRedo} size={25} color={theme.colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default StreamingCameraScreen;
