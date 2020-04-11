import 'react-native-gesture-handler';
import React from 'react';
import {StatusBar, View, Text, Button} from 'react-native';
import RosConnectionScreen from './components/screens/RosConnectionScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {AppThemeDark} from './components/definitions/AppThemeDark';
import AppThemeContext from './components/contexts/AppThemeContext';
import RosSettingsContext from './components/contexts/RosSettingsContext';
import {RosSettings} from './components/definitions/RosSettings';
import RobotControlScreen from './components/screens/RobotControlScreen';
import {createStackNavigator} from '@react-navigation/stack';

// Navigators
const ModalStack = createStackNavigator();
const Drawer = createDrawerNavigator();
const RobotControllerStack = createStackNavigator();

// Get navigators
function ModalScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 30 }}>This is a modal!</Text>
      <Button onPress={() => navigation.goBack()} title="Dismiss" />
    </View>
  );
}
const getModalNavigatorWithInnerNavigator = innerNavigator => (
  <ModalStack.Navigator mode="modal">
    <ModalStack.Screen
      name="Main"
      component={innerNavigator}
      options={{ headerShown: false }}
    />
    <ModalStack.Screen
      name="RosConnectionModal"
      component={ModalScreen}
    />
  </ModalStack.Navigator>
);

const getRobotControllerNavigator = () => (
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
              component={() => getModalNavigatorWithInnerNavigator(getRobotControllerNavigator)}
            />
          </Drawer.Navigator>
        </NavigationContainer>
      </RosSettingsContext.Provider>
    </AppThemeContext.Provider>
  );
};

export default App;
