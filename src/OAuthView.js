import React from 'react';
import { TouchableOpacity, Text, View, WebView } from 'react-native';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { setToken } from './actions';

const OAuthView = ({ navigation }) => (
  <View style={{ flex: 1, flexDirection: 'column' }}>
    <View style={{ marginTop: 20, height: 40, alignItems: 'flex-start', justifyContent: 'center' }}>
      <TouchableOpacity
        onPress={() => {
          navigation.dispatch(NavigationActions.back());
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginLeft: 10 }}>
          <Icon name="chevron-left" size={20} color="black" />
          <Text> Back </Text>
        </View>
      </TouchableOpacity>
    </View>
    <WebView
      style={{ flex: 1 }}
      source={{ uri: navigation.state.params.url }}
      renderLoading={() => (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Загрузка!</Text>
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
