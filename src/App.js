import React, { Component } from 'react';
import { AppRegistry, View, AsyncStorage, Text } from 'react-native';
import {
  StackNavigator,
} from 'react-navigation';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import Login from './Login';
import MyCalendar from './MyCalendar';
import OAuthView from './OAuthView';
import Event from './Event';
import store from './store';

const stack = {
  MyCalendar: { screen: MyCalendar, navigationOptions: { gesturesEnabled: false } },
  OAuthView: { screen: OAuthView },
  Event: { screen: Event },
  //
  Login: { screen: Login },
};

const LoginStack = StackNavigator(
  stack,
  {
    headerMode: 'none',
  },
);

class Sportiq extends Component {
  constructor() {
    super();
    this.state = {
      regidrated: false,
    };
  }

  componentDidMount() {
    persistStore(store, { storage: AsyncStorage }, () => {
      this.setState({
        persisted: true,
      });
    });
  }

  renderLoad = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text> Загрузка... </Text>
    </View>
  );

  renderContent = () => (
    <Provider store={store}>
      <LoginStack />
    </Provider>
  )

  render() {
    return this.state.persisted ? this.renderContent() : this.renderLoad();
  }
}

export default Sportiq;
AppRegistry.registerComponent('sportiq', () => Sportiq);
