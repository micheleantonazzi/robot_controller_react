import React, {useContext, useState} from 'react';
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import TextInputStyled from '../styledComponets/TextInputStyled';
import ButtonStyled from '../styledComponets/ButtonStyled';
import RosSettingsContext from '../contexts/RosSettingsContext';
import ROSLIB from 'roslib';
import {add} from 'react-native-reanimated';

const RosConnectionScreen = props => {
  const rosSettings = useContext(RosSettingsContext);
  const [rosIp, setRosIp] = useState(rosSettings.ros_ip);
  const [isDisabled, setIsDisabled] = useState(true);

  const urlValidator = address => {
    return address.match(
      /^(http(s)?:\/\/)([0-9]{1,3}\.){3}([0-9]{1,3}:[0-9]{1,4})$/g,
    );
  };

  const connectToRos = address => {
    if (urlValidator(address) !== null) {
      var ros = new ROSLIB.Ros({
        url: address,
      });

      ros.on('connection', function() {
        console.log('Connected to websocket server.');
      });

      ros.on('error', function(error) {
        console.log('Error connecting to websocket server: ', error);
      });

      ros.on('close', function() {
        console.log('Connection to websocket server closed.');
      });
    }
  };
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}>
      <View style={styles.mainViewStyle}>
        <TextInputStyled
          style={styles.textInputAddressStyle}
          value={rosIp}
          autoCapitalize={'none'}
          onChangeText={newText => {
            if (urlValidator(newText) !== null) {
              setIsDisabled(false);
            } else {
              setIsDisabled(true);
            }
            setRosIp(newText);
          }}
        />
        <View style={styles.buttonBoxStyle}>
          <ButtonStyled
            title={'Connect'}
            onPress={() => {
              Keyboard.dismiss();
              connectToRos(rosIp);
            }}
            disabled={isDisabled}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  mainViewStyle: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
  },
  textInputAddressStyle: {
    borderBottomWidth: 2,
    fontSize: 18,
    textAlign: 'center',
  },
  buttonBoxStyle: {
    margin: 20,
  },
});

export default RosConnectionScreen;
