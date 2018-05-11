/* eslint-disable no-underscore-dangle */

import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import ApiRequest from './utils/ApiRequest';
import sport from './icons/sport';

const { width } = Dimensions.get('window');
const isIos = Platform.OS === 'ios';

class Subscriptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      subscriptions: [],
    };
  }

  componentDidMount() {
    this.refreshSubscriptions();
  }

  refreshSubscriptions = () => {
    ApiRequest.getSubscriptions().then((data) => {
      const newState = {
        ...this.state,
        subscriptions: data,
        loading: false,
      };
      this.setState(newState);
    });
  }

  renderSubscription = (subscription) => {
    const myWidth = width - 20;
    return (
      <View
        key={subscription.group.id}
        style={{
          width: myWidth,
          flexDirection: 'column',
          flex: 1,
          marginLeft: 10,
          marginRight: 10,
          marginTop: 5,
          marginBottom: 5,
          backgroundColor: '#ffffff',
          borderColor: 'gray',
          borderRadius: 10,
          borderWidth: 1,
        }}
      >
        <View style={{
          padding: 5,
          justifyContent: 'center',
          alignItems: 'center',
          borderBottomColor: 'gray',
          borderBottomWidth: 1,
        }}
        >
          <Text style={{ fontSize: 15, fontWeight: 'bold' }}> {subscription.club.name} </Text>
          <Text> {subscription.group.name} </Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={{
            padding: 5,
            flex: 1,
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
          }}
          >
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Начало:</Text>
              <Text style={{ fontSize: 15 }}> {subscription.start}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Конец:</Text>
              <Text style={{ fontSize: 15 }}> {subscription.end}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Всего занятий:</Text>
              <Text style={{ fontSize: 15 }}> {subscription.paidTrainings}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Осталось:</Text>
              <Text style={{ fontSize: 15 }}> {subscription.remainingTrainings}</Text>
            </View>
          </View>
          <View style={{
            padding: 5,
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
                width: 40,
                height: 40,
                backgroundColor: subscription.group.color,
              }}
              >
                <Text style={{ fontSize: 24, fontFamily: 'sports-48-x-48' }}>
                  {sport[subscription.group.activities[0].className] || ''}
                </Text>
              </View>
            </View>
            <Text style={{ fontSize: 30 }}>{subscription.percentageOfCompletion}%</Text>
          </View>
        </View>

      </View>
    );
  }

  render() {
    const { subscriptions } = this.state;

    return (
      <View style={{ marginTop: isIos ? 20 : 0, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {
          subscriptions.length > 0 ?
            <ScrollView>
              <View style={{ flex: 1, flexDirection: 'column' }}>
                {subscriptions.map(subscription => this.renderSubscription(subscription))}
              </View>
            </ScrollView>
            :
            <Text> Нет подписок </Text>
        }
      </View>
    );
  }
}

export default Subscriptions;
