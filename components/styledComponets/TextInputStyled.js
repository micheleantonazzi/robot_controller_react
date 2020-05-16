import React, {useContext} from 'react';
import {TextInput} from 'react-native';
import AppThemeContext from '../contexts/AppThemeContext';

const TextInputStyled = props => {
  const theme = useContext(AppThemeContext);

  return (
    <TextInput
      {...props}
      style={{
        borderBottomColor: theme.colors.border,
        borderBottomWidth: 1,
        paddingBottom: 4,
        color: theme.colors.text,
        ...props.style,
      }}
    />
  );
};

export default TextInputStyled;
