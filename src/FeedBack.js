import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import Stars from './components/Stars';
import { calendarNavigate, getFeedBackRequest, setFeedBackRequest } from './actions';
import { colors } from './utils/constants';

const rateSize = 35;
class FeedBack extends Component {
  static propTypes = {
    goBack: PropTypes.func.isRequired,
    getFeedBack: PropTypes.func.isRequired,
    setFeedBack: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    feedback: PropTypes.shape(),
    id: PropTypes.string,
    // getRequest: PropTypes.shape(),
    setRequest: PropTypes.shape(),
  };
  static defaultProps = {
    loading: false,
    feedback: {
      result: 0,
      coach: 0,
      program: 0,
      equipment: 0,
      count: 0,
      rating: 0,
    },
    id: '',
    getRequest: { processing: false },
    setRequest: { processing: false },
  };

  constructor(props) {
    super(props);
    this.state = { ...props.feedback };
  }

  componentDidMount() {
    const { getFeedBack, id } = this.props;
    getFeedBack(id);
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.feedback) !== JSON.stringify(this.props.feedback)) {
      this.setState({ ...nextProps.feedback });
    }
    if (
      this.props.setRequest.processing === true &&
      nextProps.setRequest.processing === false &&
      nextProps.setRequest.ok === true
    ) {
      this.props.goBack();
    }
  }

  saveResult = () => {
    const { id, setFeedBack } = this.props;
    const state = this.state;
    const data = {
      result: state.result,
      coach: state.coach,
      program: state.program,
      equipment: state.equipment,
    };
    setFeedBack(id, data);
  };

  render() {
    const { loading } = this.props;
    const { result, coach, program, equipment } = this.state;
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
          {loading ? (
            <ActivityIndicator animating color={'white'} size={1} />
          ) : (
            <Text style={{ color: '#ffffff' }}>Сохранить</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  starGroup: { flex: 1, height: 51, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },
  starGroupText: { marginTop: 15, marginBottom: 3 },
});

const mapStateToProps = (state, ownProps) => ({
  user: state.user,
  id: ownProps.navigation.state.params.id,
  feedback: state.feedbacks[ownProps.navigation.state.params.id],
  loading: state.getFeedBackRequest.processing || state.setFeedBackRequest.processing,
  getRequest: state.getFeedBackRequest,
  setRequest: state.setFeedBackRequest,
});

const mapDispatchToProps = dispatch => ({
  goBack: () => dispatch(calendarNavigate('<=')),
  getFeedBack: id => dispatch(getFeedBackRequest.start({ id })),
  setFeedBack: (id, feedback) => dispatch(setFeedBackRequest.start({ id, feedback })),
});

export default connect(mapStateToProps, mapDispatchToProps)(FeedBack);
