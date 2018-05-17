/* eslint-disable global-require */
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import QRCode from 'react-native-qrcode';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { openTransaction } from './actions';
import { TRAINING_QR, qrGenCodes, colors } from './utils/constants';
import padStart from './utils/padStart';

class QrCode extends Component {
  static propTypes = {
    type: PropTypes.string,
    data: PropTypes.shape(),
    transactions: PropTypes.shape(),
    startOpenTransaction: PropTypes.func,
  };

  static navigationOptions = {
    title: 'Отметка о посещении',
    headerBackTitle: '',
    headerTruncatedBackTitle: '',
    headerTitleStyle: { color: 'black' },
    headerTintColor: colors.grassyGreen,
  };

  componentDidMount() {
    const { type, data, startOpenTransaction } = this.props;
    if (type === TRAINING_QR) {
      startOpenTransaction(data.trainingId);
    }
  }

  render() {
    const { type, transactions = {}, data } = this.props;
    if (type === TRAINING_QR) {
      const trainingId = data.trainingId;
      const _date = new Date(data.date);
      const day = padStart(_date.getDate(), 2, '0');
      const month = padStart(_date.getMonth() + 1, 2, '0');
      const year = _date.getFullYear();
      const date = `${day}.${month}.${year}`;
      const club = data.club;
      const group = data.group;
      const transaction = transactions[trainingId];
      if (transaction) {
        const code = `sportiq:${qrGenCodes[type]}:${transaction.id}:${trainingId}`;
        const status =
          transaction.requestorId && transaction.approverId ? 'ЕСТЬ ОТМЕТКА О ПОСЕЩЕНИИ' : 'НЕТ ОТМЕТКИ О ПОСЕЩЕНИИ';
        return (
          <View
            style={{
              flexDirection: 'column',
              marginHorizontal: 42,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 15,
                color: '#010101',
                textAlign: 'center',
                marginVertical: 30,
              }}
            >
              Покажите этот qr-code вашему тренеру, чтобы в системе осталась информация о посещении вами тренировки
            </Text>
            <View style={{ flexDirection: 'row', marginBottom: 13 }}>
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
            <View
              style={{
                padding: 15,
                borderRadius: 4,
                backgroundColor: 'white',
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowOffset: {
                  width: 0,
                  height: 0.5,
                },
                shadowRadius: 24.5,
                shadowOpacity: 1,
              }}
            >
              <QRCode value={code} size={200} bgColor={'black'} fgColor={'white'} />
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
          </View>
        );
      }
    }
    return null;
  }
}

const mapStateToProps = (state, ownProps) => {
  const { type, data } = ownProps.navigation.state.params;
  return {
    data,
    type,
    transactions: state.transactions,
  };
};

const mapDispatchToProps = dispatch => ({
  startOpenTransaction: id => dispatch(openTransaction.start({ id })),
});

export default connect(mapStateToProps, mapDispatchToProps)(QrCode);
