/* eslint-disable global-require */
import React, { Component } from 'react';
import { View, Text, Dimensions, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import Camera from 'react-native-camera';
import Ionicon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { closeTransaction, getTrainingAsCoach } from './actions';
import { TRAINING_QR, qrGenCodes, colors } from './utils/constants';
import padStart from './utils/padStart';

const { width } = Dimensions.get('window');
const isIos = Platform.OS === 'ios';

class QrScan extends Component {
  static propTypes = {
    type: PropTypes.string,
    // data: PropTypes.shape(),
    // transactions: PropTypes.shape(),
    startCloseTransaction: PropTypes.func,
    startGetTrainingAsCoach: PropTypes.func,
    coachTrainings: PropTypes.shape(),
    transactions: PropTypes.shape(),
  };

  static navigationOptions = {
    title: 'Сканер',
    headerBackTitle: '',
    headerTruncatedBackTitle: '',
    headerTitleStyle: { color: 'black' },
    headerTintColor: colors.grassyGreen,
  };

  constructor(props) {
    super(props);

    this.state = {
      qrScanned: true,
      timetableId: '',
      transactionId: '',
    };
  }

  componentDidMount() {}

  onBarCode = (barCode) => {
    const { type, startCloseTransaction, startGetTrainingAsCoach } = this.props;

    if (this.qr !== barCode.data) {
      let transactionId = '';
      let timetableId = '';
      const arr = barCode.data.split(':');
      if (arr[0] !== 'sportiq') {
        return;
      }

      if (!(arr[1] === qrGenCodes[type])) {
        return;
      }

      this.qr = barCode.data;

      if (arr[1] === qrGenCodes[type]) {
        transactionId = arr[2];
        timetableId = arr[3];
        startCloseTransaction({ transactionId, timetableId });
        startGetTrainingAsCoach({ id: timetableId });
        this.setState({
          qrScanned: true,
          transactionId,
          timetableId,
        });
      }
    }
  };

  qr = '';

  scanAgain = () => {
    this.qr = '';
    this.setState({
      qrScanned: false,
      transactionId: '',
      timetableId: '',
    });
  };

  renderQRScan = () => (
    <Camera
      ref={(cam) => {
        this.camera = cam;
      }}
      onBarCodeRead={this.onBarCode}
      style={styles.camera}
      aspect={Camera.constants.Aspect.fill}
      captureTarget={Camera.constants.CaptureTarget.cameraRoll}
      type={Camera.constants.Type.back}
      orientation={Camera.constants.Orientation.auto}
      flashMode={Camera.constants.FlashMode.auto}
      onFocusChanged={() => {}}
      onZoomChanged={() => {}}
      defaultTouchToFocus
      mirrorImage={false}
    >
      <Ionicon name="ios-qr-scanner" size={Math.floor(width * 0.9)} color="#00000033" />
    </Camera>
  );

  renderg = () => {};

  renderTrainingScanned = () => {
    const { coachTrainings, transactions } = this.props;
    const { transactionId, timetableId } = this.state;
    const training = coachTrainings[timetableId];
    const transaction = transactions[transactionId];

    let date = '...';
    let club = '...';
    let group = '...';
    let status = '...';

    if (training) {
      const _date = new Date(training.start);
      const day = padStart(_date.getDate(), 2, '0');
      const month = padStart(_date.getMonth() + 1, 2, '0');
      const year = _date.getFullYear();
      date = `${day}.${month}.${year}`;
      club = training.club.name;
      group = training.group.name;
    }

    if (transaction) {
      status =
        transaction.requestorId && transaction.approverId ? 'ЕСТЬ ОТМЕТКА О ПОСЕЩЕНИИ' : 'НЕТ ОТМЕТКИ О ПОСЕЩЕНИИ';
    }

    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          marginHorizontal: 42,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View style={{ flexDirection: 'row', marginVertical: 13 }}>
          <Text
            style={{
              fontSize: 15,
            }}
          >
            {'Дата: '}
          </Text>
          <Text
            style={{
              fontSize: 15,
              fontWeight: 'bold',
            }}
          >
            {date}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 13 }}>
          <Text
            style={{
              fontSize: 15,
            }}
          >
            {'Клуб: '}
          </Text>
          <Text
            style={{
              fontSize: 15,
              fontWeight: 'bold',
            }}
          >
            {club}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 13 }}>
          <Text
            style={{
              fontSize: 15,
            }}
          >
            {'Группа: '}
          </Text>
          <Text
            style={{
              fontSize: 15,
              fontWeight: 'bold',
            }}
          >
            {group}
          </Text>
        </View>
        <Text
          style={{
            fontSize: 15,
            marginTop: 30,
          }}
        >
          Статус посещения:
        </Text>
        <Text style={{ color: colors.grassyGreen, fontSize: 16, fontWeight: 'bold', marginVertical: 10 }}>
          {status}
        </Text>
        <TouchableOpacity
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.grassyGreen,
            height: 50,
            width: '80%',
            borderRadius: 4,
            shadowColor: 'rgba(43, 193, 0, 0.6)',
            shadowOffset: {
              width: 0,
              height: 7.5,
            },
            shadowRadius: 17.5,
            shadowOpacity: 1,
          }}
          onPress={this.scanAgain}
        >
          <Text style={{ color: '#ffffff' }}>Сканировать еще</Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const { type } = this.props;
    const { qrScanned } = this.state;
    if (type === TRAINING_QR) {
      if (qrScanned) {
        return this.renderTrainingScanned();
      }
      return this.renderQRScan();
    }
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    height: Dimensions.get('window').height - (isIos ? 60 : 40),
    width: Dimensions.get('window').width,
  },
});

const mapStateToProps = (state, ownProps) => {
  const { type, data } = ownProps.navigation.state.params;
  return {
    data,
    type,
    coachTrainings: state.coachTrainings,
    transactions: state.transactions,
  };
};

const mapDispatchToProps = dispatch => ({
  startCloseTransaction: id => dispatch(closeTransaction.start({ id })),
  startGetTrainingAsCoach: id => dispatch(getTrainingAsCoach.start({ id })),
});

export default connect(mapStateToProps, mapDispatchToProps)(QrScan);
