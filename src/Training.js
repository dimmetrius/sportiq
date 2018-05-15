/* eslint-disable no-underscore-dangle */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, COACH, TRAINEE } from './utils/constants';
import padStart from './utils/padStart';
import {
  getTrainingAsCoach,
  getTrainingAsTrainee,
  getFeedBackRequest,
  setTrainingDescription,
  addCoachTraining,
  calendarNavigate,
  addTraineeTraining,
} from './actions';

import ViewMore from './components/ViewMore';

const ROW_HEIGHT = 85;

class Training extends Component {
  static propTypes = {
    id: PropTypes.string,
    type: PropTypes.string,
    training: PropTypes.shape(),
    feedback: PropTypes.shape(),
    trainingDescriptionRequest: PropTypes.shape(),
    startTrainingRequest: PropTypes.func,
    startFeedBackRequest: PropTypes.func,
    startUpdateTrainingDescription: PropTypes.func,
    setTraining: PropTypes.func,
    goToFeedBack: PropTypes.func,
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
    const date = new Date(navigation.state.params.date);
    const day = padStart(date.getDate(), 2, '0');
    const month = padStart(date.getMonth() + 1, 2, '0');
    const year = date.getFullYear();
    const text = `Тренировка ${day}.${month}.${year}`;
    const title = text; // <Text style={{ color: 'black' }}> {text} </Text>;
    return {
      title,
      headerBackTitle: '',
      headerTruncatedBackTitle: '',
      headerTitleStyle: { color: 'black' },
      headerTintColor: colors.grassyGreen,
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      edit: false,
      trainingText: '',
    };
  }

  componentDidMount() {
    const { id, startTrainingRequest, startFeedBackRequest } = this.props;
    startTrainingRequest(id);
    startFeedBackRequest(id);
  }

  componentWillReceiveProps(nextProps) {
    const { setTraining, training, id } = this.props;
    const { trainingText } = this.state;
    if (
      this.props.trainingDescriptionRequest.processing === true &&
      nextProps.trainingDescriptionRequest.processing === false &&
      nextProps.trainingDescriptionRequest.ok === true
    ) {
      setTraining(id, { ...training, description: trainingText });
      this.setState({
        edit: false,
      });
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
    const { id, startUpdateTrainingDescription } = this.props;
    const { trainingText } = this.state;
    startUpdateTrainingDescription(id, trainingText);
    this.setState({
      edit: false,
    });
  };

  startEdit = () => {
    this.setState({
      edit: true,
      trainingText: this.getText(),
    });
  };

  checkBlur = () => {
    if (this.inputRef) { this.inputRef.blur(); }
  }

  renderMember = (member) => {
    const img = member.image.url;
    return (
      <View key={img} style={{ flex: 1, borderRadius: 4, marginTop: 5, marginBottom: 5, backgroundColor: '#ffffff' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', height: ROW_HEIGHT }}>
          <View
            style={{
              padding: 15,
              flexDirection: 'row',
              justifyContent: 'center',
              width: ROW_HEIGHT,
              height: ROW_HEIGHT,
            }}
          >
            <Image style={{ borderRadius: 4, width: ROW_HEIGHT - 30, height: ROW_HEIGHT - 30 }} source={{ uri: img }} />
          </View>
          <View style={{ flex: 1, flexDirection: 'row', height: ROW_HEIGHT }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                height: ROW_HEIGHT,
                alignItems: 'flex-start',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: 'bold',
                  marginBottom: 10,
                }}
              >
                {member.name}
              </Text>
              <Text>{member.memberGroupStatus === 'ACTIVE' ? 'Актив' : ''}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  renderCoach = (member) => {
    const img = member.image.url;
    return (
      <View key={img} style={{ flex: 1, borderRadius: 4, marginTop: 5, marginBottom: 5, backgroundColor: '#ffffff' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', height: ROW_HEIGHT }}>
          <View
            style={{
              padding: 15,
              flexDirection: 'row',
              justifyContent: 'center',
              width: ROW_HEIGHT,
              height: ROW_HEIGHT,
            }}
          >
            <Image style={{ borderRadius: 4, width: ROW_HEIGHT - 30, height: ROW_HEIGHT - 30 }} source={{ uri: img }} />
          </View>
          <View style={{ flex: 1, flexDirection: 'row', height: ROW_HEIGHT }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                height: ROW_HEIGHT,
                alignItems: 'flex-start',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: 'bold',
                  marginBottom: 10,
                }}
              >
                {member.name}
              </Text>
              <Text>тренер</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  render() {
    const { training, feedback, type, goToFeedBack, id } = this.props;
    const { edit } = this.state;
    const { result, coach, program, equipment } = feedback;
    const rating = Math.round((result + coach + program + equipment) * 10 / 4) / 10;
    const { club, group, trainees } = training;
    const members = (((trainees || {})._embedded || {}).trainees || []);
    return (
      <View style={{ flex: 1, flexDirection: 'column' }} onStartShouldSetResponder={this.checkBlur}>
        <ScrollView>
          <View style={{ flex: 1, flexDirection: 'column', marginBottom: 50 }}>
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
                  <Text style={styles.clubGroup}> Группа: </Text>
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
                        backgroundColor: group.color,
                      }}
                    />
                    <Text style={styles.clubGroupValue} numberOfLines={1}>
                      {group.name}
                    </Text>
                  </View>
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
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: 'bold',
                    marginBottom: 11,
                  }}
                >
                  ПЛАН ЗАНЯТИЯ
                </Text>
                {type === COACH ?
                  <TouchableOpacity
                    onPress={edit ? this.stopEdit : this.startEdit}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        color: colors.grassyGreen,
                        marginBottom: 11,
                      }}
                    >
                      {edit ? 'Сохранить' : 'Изменить'}
                    </Text>
                  </TouchableOpacity> : <View />
                }

              </View>
              {edit ? (
                <TextInput
                  ref={this.setInputRef}
                  multiline
                  style={{ padding: 2, borderColor: colors.grassyGreen, borderRadius: 4, borderWidth: 1 }}
                  onChangeText={text => this.setState({ trainingText: text })}
                  value={this.state.trainingText}
                />
              ) : (
                <ViewMore
                  renderViewMore={onPress => (
                    <Text style={styles.moreLess} onPress={onPress}>
                      Показать больше
                    </Text>
                  )}
                  renderViewLess={onPress => (
                    <Text style={styles.moreLess} onPress={onPress}>
                      Показать меньше
                    </Text>
                  )}
                >
                  <Text style={{ fontSize: 15 }}> {this.getText()} </Text>
                </ViewMore>
              )}
            </View>
            <View
              style={{
                marginHorizontal: 30,
              }}
            >
              {(training.coaches || []).map(trainer => this.renderCoach(trainer))}
            </View>
            {type === TRAINEE ? (
              <View style={{ flex: 1, flexDirection: 'column', marginHorizontal: 30 }}>
                <View
                  style={{
                    marginBottom: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: 'bold',
                      marginBottom: 18,
                    }}
                  >
                    ОЦЕНКА ТРЕНИРОВКИ
                  </Text>
                </View>
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
                        marginRight: 10,
                      }}
                    >
                      {rating ? `${rating}` : 'Вы пока не оценили тренировку'}
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
            ) : null}
          </View>
          <View style={{ flex: 1, flexDirection: 'column', marginHorizontal: 30 }}>
            <Text
              style={{
                fontSize: 15,
                fontWeight: 'bold',
                marginBottom: 18,
              }}
            >
              { `УЧАСТНИКИ ГРУППЫ (${members.length.toString()})`}
            </Text>
            <View>
              {members.map(member => this.renderMember(member))}
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
  const { id, type } = ownProps.navigation.state.params;
  const trainings = type === COACH ? state.coachTrainings : state.traineeTrainings;
  const training = trainings[id];
  const feedback = state.feedbacks[id];
  const trainingDescriptionRequest = state.setTrainingDescription;
  return {
    id,
    type,
    training,
    feedback,
    trainingDescriptionRequest,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { type } = ownProps.navigation.state.params;
  const startRequestAsCoach = id => dispatch(getTrainingAsCoach.start({ id }));
  const startRequestAsTrainee = id => dispatch(getTrainingAsTrainee.start({ id }));
  const startTrainingRequest = type === COACH ? startRequestAsCoach : startRequestAsTrainee;
  const startFeedBackRequest = id => dispatch(getFeedBackRequest.start({ id }));
  const startUpdateTrainingDescription = (id, description) =>
    dispatch(setTrainingDescription.start({ id, description }));
  const setTraining = (id, training) => dispatch(type === COACH ?
    addCoachTraining(id, training) : addTraineeTraining(id, training));
  return {
    startTrainingRequest,
    startFeedBackRequest,
    startUpdateTrainingDescription,
    goToFeedBack: id => dispatch(calendarNavigate('FeedBack', { id })),
    setTraining,
    // goToFeedBack: params => dispatch(rootNavigate('FeedBack', params)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Training);
