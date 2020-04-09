import React, {useContext} from 'react';
import {Button} from 'react-native';
import AppThemeContext from '../contexts/AppThemeContext';

const ButtonStyled = props => {
  const theme = useContext(AppThemeContext);
  return <Button {...props} color={theme.colors.primary} />;
};

export default ButtonStyled;
