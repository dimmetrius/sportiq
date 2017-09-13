import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Stars from './components/Stars';
import ApiRequest from './utils/ApiRequest';

const rateSize = 50;
class FeedBack extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
      dispatch: PropTypes.func.isRequired,
      state: PropTypes.shape(),
    }),
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      result: 0,
      coach: 0,
      program: 0,
      equipment: 0,
      count: 0,
      rating: 0,
    };
  }

  componentDidMount() {
    ApiRequest.getFeedback(this.props.navigation.state.params.id).then((data) => {
      const newState = {
        ...this.state,
        ...data,
        loading: false,
      };
      console.log(newState);
      this.setState(newState);
    });
  }

  saveResult = () => {
    const id = this.props.navigation.state.params.id;
    const state = this.state;
    const data = {
      result: state.result,
      coach: state.coach,
      program: state.program,
      equipment: state.equipment,
    };
    this.setState({
      loading: true,
    });
    ApiRequest.sendFeedback(id, JSON.stringify(data)).then(() => {
      this.props.navigation.dispatch(NavigationActions.back());
    });
  }

  render() {
    const { navigation } = this.props;
    const { loading, result, coach, program, equipment } = this.state;
    return (
      <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#ffffff' }}>
        <View style={{ marginTop: 20, height: 40, alignItems: 'flex-start', justifyContent: 'center' }}>
          <TouchableOpacity
            onPress={() => {
              navigation.dispatch(NavigationActions.back());
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginLeft: 10 }}>
              <Icon name="chevron-left" size={20} color="black" />
              <Text> Back </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Отзыв на тренировку</Text>
          <Text style={{ marginTop: 15 }}>удовлетворенность результатом</Text>
          <Stars
            isActive
            rateMax={5}
            isHalfStarEnabled
            onStarPress={rating => this.setState({ result: rating })}
            rate={result}
            size={rateSize}
            color={'orange'}
            rounding={'down'}
          />
          <Text style={{ marginTop: 15 }}>работа тренера</Text>
          <Stars
            isActive
            rateMax={5}
            isHalfStarEnabled
            onStarPress={rating => this.setState({ coach: rating })}
            rate={coach}
            size={rateSize}
            color={'orange'}
            rounding={'down'}
          />
          <Text style={{ marginTop: 15 }}>программа тренировки</Text>
          <Stars
            isActive
            rateMax={5}
            isHalfStarEnabled
            onStarPress={rating => this.setState({ program: rating })}
            rate={program}
            size={rateSize}
            color={'orange'}
            rounding={'down'}
          />
          <Text style={{ marginTop: 15 }}>оборудование/зал</Text>
          <Stars
            isActive
            rateMax={5}
            isHalfStarEnabled
            onStarPress={rating => this.setState({ equipment: rating })}
            rate={equipment}
            size={rateSize}
            color={'orange'}
            rounding={'down'}
          />
          <TouchableOpacity
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              margin: 20,
              backgroundColor: '#2ecc71',
              height: 60,
              width: 200,
              borderRadius: 30,
            }}
            onPress={() => this.saveResult()}
          >
            {
              loading ?
                <ActivityIndicator animating color={'white'} size={1} /> :
                <Text style={{ color: '#ffffff' }}>Сохранить</Text>
            }
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default FeedBack;
