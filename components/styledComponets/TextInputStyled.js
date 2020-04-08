import React, {useContext} from 'react';
import {TextInput} from 'react-native';
import AppThemeContext from '../contexts/AppThemeContext';

const TextInputStyled = props => {
  const theme = useContext(AppThemeContext);

  return (
    <TextInput
      style={{
        borderColor: theme.colors.border,
        color: theme.colors.inputText,
        ...props.style,
      }}
      value={props.value}
      onChangeText={props.onChangeText}
    />
  );
};

export default TextInputStyled;
