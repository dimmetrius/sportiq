import React from 'react';
import { TabNavigator, StackNavigator /* , TabBarBottom */ } from 'react-navigation';
import { Platform } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import MyCalendar from './Calendar';
import Subscriptions from './Subscriptions';
import Clubs from './Clubs';
import Club from './Club';
import QrCode from './QrCode';
import FeedBack from './FeedBack';
import Members from './Members';
import { colors } from './utils/constants';

const isIos = Platform.OS === 'ios';
const iconSize = isIos ? 30 : 15;

const CalendarStack = StackNavigator({
  Calendar: { screen: MyCalendar, navigationOptions: { title: 'Тренировки' } },
  // QrCode: { screen: QrCode, navigationOptions: { headerLeft: <Text> 0 </Text> } },
  QrCode: { screen: QrCode },
  FeedBack: { screen: FeedBack, navigationOptions: { title: 'Отзыв на тренировку' } },
  Members: { screen: Members },
});

const ClubsStack = StackNavigator({
  Clubs: { screen: Clubs },
  QrCode: { screen: QrCode },
  Club: { screen: Club },
});

const initroutes = {
  calendar: {
    screen: CalendarStack,
    navigationOptions: {
      tabBarLabel: 'Календарь',
      // eslint-disable-next-line react/prop-types
      tabBarIcon: ({ tintColor }) => <Ionicon size={iconSize} name="md-trending-up" color={tintColor} />,
    },
  },
  subscriptions: {
    screen: Subscriptions,
    navigationOptions: {
      tabBarLabel: 'Абонементы',
      // eslint-disable-next-line react/prop-types
      tabBarIcon: ({ tintColor }) => <Ionicon size={iconSize} name="ios-card-outline" color={tintColor} />,
    },
  },
  clubs: {
    screen: ClubsStack,
    navigationOptions: {
      tabBarLabel: 'Клубы',
      // eslint-disable-next-line react/prop-types
      tabBarIcon: ({ tintColor }) => <Ionicon size={iconSize} name="ios-people-outline" color={tintColor} />,
    },
  },
  other: {
    screen: Clubs,
    navigationOptions: {
      tabBarLabel: 'Еще',
      // eslint-disable-next-line react/prop-types
      tabBarIcon: ({ tintColor }) => <Ionicon size={iconSize} name="ios-more-outline" color={tintColor} />,
    },
  },
};

/*
const tabBarComponent = ({ navigation, ...rest }) =>
  (<TabBarBottom
    {...rest}
    navigation={{
      ...navigation,
      state: { ...navigation.state, routes: navigation.state.routes.filter(r => true) },
    }}
  />);
*/

const config = {
  tabBarPosition: 'bottom',
  initialRouteName: 'calendar',
  tabBarOptions: {
    showIcon: true,
    activeTintColor: colors.grassyGreen,
    inactiveTintColor: 'gray',
    style: {
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 10,
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

const TabsNavigator = TabNavigator(initroutes, config);

export default TabsNavigator;
