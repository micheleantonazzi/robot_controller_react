import 'react-native-gesture-handler';
import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import MainScreen from './components/screens/MainScreen';
import RosConnectionScreen from './components/screens/RosConnectionScreen';
import {AppThemeDark} from './components/definitions/AppThemeDark';
import AppThemeContext from './components/contexts/AppThemeContext';
import RosSettingsContext from './components/contexts/RosSettingsContext';
import {RosSettings} from './components/definitions/RosSettings';

const Stack = createStackNavigator();

const App = () => {
  const theme = AppThemeDark;
  const rosSettings = RosSettings;

  return (
    <AppThemeContext.Provider value={theme}>
      <RosSettingsContext.Provider value={rosSettings}>
        <StatusBar backgroundColor={theme.colors.statusBar} />
        <NavigationContainer theme={theme}>
          <Stack.Navigator>
            <Stack.Screen name="Connection" component={RosConnectionScreen} />
            <Stack.Screen name="Robot Controller" component={MainScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </RosSettingsContext.Provider>
    </AppThemeContext.Provider>
  );
};

export default App;
