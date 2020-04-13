import React, {useContext} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AppThemeContext from '../contexts/AppThemeContext';

const HeaderLeftStyled = props => {
  const navigation = useNavigation();
  const theme = useContext(AppThemeContext);

  return (
    <View style={{alignContent: 'center', padding: 20}}>
      <TouchableOpacity
        onPress={() => {
          navigation.dispatch(DrawerActions.openDrawer());
        }}>
        <Icon name={'bars'} color={theme.colors.text} size={25} />
      </TouchableOpacity>
    </View>
  );
};

export default HeaderLeftStyled;
