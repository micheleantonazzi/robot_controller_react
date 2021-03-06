import React, {useContext} from 'react';
import AppThemeContext from '../contexts/AppThemeContext';
import {Autocomplete} from 'my-react-native-dropdown-autocomplete';

const AutocompleteStyled = props => {
  const theme = useContext(AppThemeContext);

  return (
    <Autocomplete
      {...props}
      inputStyle={{
        color: theme.colors.text,
        width: '100%',
        borderWidth: 0,
        borderColor: theme.colors.secondary,
        borderBottomWidth: 2,
        borderRadius: 0,
        justifyContent: 'center',
      }}
      scrollStyle={{
        backgroundColor: theme.colors.background,
        borderWidth: 0,
        borderRadius: 0,
        borderColor: theme.colors.secondary,
      }}
      listItemTextStyle={{color: 'white', fontSize: 15}}
      placeholder={''}
      highlightTextColor={theme.colors.secondary}
      firstLetterCapital={false}
      renderIcon={() => props.renderIcon(theme.colors.secondary)}
    />
  );
};

export default AutocompleteStyled;
