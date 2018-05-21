/* eslint-disable global-require */
import React, { Component } from 'react';
import { View, Text, Dimensions, StyleSheet, Platform, TouchableOpacity, Image } from 'react-native';
import Camera from 'react-native-camera';
import Ionicon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { closeTransaction, calendarNavigate } from './actions';
import { TRAINING_QR, qrGenCodes, colors } from './utils/constants';
import padStart from './utils/padStart';

const { width } = Dimensions.get('window');
const isIos = Platform.OS === 'ios';

/*
const tr = {
  user: {
    id: '5afec1e1a790ac6f5a40780a',
    name: 'trainee',
    description: null,
    image: null,
    sex: null,
    activities: [],
    achievements: [],
    birthday: null,
    contacts: {
      phone: null,
      address: null,
      coordinates: null,
      email: 'trainee@gmail.com',
      facebook: null,
      vkontakte: null,
      google: null,
      instagram: null,
      skype: null,
      site: null,
    },
  },
  club: {
    id: '5a280798a790ac3eca9dd8df',
    name: 'Клуб',
    overview: 'Клуб любителей бега',
    description: null,
    status: 'APPROVED',
    returnReason: null,
    contacts: {
      phone: '+375 (11) 111-11-11',
      address: 'проспект Независимости 168/1, Минск 220141, Беларусь',
      coordinates: {
        latitude: 53.94535219999999,
        longitude: 27.687874999999963,
      },
      email: 'club@email.by',
      facebook: null,
      vkontakte: null,
      google: null,
      instagram: null,
      skype: null,
      site: null,
    },
    image: {
      details: {
        bucket: 'sportiq.io',
        key: 'clubs/ccbafac6-95b7-4412-a075-fbc8f8c7bc83.jpg',
        url: 'http://sportiq.io.s3.amazonaws.com/clubs/ccbafac6-95b7-4412-a075-fbc8f8c7bc83.jpg',
        source: null,
      },
      list: {
        bucket: 'sportiq.io',
        key: 'clubs/2ec422d2-ee26-4d4c-b442-0edf0010e165.jpg',
        url: 'http://sportiq.io.s3.amazonaws.com/clubs/2ec422d2-ee26-4d4c-b442-0edf0010e165.jpg',
        source: null,
      },
    },
    paymentInfo: null,
    specialOffer: null,
    activities: [
      {
        id: '4',
        name: 'ACTIVITY.Running',
        className: 'icon-sport-156',
        visible: true,
        selected: true,
      },
      {
        id: '25',
        name: 'ACTIVITY.Hiking',
        className: 'icon-sport-020',
        visible: true,
        selected: true,
      },
    ],
    achievements: [],
    membersCount: null,
    ownedByMe: false,
  },
  group: {
    id: '5afebdbda790ac6f5a4077ba',
    clubId: '5a280798a790ac3eca9dd8df',
    name: 'Coach1 group',
    description: null,
    start: null,
    program: null,
    activities: [
      {
        id: '4',
        name: 'ACTIVITY.Running',
        className: 'icon-sport-156',
        visible: true,
        selected: true,
      },
    ],
    membersCount: null,
    color: 'rgb(148,181,255)',
  },
  subscription: {
    status: null,
    start: '2018-05-18',
    end: '2018-06-18',
    user: null,
    club: null,
    group: null,
    passTemplate: null,
    remainingTrainings: 0,
    paidTrainings: 0,
    percentageOfCompletion: 0,
  },
  timetable: {
    id: '5afebee5a790ac6f5a4077c3',
    clubId: null,
    groupId: null,
    group: null,
    start: '2018-05-21T11:49:00',
    end: '2018-05-21T12:49:00',
    description: null,
    billable: false,
    userId: null,
    status: 'UNPAID',
    coach: [],
  },
};
*/

class QrScan extends Component {
  static propTypes = {
    type: PropTypes.string,
    // data: PropTypes.shape(),
    // transactions: PropTypes.shape(),
    startCloseTransaction: PropTypes.func,
    // startGetTrainingAsCoach: PropTypes.func,
    goBack: PropTypes.func,
    closeRequest: PropTypes.shape(),
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
      qrScanned: false,
      timetableId: '',
      transactionId: '',
    };
  }

  componentDidMount() {}

  onBarCode = (barCode) => {
    const { type, startCloseTransaction } = this.props;

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
        startCloseTransaction(transactionId, timetableId);
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

  renderButtons = () => (
    <View style={{ flex: 1, width: '100%', flexDirection: 'row', justifyContent: 'space-around' }}>
      <TouchableOpacity
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.grassyGreen,
          height: 50,
          width: '45%',
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
      <TouchableOpacity
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          height: 50,
          width: '35%',
          borderRadius: 4,
        }}
        onPress={this.props.goBack}
      >
        <Text style={{ color: 'black' }}>Завершить</Text>
      </TouchableOpacity>
    </View>
  );

  renderTrainingScanned = () => {
    const { transactions, closeRequest } = this.props;
    const { timetableId } = this.state;
    const transaction = transactions[timetableId];
    const error = closeRequest.error;
    const processing = closeRequest.processing;
    // const transaction = tr;

    let date = '...';
    let time = '...';
    let club = '...';
    let group = '...';
    // let color = 'transparent';
    let abon = '...';

    if (transaction) {
      club = transaction.club.name;
      const _dt = new Date(transaction.timetable.start);
      const day = padStart(_dt.getDate(), 2, '0');
      const month = padStart(_dt.getMonth() + 1, 2, '0');
      const year = _dt.getFullYear();
      const hour = padStart(_dt.getHours(), 2, '0');
      const min = padStart(_dt.getMinutes(), 2, '0');
      date = `${day}.${month}.${year}`;
      time = `${hour}:${min}`;
      group = transaction.group.name;
      // color = transaction.group.color;
      abon = transaction.subscription.name || '';
    }

    const imWidth = 100;
    const user = (transaction || {}).user || {};
    const img = (user.image || {}).url || '';

    if (processing) {
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
          <Text style={{ marginVertical: 25, fontSize: 15, color: colors.grassyGreen }}> ОБРАБОТКА </Text>
        </View>);
    }

    if (error) {
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
          <Text style={{ marginVertical: 25, fontSize: 15, color: colors.grassyGreen }}> ОШИБКА </Text>
          {this.renderButtons()}
        </View>);
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
        <Text style={{ marginVertical: 25, fontSize: 15, color: colors.grassyGreen }}> ОТЛИЧНО </Text>
        <Text style={{ fontSize: 15 }}> Информация о посещении </Text>
        <Text style={{ fontSize: 15 }}> тренировки сохранена </Text>
        {img ? (
          <Image
            style={{
              marginVertical: 25,
              borderRadius: 4,
              width: imWidth,
              height: imWidth,
            }}
            source={{ uri: img }}
          />
        ) : (
          <View
            style={{
              marginVertical: 25,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colors.grassyGreen,
              borderRadius: imWidth / 2,
              width: imWidth,
              height: imWidth,
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                fontSize: 33,
                color: 'white',
              }}
            >
              {(user.name || ' ')[0].toUpperCase()}{' '}
            </Text>
          </View>
        )}
        <Text style={{ fontSize: 15, fontWeight: 'bold' }}> {user.name || ''} </Text>
        <View style={{ width: '100%', height: 1, backgroundColor: 'black', marginVertical: 20 }} />
        <View style={{ width: '100%', flexDirection: 'row', alignContent: 'flex-start' }}>
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
        <View style={{ width: '100%', flexDirection: 'row', alignContent: 'flex-start' }}>
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
        <View style={{ width: '100%', flexDirection: 'row', alignContent: 'flex-start' }}>
          <Text
            style={{
              fontSize: 15,
            }}
          >
            {'Абонемент: '}
          </Text>
          <Text
            style={{
              fontSize: 15,
              fontWeight: 'bold',
            }}
          >
            {abon}
          </Text>
        </View>
        <View style={{ width: '100%', flexDirection: 'row', alignContent: 'flex-start' }}>
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
        <View style={{ width: '100%', flexDirection: 'row', alignContent: 'flex-start' }}>
          <Text
            style={{
              fontSize: 15,
            }}
          >
            {'Время: '}
          </Text>
          <Text
            style={{
              fontSize: 15,
              fontWeight: 'bold',
            }}
          >
            {time}
          </Text>
        </View>
        <View style={{ width: '100%', height: 1, backgroundColor: 'black', marginVertical: 20 }} />
        {this.renderButtons()}
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
    closeRequest: state.closeTransaction,
  };
};

const mapDispatchToProps = dispatch => ({
  startCloseTransaction: (transactionId, timetableId) =>
    dispatch(closeTransaction.start({ transactionId, timetableId })),
  // startGetTrainingAsCoach: id => dispatch(getTrainingAsCoach.start({ id })),
  goBack: () => dispatch(calendarNavigate('<=')),
});

export default connect(mapStateToProps, mapDispatchToProps)(QrScan);
