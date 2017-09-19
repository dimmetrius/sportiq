import React from 'react';
import { TabNavigator } from 'react-navigation';
import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MyCalendar from './MyCalendar';
import Subscriptions from './Subscriptions';

const isIos = Platform.OS === 'ios';

const routes = {
  calendar: {
    screen: MyCalendar,
    navigationOptions: {
      tabBarLabel: 'Календарь',
      // eslint-disable-next-line react/prop-types
      tabBarIcon: ({ tintColor }) => <Icon size={isIos ? 20 : 15} name="calendar" color={tintColor} />,
    },
  },
  subscriptions: {
    screen: Subscriptions,
    navigationOptions: {
      tabBarLabel: 'Абонементы',
      // eslint-disable-next-line react/prop-types
      tabBarIcon: ({ tintColor }) => <Icon size={isIos ? 20 : 15} name="list" color={tintColor} />,
    },
  },
};

const config = {
  tabBarPosition: 'bottom',
  initialRouteName: 'calendar',
  tabBarOptions: {
    showIcon: true,
    activeTintColor: 'blue',
    inactiveTintColor: 'gray',
    style: {
      backgroundColor: 'white',
      // bottom: isIos ? 0 : 25,
    },
    tabStyle: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    labelStyle: {
      fontSize: 9,
    },
  },
};

const TabsNavigator = TabNavigator(routes, config);

export default TabsNavigator;
