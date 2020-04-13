import 'react-native-gesture-handler';
import React from 'react';
import {StatusBar} from 'react-native';
import RosConnectionScreen from './components/screens/RosConnectionScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {AppThemeDark} from './components/definitions/AppThemeDark';
import AppThemeContext from './components/contexts/AppThemeContext';
import RosSettingsContext from './components/contexts/RosSettingsContext';
import {RosSettings} from './components/definitions/RosSettings';
import RobotControlScreen from './components/screens/RobotControlScreen';
import {createStackNavigator} from '@react-navigation/stack';
import {Strings} from './components/definitions/Strings';
import HeaderLeftStyled from './components/styledComponets/HeaderLeftStyled';
import DrawerContentStyled from './components/styledComponets/DrawerContentStyled';

// Navigators
const ModalStack = createStackNavigator();
const Drawer = createDrawerNavigator();
const RobotControllerStack = createStackNavigator();

// Get navigators
const getDrawerNavigator = () => (
  <Drawer.Navigator
    drawerType={'front'}
    drawerContent={props => <DrawerContentStyled {...props} />}>
    <Drawer.Screen
      name={Strings.robotControlScreenItemName}
      component={getRobotControllerNavigator}
    />
  </Drawer.Navigator>
);

const getRobotControllerNavigator = () => (
  <RobotControllerStack.Navigator>
    <RobotControllerStack.Screen
      name={Strings.robotControlScreen}
      component={RobotControlScreen}
      options={{
        title: 'Robot Controller',
        headerLeft: ({}) => <HeaderLeftStyled />,
      }}
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
          <ModalStack.Navigator mode="modal">
            <ModalStack.Screen
              name="Main"
              component={getDrawerNavigator}
              options={{headerShown: false}}
            />
            <ModalStack.Screen
              name={Strings.rosConnectionScreen}
              component={RosConnectionScreen}
              options={{headerShown: false}}
            />
          </ModalStack.Navigator>
        </NavigationContainer>
      </RosSettingsContext.Provider>
    </AppThemeContext.Provider>
  );
};

export default App;
