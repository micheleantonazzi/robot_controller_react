import React, {useContext} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import TextInputStyled from '../styledComponets/TextInputStyled';

const RosConnectionScreen = props => {
  return (
    <View style={styles.mainViewStyle}>
      <TextInputStyled style={styles.textInputAddressStyle} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainViewStyle: {
    flex: 1,
    padding: 20,
  },
  textInputAddressStyle: {
    borderBottomWidth: 2,
  },
});

export default RosConnectionScreen;
