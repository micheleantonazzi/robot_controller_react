import 'react-native-gesture-handler';
import React from 'react';
import {StyleSheet, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import MainScreen from './components/screens/MainScreen';
import RosConnectionScreen from './components/screens/RosConnectionScreen';
import {AppThemeDark} from './components/themes/AppThemeDark';
import AppThemeContext from './components/contexts/AppThemeContext';

const Stack = createStackNavigator();

const App = () => {
  const theme = AppThemeDark;
  return (
    <AppThemeContext.Provider value={theme}>
      <StatusBar />
      <NavigationContainer theme={theme}>
        <Stack.Navigator>
          <Stack.Screen name="Connection" component={RosConnectionScreen} />
          <Stack.Screen name="Robot Controller" component={MainScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppThemeContext.Provider>
  );
};

export default App;
