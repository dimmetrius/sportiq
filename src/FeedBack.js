import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import Stars from './components/Stars';
import ApiRequest from './utils/ApiRequest';
import { colors } from './utils/constants';

const rateSize = 35;
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
  };

  renderDescription = () => {
    const { description } = this.props.navigation.state.params;
    if (!description) return null;
    const html = description.join();
    return (
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 10,
          marginTop: 10,
          marginLeft: 10,
          marginRight: 10,
        }}
      >
        <Text>
          {html}
        </Text>
      </View>
    );
  };

  render() {
    const item = this.props.navigation.state.params;
    // eslint-disable-next-line
    const canQrGenerate = item.billable && item._links.get_access_code;
    const { loading, result, coach, program, equipment } = this.state;
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View style={styles.starGroup}>
          <Text style={styles.starGroupText}>удовлетворенность результатом</Text>
          <Stars
            isActive
            rateMax={5}
            isHalfStarEnabled
            onStarPress={rating => this.setState({ result: rating })}
            rate={result}
            size={rateSize}
            color={colors.grassyGreen}
            rounding={'down'}
          />
        </View>
        <View style={styles.starGroup}>
          <Text style={styles.starGroupText}>работа тренера</Text>
          <Stars
            isActive
            rateMax={5}
            isHalfStarEnabled
            onStarPress={rating => this.setState({ coach: rating })}
            rate={coach}
            size={rateSize}
            color={colors.grassyGreen}
            rounding={'down'}
          />
        </View>
        <View style={styles.starGroup}>
          <Text style={styles.starGroupText}>программа тренировки</Text>
          <Stars
            isActive
            rateMax={5}
            isHalfStarEnabled
            onStarPress={rating => this.setState({ program: rating })}
            rate={program}
            size={rateSize}
            color={colors.grassyGreen}
            rounding={'down'}
          />
        </View>
        <View style={styles.starGroup}>
          <Text style={styles.starGroupText}>оборудование/зал</Text>
          <Stars
            isActive
            rateMax={5}
            isHalfStarEnabled
            onStarPress={rating => this.setState({ equipment: rating })}
            rate={equipment}
            size={rateSize}
            color={colors.grassyGreen}
            rounding={'down'}
          />
        </View>
        <View style={{ width: '80%', marginTop: 15, borderTopColor: colors.inputUnder, borderTopWidth: 2 }} />
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 50,
              fontWeight: 'bold',
            }}
          >
            {Math.round((result + coach + program + equipment) * 10 / 4) / 10}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
            backgroundColor: colors.grassyGreen,
            height: 50,
            width: 200,
            borderRadius: 4,
            shadowColor: 'rgba(43, 193, 0, 0.6)',
            shadowOffset: {
              width: 0,
              height: 7.5,
            },
            shadowRadius: 17.5,
            shadowOpacity: 1,
          }}
          onPress={() => this.saveResult()}
        >
          {loading
            ? <ActivityIndicator animating color={'white'} size={1} />
            : <Text style={{ color: '#ffffff' }}>Сохранить</Text>}
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  starGroup: { flex: 1, height: 51, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },
  starGroupText: { marginTop: 15, marginBottom: 3 },
});

export default FeedBack;
