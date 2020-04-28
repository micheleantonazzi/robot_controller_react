import React, {useState} from 'react';
import {View, StyleSheet, Switch, Text} from 'react-native';
import RobotLocalizationScreen from "./RobotLocalizationScreen";
import StreamingCameraScreen from "./StreamingCameraScreen";

const RobotControlScreen = props => {
  const [switchViewIsEnable, setSwitchViewEnable] = useState(false);

  return (
    <View style={styles.mainViewStyle}>
      <View style={{position: 'absolute', top:20, left: 0, right: 0, zIndex: 1, }}>
        <Switch
          onValueChange={() => setSwitchViewEnable(!switchViewIsEnable)}
          value={switchViewIsEnable}
          style={styles.switchViewStyle}
        />
      </View>
      <View style={{flex: 1, backgroundColor: 'blue'}}>
        {switchViewIsEnable ? (
          <StreamingCameraScreen {...props} />
        ) : (
          <Text>ss</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainViewStyle: {
    flex: 1,
  },
  switchViewStyle: {
    marginTop: 20,
  },
});

export default RobotControlScreen;
