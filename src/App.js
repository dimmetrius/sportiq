import React, { Component } from 'react';
import { AppRegistry, View, AsyncStorage, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import Login from './Login';
import TabsNavigator from './TabsNavigator';
import OAuthView from './OAuthView';
import store from './store';
import { rootNavService } from './utils/NavigationService';
import Training from './Training';

const stack = {
  // Training: { screen: Training },
  Login: { screen: Login, navigationOptions: { header: null } },
  OAuthView: { screen: OAuthView, navigationOptions: { title: <Text> Авторизация </Text> } },
  TabsNavigator: { screen: TabsNavigator, navigationOptions: { header: null, gesturesEnabled: false } },
};

const RootStack = StackNavigator(stack, { headerMode: 'float' });

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
      <RootStack ref={rootNavService.setNavigator} />
    </Provider>
  );

  render() {
    return this.state.persisted ? this.renderContent() : this.renderLoad();
  }
}

export default Sportiq;
AppRegistry.registerComponent('sportiq', () => Sportiq);
