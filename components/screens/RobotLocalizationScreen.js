import React, {useContext, useEffect} from 'react';
import {Button, Text, View} from 'react-native';
import {Strings} from '../definitions/Strings';
import RosSettingsContext from '../contexts/RosSettingsContext';

const RobotLocalizationScreen = props => {
  const rosSettings = useContext(RosSettingsContext);

  // At first render, check if it is connected
  useEffect(() => {
    if (!rosSettings.is_connected) {
      props.navigation.navigate(Strings.rosConnectionScreen);
    }
  }, []);
  return (
    <View>
      <Button title={'Modal'} onPress={() => {}} />
    </View>
  );
};

export default RobotLocalizationScreen;
