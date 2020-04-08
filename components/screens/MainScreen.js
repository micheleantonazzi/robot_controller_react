import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const MainScreen = props => {
  return (
    <View style={styles.mainViewStyle}>
      <Text>Home Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  mainViewStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MainScreen;
