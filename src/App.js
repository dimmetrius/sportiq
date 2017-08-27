import React, { Component } from "react";
import { AppRegistry } from 'react-native';
import {
  StackNavigator,
} from 'react-navigation';
import Login from './Login';
import MyCalendar from './MyCalendar';

const stack = {
  Login: { screen: Login },
  MyCalendar: { screen: MyCalendar },
}

const LoginStack = StackNavigator(
  stack,
  {
    headerMode: 'none',
  },
);

export default class sportiq extends Component {
  render() {
    return <LoginStack/>
  }
}
AppRegistry.registerComponent("sportiq", () => sportiq);
