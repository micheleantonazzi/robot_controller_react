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
import {Strings} from '../definitions/Strings';
import SimpleToast from 'react-native-simple-toast';
import Spinner from 'react-native-loading-spinner-overlay';
import AppThemeContext from '../contexts/AppThemeContext';
import TextInputStyled from '../styledComponets/TextInputStyled';

const RosConnectionScreen = props => {
  const theme = useContext(AppThemeContext);
  const rosSettings = useContext(RosSettingsContext);
  const [rosIp, setRosIp] = useState(rosSettings.ros_ip);
  const [isDisabledButtonConnect, setIsDisabledButtonConnect] = useState(true);
  const [isVisibleSpinner, setIsVisibleSpinner] = useState(false);
  const [urlCollection, setUrlCollection] = useState([]);

  // Runs only after the first render and it load the urlCollection
  useEffect(() => {
    const promise = AsyncStorage.getItem('urlCollection');
    promise
      .then(ret => {
        if (ret === null) {
          setUrlCollection([]);
        } else {
          setUrlCollection(JSON.parse(ret));
        }
      })
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
      setIsDisabledButtonConnect(false);
      setRosIp(newText);
    } else {
      setIsDisabledButtonConnect(true);
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

      setIsDisabledButtonConnect(true);
      setIsVisibleSpinner(true);

      let ros = new ROSLIB.Ros({
        url: address,
      });

      ros.on('connection', () => {
        SimpleToast.show(Strings.connectionSuccess);
        props.navigation.goBack();
        rosSettings.is_connected = true;
        rosSettings.ros_connector = ros;

        setIsDisabledButtonConnect(false);
        setIsVisibleSpinner(false);
      });

      ros.on('error', error => {
        if (rosSettings.is_connected === true) {
          SimpleToast.show(Strings.connectionClosedError);
        } else {
          SimpleToast.show(Strings.connectionError);
        }
        if (!props.navigation.isFocused()) {
          props.navigation.navigate(Strings.rosConnectionScreen);
        }

        rosSettings.is_connected = false;

        setIsDisabledButtonConnect(false);
        setIsVisibleSpinner(false);
      });

      ros.on('close', function() {
        console.log('Connection to websocket server closed.');

        setIsDisabledButtonConnect(false);
        setIsVisibleSpinner(false);
      });
    }
  };

  return (
    <View style={styles.mainViewStyle}>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}>
        <View>
          <TextInputStyled style={styles.titleTextStyle}>
            Connect to master
          </TextInputStyled>
          <View>
            <Spinner
              visible={isVisibleSpinner}
              textContent={'Connecting to master'}
              textStyle={{color: theme.colors.textMedium}}
              animation={'fade'}
              size={'large'}
              overlayColor={'rgba(24, 24, 24, 0.4)'}
              color={theme.colors.secondary}
            />
            <AutocompleteStyled
              fetchData={() =>
                urlCollection.filter(value =>
                  new RegExp('^' + rosIp).test(value),
                )
              }
              handleSelectItem={(item, id) => {
                onTextChangeHandle(item);
              }}
              valueExtractor={(item, index) => item}
              waitInterval={200}
              noDataText={'No url found'}
              onChangeText={newText => onTextChangeHandle(newText)}
              autoCapitalize={'none'}
              separatorStyle={{height: 0}}
              listFooterStyle={{height: 0, borderTopWidth: 0}}
              pickerStyle={{width: '90%', elevation: 20}}
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
              disabled={isDisabledButtonConnect}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  mainViewStyle: {
    flex: 1,
    padding: 30,
  },
  titleTextStyle: {
    textAlign: 'center',
    fontSize: 30,
    marginBottom: 15,
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
