import React from 'react';
import { DrawerNavigator, StackNavigator } from 'react-navigation';
import { Platform, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import _QrCode from './QrCode';
import _Calendar from './Calendar';
import _Subscriptions from './Subscriptions';

const isIos = Platform.OS === 'ios';

// eslint-disable-next-line react/prop-types
const MenuButton = ({ navigation }) => (
  <View>
    <TouchableOpacity onPress={() => navigation.navigate('DrawerOpen')}>
      <Icon name="bars" style={{ color: 'black', padding: 10, marginLeft: 10, fontSize: 20 }} />
    </TouchableOpacity>
  </View>
);

const Calendar = StackNavigator({
  MyCalendar: { screen: _Calendar,
    navigationOptions: ({ navigation }) => ({
      title: 'Календарь',
      drawerLabel: 'Календарь',
      headerLeft: <MenuButton navigation={navigation} />,
      // eslint-disable-next-line react/prop-types
      drawerIcon: ({ tintColor }) => <Icon size={isIos ? 20 : 15} name="calendar" color={tintColor} />,
    }),
  },
});

const Subscriptions = StackNavigator({
  Subscriptions: { screen: _Subscriptions,
    navigationOptions: ({ navigation }) => ({
      title: 'Абонементы',
      drawerLabel: 'Абонементы',
      headerLeft: <MenuButton navigation={navigation} />,
      // eslint-disable-next-line react/prop-types
      drawerIcon: ({ tintColor }) => <Icon size={isIos ? 20 : 15} name="list" color={tintColor} />,
    }),
  },
});

const routes = {
  calendar: {
    screen: Calendar,
    navigationOptions: {
      // eslint-disable-next-line react/prop-types
      drawerIcon: ({ tintColor }) => <Icon size={isIos ? 20 : 15} name="calendar" color={tintColor} />,
    },
  },
  subscriptions: {
    screen: Subscriptions,
    navigationOptions: {
      // eslint-disable-next-line react/prop-types
      drawerIcon: ({ tintColor }) => <Icon size={isIos ? 20 : 15} name="list" color={tintColor} />,
    },
  },
};

const DrawersNavigator = DrawerNavigator(routes);

export default DrawersNavigator;
