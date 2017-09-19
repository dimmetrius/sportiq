import React from 'react';
import { TouchableOpacity, Text, View, WebView, Platform } from 'react-native';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Entypo';
import { connect } from 'react-redux';
import { setToken } from './actions';

const isIos = Platform.OS === 'ios';

const OAuthView = ({ navigation }) => (
  <View style={{ flex: 1, flexDirection: 'column' }}>
    <View style={{ marginTop: isIos ? 20 : 0, height: 40, alignItems: 'flex-start', justifyContent: 'center' }}>
      <TouchableOpacity
        onPress={() => {
          navigation.dispatch(NavigationActions.back());
        }}
      >
        <View style={{
          height: 40,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: 10,
        }}
        >
          <Icon name="chevron-thin-left" size={17} color="black" />
          <Text>Back </Text>
        </View>
      </TouchableOpacity>
    </View>
    <WebView
      style={{ flex: 1 }}
      startInLoadingState
      source={{ uri: navigation.state.params.url }}
      renderLoading={() => (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Загрузка...</Text>
        </View>
      )}
      onNavigationStateChange={navigation.state.params.onNavigationStateChange}
    />
  </View>
);

OAuthView.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    state: PropTypes.shape(),
  }),
};

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps, {
  setToken,
})(OAuthView);
