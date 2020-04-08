import React, {useContext} from 'react';
import {Button} from 'react-native';
import AppThemeContext from '../contexts/AppThemeContext';

const ButtonStyled = props => {
  const theme = useContext(AppThemeContext);
  return (
    <Button
      title={props.title}
      onPress={props.onPress}
      style={{...props.style}}
      color={theme.colors.primary}
      disabled={props.disabled}
    />
  );
};

export default ButtonStyled;
