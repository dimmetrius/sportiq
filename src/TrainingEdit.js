/* eslint-disable no-underscore-dangle */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { colors } from './utils/constants';
import padStart from './utils/padStart';
import {
  getTrainingAsCoach,
  setTrainingDescription,
  calendarNavigate,
} from './actions';

class TrainingEdit extends Component {
  static propTypes = {
    id: PropTypes.string,
    training: PropTypes.shape(),
    trainingDescriptionRequest: PropTypes.shape(),
    goBack: PropTypes.func,
    startUpdateTrainingDescription: PropTypes.func,
    setParams: PropTypes.func,
  };

  static defaultProps = {
    id: '',
    training: {
      club: {},
      group: {},
    },
    feedback: {
      result: 0,
      coach: 0,
      program: 0,
      equipment: 0,
      count: 0,
      rating: 0,
    },
  };

  static navigationOptions = ({ navigation }) => {
    const title = 'План тренировки';
    const { onCancel = () => null, onSave = () => null } = navigation.state.params;
    return {
      title,
      headerLeft: (
        <Text
          style={{
            fontSize: 17,
            color: 'red',
            padding: 10 }}
          onPress={() => onCancel()}
        >
          Отмена
        </Text>
      ),
      headerRight: (
        <Text
          style={{
            fontSize: 17,
            color: colors.grassyGreen,
            padding: 10 }}
          onPress={() => onSave()}
        >
          Готово
        </Text>
      ),
    };
  };

  constructor(props) {
    super(props);
    const { training } = props;
    this.state = {
      trainingText: training.description,
    };
  }

  componentDidMount() {
    this.props.setParams({
      onCancel: () => this.props.goBack(),
      onSave: () => this.stopEdit(),
    });
  }

  componentWillReceiveProps(nextProps) {
    const { goBack, trainingDescriptionRequest } = this.props;
    if (
      trainingDescriptionRequest.processing === true &&
      nextProps.trainingDescriptionRequest.processing === false &&
      nextProps.trainingDescriptionRequest.ok === true
    ) {
      goBack();
    }
  }

  getTitle() {
    return 'Тренировка';
  }

  getText = () => {
    const { training } = this.props;
    return training.description;
  };

  setInputRef = (ref) => {
    this.inputRef = ref;
  }

  stopEdit = () => {
    const { id, startUpdateTrainingDescription, trainingDescriptionRequest } = this.props;
    const { trainingText } = this.state;
    if (trainingDescriptionRequest.processing === true) return;
    startUpdateTrainingDescription(id, trainingText);
  };

  checkBlur = () => {
    if (this.inputRef) { this.inputRef.blur(); }
  }

  render() {
    const { training } = this.props;
    const { club, group, start } = training;

    const date = new Date(start);
    const day = padStart(date.getDate(), 2, '0');
    const month = padStart(date.getMonth() + 1, 2, '0');
    const year = date.getFullYear();
    const dateText = `${day}.${month}.${year}`;

    return (
      <View style={{ flex: 1, flexDirection: 'column' }} onStartShouldSetResponder={this.checkBlur}>
        <ScrollView>
          <View style={{ flex: 1, flexDirection: 'column', marginTop: 20, marginBottom: 50 }}>
            <View
              style={{
                flex: 1,
                height: 92,
                marginHorizontal: 30,
                borderBottomWidth: 1,
                borderBottomColor: colors.inputUnder,
              }}
            >
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                  <Text style={[styles.clubGroup, { marginBottom: 12 }]}> Клуб: </Text>
                  <Text style={[styles.clubGroup, { marginBottom: 12 }]}> Группа: </Text>
                  <Text style={styles.clubGroup}> Дата: </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    marginLeft: 20,
                  }}
                >
                  <Text style={[styles.clubGroupValue, { marginBottom: 12 }]} numberOfLines={1}>
                    {club.name}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View
                      style={{
                        height: 10,
                        width: 10,
                        borderRadius: 5,
                        marginRight: 10,
                        marginBottom: 12,
                        backgroundColor: group.color,
                      }}
                    />
                    <Text style={[styles.clubGroupValue, { marginBottom: 12 }]} numberOfLines={1}>
                      {group.name}
                    </Text>
                  </View>
                  <Text style={styles.clubGroupValue} numberOfLines={1}>
                    {dateText}
                  </Text>
                </View>
                <View style={{
                  flexDirection: 'column',
                  justifyContent: 'center',
                  width: 45 }}
                />
              </View>
            </View>
            <View
              style={{
                margin: 30,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
                <Text
                  style={{
                    fontSize: 12,
                    marginBottom: 11,
                    color: colors.warmGrey,
                  }}
                >
                  План занятия
                </Text>
              </View>
              <TextInput
                ref={this.setInputRef}
                autoFocus
                multiline
                style={{ padding: 2, borderRadius: 4 }}
                onChangeText={text => this.setState({ trainingText: text })}
                value={this.state.trainingText}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  moreLess: {
    fontSize: 15,
    color: colors.grassyGreen,
  },
  clubGroup: {
    textAlign: 'left',
    fontSize: 15,
  },
  clubGroupValue: {
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps.navigation.state.params;
  const trainings = state.coachTrainings;
  const training = trainings[id];
  const feedback = state.feedbacks[id];
  const trainingDescriptionRequest = state.setTrainingDescription;
  return {
    id,
    training,
    feedback,
    trainingDescriptionRequest,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const startRequestAsCoach = id => dispatch(getTrainingAsCoach.start({ id }));
  const startTrainingRequest = startRequestAsCoach;
  const startUpdateTrainingDescription = (id, description) =>
    dispatch(setTrainingDescription.start({ id, description }));
  return {
    startTrainingRequest,
    startUpdateTrainingDescription,
    goBack: () => dispatch(calendarNavigate('<=')),
    setParams: params => ownProps.navigation.setParams({ ...ownProps.navigation.state.params, ...params }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TrainingEdit);
