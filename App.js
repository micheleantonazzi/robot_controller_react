import 'react-native-gesture-handler';
import React from 'react';
import {StyleSheet, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import MainScreen from './components/screens/MainScreen';
import RosConnectionModal from './components/screens/RosConnectionModal';

const Stack = createStackNavigator();

const App = () => {
  return (
    <>
      <StatusBar barStyle={'dark-content'} />
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Connection" component={RosConnectionModal} />
          <Stack.Screen name="Robot Controller" component={MainScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

const styles = StyleSheet.create({});

export default App;
