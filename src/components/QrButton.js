import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../utils/constants';

const QrButton = ({ onPress }) =>
  (<TouchableOpacity
    style={{
      position: 'absolute',
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
      right: 15,
      bottom: 15,
      // borderColor: 'gray',
      // borderWidth: 1,
      backgroundColor: colors.grassyGreen,
      shadowColor: 'rgba(43, 193, 0, 0.6)',
      shadowOffset: {
        width: 0,
        height: 7.5,
      },
      shadowRadius: 17.5,
      shadowOpacity: 1,
    }}
    onPress={onPress}
  >
    <MaterialIcon name="qrcode-scan" size={25} color="white" />
  </TouchableOpacity>);

QrButton.propTypes = {
  onPress: PropTypes.func.isRequired,
};

export default QrButton;
