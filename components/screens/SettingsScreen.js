import React, {useContext, useState} from 'react';
import {View, Text, ScrollView, StyleSheet, Button} from 'react-native';
import AppThemeContext from '../contexts/AppThemeContext';
import TextInputStyled from '../styledComponets/TextInputStyled';
import RosSettingsContext from '../contexts/RosSettingsContext';
import ButtonStyled from '../styledComponets/ButtonStyled';

const SettingsScreen = props => {
  const theme = useContext(AppThemeContext);
  const rosSettingsContext = useContext(RosSettingsContext);

  const [mapTopicValue, setMapTopicValue] = useState(
    rosSettingsContext.rosSettings.map_topic,
  );
  const [poseTopicValue, setPoseTopicValue] = useState(
    rosSettingsContext.rosSettings.pose_topic,
  );
  const [cameraUrlValue, setCameraUrlValue] = useState(
    rosSettingsContext.rosSettings.camera_url,
  );
  const [controlTopicValue, setControlTopicValue] = useState(
    rosSettingsContext.rosSettings.control_topic,
  );

  return (
    <View style={styles.mainViewStyle}>
      <ScrollView>
        <Text style={{color: theme.colors.textDark, ...styles.textStyle}}>
          Map topic
        </Text>
        <TextInputStyled
          style={{fontSize: 17, ...styles.textInputStyle}}
          value={mapTopicValue}
          onChangeText={text => setMapTopicValue(text)}
        />

        <Text style={{color: theme.colors.textDark, ...styles.textStyle}}>
          Pose topic
        </Text>
        <TextInputStyled
          style={{fontSize: 17, ...styles.textInputStyle}}
          value={poseTopicValue}
          onChangeText={text => setPoseTopicValue(text)}
        />

        <Text style={{color: theme.colors.textDark, ...styles.textStyle}}>
          Camera streaming URL
        </Text>
        <TextInputStyled
          style={{fontSize: 17, ...styles.textInputStyle}}
          value={cameraUrlValue}
          onChangeText={text => setCameraUrlValue(text)}
        />

        <Text style={{color: theme.colors.textDark, ...styles.textStyle}}>
          Control topic
        </Text>
        <TextInputStyled
          style={{fontSize: 17, ...styles.textInputStyle}}
          value={controlTopicValue}
          onChangeText={text => setControlTopicValue(text)}
        />
        <View style={styles.buttonBoxStyle}>
          <View style={{marginRight: 15}}>
            <Button
              title={'Reset'}
              onPress={() => {}}
              color={theme.colors.gyroscopeDisabled}
            />
          </View>
          <ButtonStyled title={'Save'} onPress={() => {}} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainViewStyle: {
    margin: 20,
  },
  textStyle: {
    fontSize: 17,
  },
  textInputStyle: {
    marginBottom: 25,
  },
  buttonBoxStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default SettingsScreen;
