import React from 'react';
import { AppRegistry } from 'react-native';
import {
  StackNavigator,
} from 'react-navigation';
import Login from './Login';
import MyCalendar from './MyCalendar';

const stack = {
  Login: { screen: Login },
  MyCalendar: { screen: MyCalendar },
};

const LoginStack = StackNavigator(
  stack,
  {
    headerMode: 'none',
  },
);

const sportiq = () => <LoginStack />;
export default sportiq;
AppRegistry.registerComponent('sportiq', () => sportiq);
