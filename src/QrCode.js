/* eslint-disable global-require */
import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Text, TouchableOpacity, Platform } from 'react-native';
import QRCode from 'react-native-qrcode';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Camera from 'react-native-camera';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationActions } from 'react-navigation';
import { setToken } from './actions';
import ApiRequest from './utils/ApiRequest';
import GroupHeader from './components/GroupHeader';

const { width } = Dimensions.get('window');
const isIos = Platform.OS === 'ios';
const qrtypes = [
  '0', // letter
  '1', // club
];

const CloseButton = ({ navigation }) => (
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
    onPress={() => navigation.dispatch(NavigationActions.back())}
  >
    <Text style={{ color: '#ffffff' }}>Закрыть</Text>
  </TouchableOpacity>
);

CloseButton.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    state: PropTypes.shape(),
  }),
};

const defaultState = {
  loading: true,
  error: '',
  scanTransactionId: '',
  scanTimetableId: '',
  transactionId: '',
  timetableId: '',
  requestorId: '',
  approverId: '',
  requestDate: null,
  approvalDate: null,
};

class QrCode extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
      dispatch: PropTypes.func.isRequired,
      state: PropTypes.shape(),
    }),
  };

  constructor(props) {
    super(props);
    const { type } = props.navigation.state.params;

    this.state = {
      loading: true,
      error: '',
      type,
      scanTransactionId: '',
      scanTimetableId: '',
      transactionId: '',
      timetableId: '',
      requestorId: '',
      approverId: '',
      requestDate: null,
      approvalDate: null,
    };
  }

  componentDidMount() {
    const { item } = this.props.navigation.state.params;
    const { type } = this.state;
    if (type === 'gen') {
      ApiRequest.openTransaction(item.id).then((data) => {
        console.log('openTransaction', data);
        this.setState({
          loading: false,
          transactionId: data.id,
          ...data,
        });
      });
    } else if (type === 'scan') {
      // eslint-disable-next-line
      this.setState({
        loading: false,
      });
    }
  }

  onBarCode = (barCode) => {
    const { mode } = this.props.navigation.state.params;

    if (this.qr !== barCode.data) {
      console.log(barCode);
      const arr = barCode.data.split(':');
      if (arr[0] !== 'sportiq') {
        return;
      }

      if (!qrtypes.includes(arr[1])) {
        return;
      }

      if (!(arr[1] === mode)) {
        return;
      }

      this.qr = barCode.data;

      if (arr[1] === '0') {
        this.setState({
          scanTransactionId: arr[2],
          scanTimetableId: arr[3],
        });

        ApiRequest.closeTransaction(arr[2], arr[3]).then((data) => {
          console.log('closeTransaction', data);
          this.setState({
            loading: false,
            transactionId: data.id,
            ...data,
          });
        });
      }

      if (arr[1] === '1') {
        ApiRequest.getClub(arr[2]).then((data) => {
          if (!data.id) {
            this.resetQrScanning();
            return;
          }
          this.setState({
            club: data,
          });
          this.props.navigation.navigate('Club', { item: data });
        });
      }
    }
  };

  qr = '';

  resetQrScanning = () => {
    const { type } = this.props.navigation.state.params;
    this.qr = '';
    this.setState({
      ...defaultState,
      loading: false,
      timetable: null,
      group: null,
      club: null,
      type,
    });
  }

  renderClubScanned = () => (
    <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
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
        onPress={() => this.resetQrScanning()}
      >
        <Text style={{ color: '#ffffff' }}>Сканировать еще</Text>
      </TouchableOpacity>
    </View>
  );

  renderTicketScanned = () => {
    const { timetable, group, club } = this.state;
    return (
      <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <GroupHeader item={timetable} />
        <Text style={{
          fontWeight: 'bold',
          margin: 10,
          marginVertical: 5,
        }}
        >
          {club.name}
        </Text>
        <Text style={{
          fontWeight: 'bold',
          margin: 10,
          marginVertical: 5,
        }}
        >
          {group.name}
        </Text>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginVertical: 10 }}>
          ОТМЕЧЕН
        </Text>
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
          onPress={() => this.resetQrScanning()}
        >
          <Text style={{ color: '#ffffff' }}>Сканировать еще</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderQRgen = (code) => {
    const { item } = this.props.navigation.state.params;
    return (
      <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <GroupHeader item={item} />
        <Text style={{
          fontWeight: 'bold',
          margin: 10,
        }}
        >
          {item.group.name}
        </Text>
        <QRCode
          value={code}
          size={200}
          bgColor={'#72c02c'}
          fgColor={'white'}
        />
        {
          this.state.requestorId && this.state.approverId ?
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginVertical: 10 }}>
              ОТМЕЧЕН
            </Text>
            :
            null
        }
      </View>
    );
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
      <Ionicons name="ios-qr-scanner" size={Math.floor(width * 0.9)} color="#00000033" />
    </Camera>
  );

  renderContent = () => {
    const { item } = this.props.navigation.state.params;
    const { timetable, group, type, club } = this.state;

    if (this.state.loading) {
      return (
        <Text>Обработка...</Text>
      );
    }
    if (type === 'scan') {
      if (timetable && group) {
        return this.renderTicketScanned();
      }
      if (club) {
        return this.renderClubScanned();
      }
      return this.renderQRScan();
    }
    if (type === 'gen') {
      return this.renderQRgen(`sportiq:0:${this.state.transactionId}:${item.id}`);
    }
    return (<Text>Нет QR Билета!</Text>);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          {this.renderContent()}
        </View>
      </View>
    );
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

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps, {
  setToken,
})(QrCode);
