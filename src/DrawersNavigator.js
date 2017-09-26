import React from 'react';
import { DrawerNavigator } from 'react-navigation';
import { Platform, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MyCalendar from './MyCalendar';
import Subscriptions from './Subscriptions';

const isIos = Platform.OS === 'ios';

const routes = {
  calendar: {
    screen: MyCalendar,
    navigationOptions: {
      title: 'Календарь',
      drawerLabel: 'Календарь',
      headerLeft: <Text> Left </Text>,
      // eslint-disable-next-line react/prop-types
      drawerIcon: ({ tintColor }) => <Icon size={isIos ? 20 : 15} name="calendar" color={tintColor} />,
    },
  },
  subscriptions: {
    screen: Subscriptions,
    navigationOptions: {
      drawerLabel: 'Абонементы',
      // eslint-disable-next-line react/prop-types
      drawerIcon: ({ tintColor }) => <Icon size={isIos ? 20 : 15} name="list" color={tintColor} />,
    },
  },
};

const DrawersNavigator = DrawerNavigator(routes);

export default DrawersNavigator;
