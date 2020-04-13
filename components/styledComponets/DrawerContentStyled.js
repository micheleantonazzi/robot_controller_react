import React, {useContext} from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {Image, StyleSheet, Text, View} from 'react-native';
import AppThemeContext from '../contexts/AppThemeContext';

const DrawerContentStyled = props => {
  const theme = useContext(AppThemeContext);

  return (
    <DrawerContentScrollView>
      <View style={styles.mainViewStyle}>
        <Image
          source={require('../assets/main_logo.png')}
          style={styles.imageStyle}
        />
        <Text style={{color: theme.colors.text, fontSize: 18}}>MViz</Text>
        <Text style={{color: theme.colors.text, fontSize: 13}}>
          Mobile Ros Visualizer
        </Text>
      </View>
      <DrawerItemList
        state={props.state}
        navigation={props.navigation}
        descriptors={props.descriptors}
      />
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  mainViewStyle: {
    paddingLeft: 20,
    paddingTop: 75,
    paddingBottom: 30,
  },
  imageStyle: {
    width: 100,
    height: 100,
    marginBottom: 18,
  },
});

export default DrawerContentStyled;
