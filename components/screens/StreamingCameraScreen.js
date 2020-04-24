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

  useEffect(() => {
    props.navigation.addListener('focus', () => {
      calculateWebViewDimension(false);
      SimpleToast.show('Reload camera stream');
      setWebViewUri({
        html: '<body style="background-color: black"></body>',
      });

      setTimeout(() => {
        setWebViewUri(createUri());
      }, 1000);
    });
  }, [props.navigation]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
      }}>
      <WebView
        ref={webViewRef}
        style={{
          width: webViewDimension.width,
          height: webViewDimension.height,
        }}
        source={webViewUri}
        scrollEnabled={false}
        cacheEnabled={false}
        onError={() => calculateWebViewDimension(false)}
        onLoad={() => {
          calculateWebViewDimension(true);
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
            calculateWebViewDimension(false);
            SimpleToast.show('Reload camera stream');
            setWebViewUri({
              html: '<body style="background-color: black"></body>',
            });

            setTimeout(() => {
              setWebViewUri(createUri());
            }, 10);
          }}
          activeOpacity={0.7}>
          <FontAwesomeIcon icon={faRedo} size={25} color={'white'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default StreamingCameraScreen;
