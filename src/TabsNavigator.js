import React from 'react';
import PropTypes from 'prop-types';
import { TabNavigator, StackNavigator, TabBarBottom } from 'react-navigation';
import { Platform, Text, View } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import MyCalendar from './Calendar';
import Subscriptions from './Subscriptions';
import Clubs from './Clubs';
import Club from './Club';
import QrCode from './QrCode';
import FeedBack from './FeedBack';
import Members from './Members';
import Training from './Training';
import { colors } from './utils/constants';
import {
  calendarNavService,
  tabsNavService,
  subscriptionsNavService,
  clubsNavService,
} from './utils/NavigationService';
import store from './store';
import { otherPress } from './actions';

const isIos = Platform.OS === 'ios';
const iconSize = isIos ? 30 : 15;

const CalendarStack = StackNavigator({
  Calendar: { screen: MyCalendar, navigationOptions: { title: 'Тренировки' } },
  // QrCode: { screen: QrCode, navigationOptions: { headerLeft: <Text> 0 </Text> } },
  QrCode: { screen: QrCode },
  Training: { screen: Training },
  FeedBack: { screen: FeedBack },
  Members: {
    screen: Members,
    navigationOptions: {
      header: (
        <View
          style={{
            height: 80,
            backgroundColor: 'white',
          }}
        >
          <Text>This is CustomHeader</Text>
        </View>
      ),
    },
  },
});

const ClubsStack = StackNavigator({
  Clubs: { screen: Clubs },
  QrCode: { screen: QrCode },
  Club: { screen: Club },
});

const initroutes = {
  calendar: {
    screen: (...props) => <CalendarStack {...props} ref={calendarNavService.setNavigator} />,
    navigationOptions: {
      tabBarLabel: 'Календарь',
      // eslint-disable-next-line react/prop-types
      tabBarIcon: ({ tintColor }) => <Ionicon size={iconSize} name="md-trending-up" color={tintColor} />,
    },
  },
  subscriptions: {
    screen: (...props) => <Subscriptions {...props} ref={subscriptionsNavService.setNavigator} />,
    navigationOptions: {
      tabBarLabel: 'Абонементы',
      // eslint-disable-next-line react/prop-types
      tabBarIcon: ({ tintColor }) => <Ionicon size={iconSize} name="ios-card-outline" color={tintColor} />,
    },
  },
  clubs: {
    screen: (...props) => <ClubsStack {...props} ref={clubsNavService.setNavigator} />,
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

const tabC = ({ jumpToIndex, ...props /* , navigation */ }) => (
  <TabBarBottom
    {...props}
    jumpToIndex={(index) => {
      if (index === 3) {
        // showAlert(JSON.stringify(props, null, 2));
        // console.log('clubsNavService', clubsNavService.config);
        store.dispatch(otherPress);
      } else {
        jumpToIndex(index);
      }
    }}
  />
);

tabC.propTypes = {
  jumpToIndex: PropTypes.func.isRequired,
};

const config = {
  tabBarPosition: 'bottom',
  initialRouteName: 'calendar',
  tabBarComponent: tabC,
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

export default (...props) => <TabsNavigator {...props} ref={tabsNavService.setNavigator} />;
