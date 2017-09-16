import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import padStart from '../utils/padStart';
import getStrTimer from '../utils/getStrTimer';

const GroupHeader = ({ item }) => {
  const startDate = new Date(item.start);
  const endDate = new Date(item.end);
  const startTime = `${padStart(startDate.getHours(), 2, '0')}:${padStart(startDate.getMinutes(), 2, '0')}`;
  const endTime = `${padStart(endDate.getHours(), 2, '0')}:${padStart(endDate.getMinutes(), 2, '0')}`;
  const len = getStrTimer(new Date(item.end) - new Date(item.start));

  return (
    <View style={{ flexDirection: 'column' }}>
      <View style={{ marginLeft: 10, marginRight: 10, flexDirection: 'row' }}>
        <Icon name="calendar" size={12} color="black" />
        <Text style={{ fontSize: 12, marginLeft: 5 }}>{item.start.split('T')[0]}  </Text>
        <Icon name="clock-o" size={12} color="black" />
        <Text style={{ fontSize: 12, marginLeft: 5 }}>{startTime} - {endTime} / {len}</Text>
      </View>
    </View>
  );
};

GroupHeader.propTypes = {
  item: PropTypes.shape(),
};

export default GroupHeader;
