import React, {useContext} from 'react';
import AppThemeContext from '../contexts/AppThemeContext';
import {Autocomplete} from 'react-native-dropdown-autocomplete';

const AutocompleteStyled = props => {
  const theme = useContext(AppThemeContext);

  return (
    <Autocomplete
      {...props}
      inputStyle={{
        color: theme.colors.inputText,
        width: '100%',
        borderWidth: 0,
        borderColor: theme.colors.secondary,
        borderBottomWidth: 2,
        borderRadius: 0,
        justifyContent: 'center',
      }}
      inputContainerStyle={{padding: 0}}
      placeholder=""
      highlightTextColor={theme.colors.secondary}
    />
  );
};

export default AutocompleteStyled;
