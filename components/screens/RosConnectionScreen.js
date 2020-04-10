import React, {useContext, useEffect, useState} from 'react';
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import ButtonStyled from '../styledComponets/ButtonStyled';
import RosSettingsContext from '../contexts/RosSettingsContext';
import ROSLIB from 'roslib';
import AutocompleteStyled from '../styledComponets/AutocompleteStyled';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';

const RosConnectionScreen = props => {
  const rosSettings = useContext(RosSettingsContext);
  const [rosIp, setRosIp] = useState(rosSettings.ros_ip);
  const [isDisabled, setIsDisabled] = useState(true);
  const [urlCollection, setUrlCollection] = useState([]);

  // Runs only after the first render and it load the urlCollection
  useEffect(() => {
    const promise = AsyncStorage.getItem('urlCollection');
    promise
      .then(ret => setUrlCollection(JSON.parse(ret)))
      .catch(e => console.log(e))
      .done();
  }, []);

  const urlValidator = address => {
    return address.match(
      /^(http(s)?:\/\/)([0-9]{1,3}\.){3}([0-9]{1,3}:[0-9]{1,4})$/g,
    );
  };

  const onTextChangeHandle = newText => {
    if (urlValidator(newText) !== null) {
      setIsDisabled(false);
      setRosIp(newText);
    } else {
      setIsDisabled(true);
      setRosIp(newText);
    }
  };

  const connectToRos = address => {
    if (urlValidator(address) !== null) {
      if (urlCollection.includes(address) === false) {
        setUrlCollection(urlCollection.concat([address]).slice(0, 5));
        AsyncStorage.setItem(
          'urlCollection',
          JSON.stringify(urlCollection.concat([address]).slice(0, 5)),
        )
          .catch(e => console.log(e))
          .done();
      }

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
        <View>
          <AutocompleteStyled
            fetchData={() =>
              urlCollection.filter(value => new RegExp('^' + rosIp).test(value))
            }
            handleSelectItem={(item, id) => {
              onTextChangeHandle(item);
            }}
            valueExtractor={(item, index) => item}
            waitInterval={200}
            noDataText={'No url found'}
            onChangeText={newText => onTextChangeHandle(newText)}
            autoCapitalize={'none'}
            scrollStyle={{backgroundColor: 'blue'}}
            renderIcon={color => (
              <Icon
                name="link"
                size={20}
                color={color}
                style={{position: 'absolute', top: 11, left: 10}}
              />
            )}
          />
        </View>
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
