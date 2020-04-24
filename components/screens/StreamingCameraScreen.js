import React, {useRef, useState, useEffect} from 'react';
import {View, Dimensions, Text, TouchableOpacity} from 'react-native';
import WebView from 'react-native-webview';
import {useFocusEffect} from '@react-navigation/native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faRedo} from '@fortawesome/free-solid-svg-icons';
import SimpleToast from 'react-native-simple-toast';

const StreamingCameraScreen = props => {
  const webViewRef = useRef();

  // Create the uri for the web view
  const createUri = () => {
    return {uri: 'http://192.168.1.81:8089/stream?topic=/usb_cam/image_raw'};
  };
  const [webViewDimension, setWebViewDimension] = useState(
    Dimensions.get('window'),
  );
  const [webViewUri, setWebViewUri] = useState(createUri());
  const [displayWebView, setDisplayWebView] = useState(true);
  const [k, setK] = useState(0);
  const calculateWebViewDimension = showWebView => {
    console.log('calculate webview dim ' + showWebView);
    if (showWebView === false) {
      setWebViewDimension({width: 0, height: 0});
    } else {
      const screenWidth = Dimensions.get('screen').width;
      const screenHeight = Dimensions.get('screen').height;

      if (screenHeight >= screenWidth) {
        setWebViewDimension({width: screenWidth, height: screenHeight});
      } else {
        setWebViewDimension({width: screenHeight + 20, height: screenHeight});
      }
    }
  };

  Dimensions.addEventListener('change', () => {
    calculateWebViewDimension(displayWebView);
  });

  // On screen focus reload webview
  useEffect(() => {
    props.navigation.addListener('focus', () => {
      incrementK();
    });
  }, [props.navigation]);

  const incrementK = () => {
    setK(k + 1);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
      }}>
      <WebView
        // The page which share cam finishes loading only if it fails, otherwise it doesn't terminate
        key={k}
        ref={webViewRef}
        style={{
          width: webViewDimension.width,
          height: webViewDimension.height,
        }}
        source={webViewUri}
        scrollEnabled={false}
        cacheEnabled={false}
        onError={() => calculateWebViewDimension(false)}

        onLoadStart={(e) => {
          if (e.nativeEvent.loading === true) {
            calculateWebViewDimension(true);
          }
        }}
        onLoadEnd={(e) => {
          calculateWebViewDimension(false);
        }}
      />
      <View
        style={{
          position: 'absolute',
          right: 20,
          bottom: 20,
          backgroundColor: '#42a5f6',
          padding: 12,
          borderRadius: 50,
        }}>
        <TouchableOpacity
          onPress={() => {
            incrementK();
          }}
          activeOpacity={0.7}>
          <FontAwesomeIcon icon={faRedo} size={25} color={'white'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default StreamingCameraScreen;
