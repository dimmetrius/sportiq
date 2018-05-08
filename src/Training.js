/* eslint-disable no-underscore-dangle */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, Image, Dimensions, Switch } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from './utils/constants';

import ViewMoreText from './components/ViewMoreText';

class Training extends Component {
  static propTypes = {};

  componentDidMount() {}

  getText = () => {
    const a = [];

    for (let i = 0; i < 6; i++) {
      a.push('999999999999999999999999999999999999999999999999999999999999999999999999999');
    }

    return a.join('');
  };

  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <ScrollView>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <View
              style={{
                flex: 1,
                height: 92,
                marginHorizontal: 30,
                // backgroundColor: 'red',
                borderBottomWidth: 1,
                borderBottomColor: colors.inputUnder,
              }}
            >
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                  <Text> Клуб: </Text>
                  <Text> Группа: </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    maxWidth: '50%',
                  }}
                >
                  <Text numberOfLines={1}> Berunner </Text>
                  <Text numberOfLines={1}> Вечерняя группа Вечерняя группа</Text>
                </View>
                <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                  <TouchableOpacity
                    style={{
                      width: 45,
                      height: 45,
                      borderRadius: 4,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'white',
                      shadowColor: 'rgba(0, 0, 0, 0.1)',
                      shadowOffset: {
                        width: 0,
                        height: 0.5,
                      },
                      shadowRadius: 24.5,
                      shadowOpacity: 1,
                      borderStyle: 'solid',
                      borderWidth: 0.5,
                      borderColor: colors.inputUnder,
                    }}
                    onPress={() => null}
                  >
                    <MaterialIcon name="qrcode-scan" size={25} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View
              style={{
                margin: 30,
              }}
            >
              <ViewMoreText
                numberOfLines={4}
                renderViewMore={onPress => <Text onPress={onPress}>Показать больше</Text>}
                renderViewLess={onPress => <Text onPress={onPress}>Показать меньше</Text>}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: 'bold',
                  }}
                >
                  ПЛАН ЗАНЯТИЯ
                </Text>
                <Text> {this.getText()} </Text>
              </ViewMoreText>
            </View>
            <View style={{ flex: 1, flexDirection: 'column', marginHorizontal: 30 }}>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    maxWidth: '70%',
                  }}
                >
                  <Text
                    numberOfLines={2}
                    style={{
                      fontSize: 15,
                      fontWeight: 'bold',
                      textAlign: 'left',
                    }}
                  >
                    Вы пока не оценили тренировку
                  </Text>
                </View>
                <TouchableOpacity
                  style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: colors.grassyGreen,
                    height: 50,
                    width: 125,
                    borderRadius: 4,
                    shadowColor: 'rgba(43, 193, 0, 0.6)',
                    shadowOffset: {
                      width: 0,
                      height: 7.5,
                    },
                    shadowRadius: 17.5,
                    shadowOpacity: 1,
                  }}
                  onPress={() => alert('Оценить')}
                >
                  <Text style={{ color: '#ffffff' }}>Оценить</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default Training;
