import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import { NavigationActions } from 'react-navigation';

const BackButton = ({ navigation }) =>
  (<TouchableOpacity
    onPress={() => {
      navigation.dispatch(NavigationActions.back());
    }}
  >
    <View
      style={{
        height: 40,
        width: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}
    >
      <Icon name="chevron-thin-left" size={17} color="black" />
      <Text>Back </Text>
    </View>
  </TouchableOpacity>);

BackButton.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    state: PropTypes.shape(),
  }),
};

export default BackButton;
