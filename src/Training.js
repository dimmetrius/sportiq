/* eslint-disable no-underscore-dangle */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, Image, Dimensions, Switch } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, TRAINEE, COACH } from './utils/constants';
import { getTrainingAsCoach, getTrainingAsTrainee, calendarNavigate } from './actions';

import ViewMoreText from './components/ViewMoreText';

class Training extends Component {
  static propTypes = {
    id: PropTypes.string,
    type: PropTypes.string,
    trainings: PropTypes.shape(),
    training: PropTypes.shape(),
    startRequest: PropTypes.func,
  };

  static defaultProps = {
    id: '',
    training: {
      club: {},
      group: {},
    },
  };

  componentDidMount() {
    const { id, startRequest } = this.props;
    startRequest(id);
  }

  getText = () => {
    const { training } = this.props;
    return training.description;
  };

  render() {
    const { training, goToFeedBack, id } = this.props;
    const { club, group } = training;
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
                  <Text numberOfLines={1}> {club.name} </Text>
                  <Text numberOfLines={1}> {group.name}</Text>
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
                  onPress={() => goToFeedBack(id)}
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

const mapStateToProps = (state, ownProps) => {
  const { id, type } = ownProps.navigation.state.params;
  const trainings = type === COACH ? state.coachTrainings : state.traineeTrainings;
  const training = trainings[id];
  return {
    id,
    type,
    trainings,
    training,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { type } = ownProps.navigation.state.params;
  const startRequestAsCoach = id => dispatch(getTrainingAsCoach.start({ id }));
  const startRequestAsTrainee = id => dispatch(getTrainingAsTrainee.start({ id }));
  const startRequest = type === COACH ? startRequestAsCoach : startRequestAsTrainee;
  return {
    startRequest,
    goToFeedBack: id => dispatch(calendarNavigate('FeedBack', { id })),
    // goToFeedBack: params => dispatch(rootNavigate('FeedBack', params)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Training);
