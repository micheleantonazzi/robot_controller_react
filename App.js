import 'react-native-gesture-handler';
import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {AppThemeDark} from './components/definitions/AppThemeDark';
import AppThemeContext from './components/contexts/AppThemeContext';
import RosSettingsContext from './components/contexts/RosSettingsContext';
import {RosSettings} from './components/definitions/RosSettings';
import RobotControlScreen from './components/screens/RobotControlScreen';
import {createStackNavigator} from '@react-navigation/stack';

// Navigators
const Drawer = createDrawerNavigator();
const RobotControllerStack = createStackNavigator();

const getRobotControllerStackNavigator = () => (
  <RobotControllerStack.Navigator>
    <RobotControllerStack.Screen
      name={'RobotControllerScreen'}
      component={RobotControlScreen}
      options={{title: 'Robot Controller'}}
    />
  </RobotControllerStack.Navigator>
);

const App = () => {
  const theme = AppThemeDark;
  const rosSettings = RosSettings;

  return (
    <AppThemeContext.Provider value={theme}>
      <RosSettingsContext.Provider value={rosSettings}>
        <StatusBar backgroundColor={theme.colors.statusBar} />
        <NavigationContainer theme={theme}>
          <Drawer.Navigator>
            <Drawer.Screen
              name={'RobotControlScree'}
              component={getRobotControllerStackNavigator}
            />
          </Drawer.Navigator>
        </NavigationContainer>
      </RosSettingsContext.Provider>
    </AppThemeContext.Provider>
  );
};

export default App;
