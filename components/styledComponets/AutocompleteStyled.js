import React, {useContext} from 'react';
import AppThemeContext from '../contexts/AppThemeContext';
import {Autocomplete} from 'my-react-native-dropdown-autocomplete';

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
      scrollStyle={{
        backgroundColor: theme.colors.background,
        borderWidth: 1,
        borderRadius: 0,
        borderColor: theme.colors.secondary,
      }}
      listItemTextStyle={{color: 'white', fontSize: 15}}
      inputContainerStyle={{padding: 0}}
      placeholder={''}
      highlightTextColor={theme.colors.secondary}
      firstLetterCapital={false}
    />
  );
};

export default AutocompleteStyled;
