import React from 'react';
import { Text, View, WebView } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setToken } from './actions';

const OAuthView = ({ navigation }) => (
  <View style={{ flex: 1, flexDirection: 'column' }}>
    <WebView
      ref={(component) => { this.webView = component; }}
      userAgent={'Mozilla/5.0 Google'}
      style={{ flex: 1 }}
      startInLoadingState
      source={{ uri: navigation.state.params.url }}
      renderLoading={() => (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Загрузка...</Text>
        </View>
      )}
      onNavigationStateChange={(state) => {
        navigation.state.params.onNavigationStateChange(state, () => {
          if (this.webView && this.webView.stopLoading) {
            this.webView.stopLoading();
          }
        });
      }}
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
