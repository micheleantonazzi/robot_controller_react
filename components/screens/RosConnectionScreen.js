import React from 'react';
import {StyleSheet, View} from 'react-native';
import TextInputStyled from '../styledComponets/TextInputStyled';
import ButtonStyled from '../styledComponets/ButtonStyled';

const RosConnectionScreen = props => {
  return (
    <View style={styles.mainViewStyle}>
      <TextInputStyled style={styles.textInputAddressStyle} />
      <View style={styles.buttonBoxStyle}>
        <ButtonStyled title={'Connect'} onPress={() => {}} />
      </View>
    </View>
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
    fontSize: 17,
  },
  buttonBoxStyle: {
    margin: 20,
  },
});

export default RosConnectionScreen;
