/* eslint-disable global-require */
import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setToken } from './actions';
import ApiRequest from './utils/ApiRequest';
import { mobileSignUrl } from './utils/constants';

class Login extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
      dispatch: PropTypes.func.isRequired,
    }),
    user: PropTypes.shape({
      token: PropTypes.string,
    }),
    setToken: PropTypes.func.isRequired,
  };

  state = {
    user: undefined, // user has not logged in yet
  };

  // Set up Linking
  componentDidMount() {
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {}

  /*
  goToCalendar = () => this.props.navigation.dispatch(NavigationActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({ routeName: 'MyCalendar' }),
    ],
  }));
  */

  goToCalendar = () => this.props.navigation.navigate('TabsNavigator');

  loginWithFacebook = () => {
    const fburl = [
      'https://www.facebook.com/v2.5/dialog/oauth?',
      'client_id=115411419065159&',
      'response_type=token&',
      `redirect_uri=${mobileSignUrl}`,
    ].join('');

    this.props.navigation.navigate('OAuthView', {
      url: fburl,
      onNavigationStateChange: (state) => {
        if (state.url.indexOf(mobileSignUrl) >= 0) {
          const url = state.url;
          const i1 = url.indexOf('access_token=');
          const i2 = url.indexOf('&expires_in');
          if (i1 > 0 && i2 > 0) {
            const token = url.substring(i1 + 'access_token='.length, i2);
            // this.props.navigation.dispatch(NavigationActions.back());
            ApiRequest.getToken('facebook', token).then(data => data.text()).then((data) => {
              this.props.setToken(data);
              this.goToCalendar();
            });
          }
        }
      },
    });
  };

  loginWithVk = () => {
    const vkurl = [
      'https://oauth.vk.com/authorize?',
      'client_id=6081473&',
      'display=mobile&',
      `redirect_uri=${mobileSignUrl}&`,
      'scope=friends&response_type=token&v=5.68',
    ].join('');

    this.props.navigation.navigate('OAuthView', {
      url: vkurl,
      onNavigationStateChange: (state) => {
        if (state.url.indexOf(mobileSignUrl) >= 0) {
          const url = state.url;
          const i1 = url.indexOf('access_token=');
          const i2 = url.indexOf('&expires_in');
          const i3 = url.indexOf('&user_id=');
          if (i1 > 0 && i2 > 0 && i3 > 0) {
            const token = url.substring(i1 + 'access_token='.length, i2);
            const uid = url.substring(i3 + '&user_id='.length, url.length);
            // this.props.navigation.dispatch(NavigationActions.back());

            ApiRequest.getToken('vkontakte', token, uid).then(data => data.text()).then((data) => {
              this.props.setToken(data);
              this.goToCalendar();
            });
          }
        }
      },
    });
  };

  renderUser(user) {
    if (user) {
      return (
        <View style={styles.content}>
          <Text style={styles.header}>
            Welcome {user.name}!
          </Text>
          <View style={styles.avatar}>
            <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
          </View>
        </View>
      );
    }
    return (
      <View style={styles.content}>
        <Text style={styles.header}>Welcome Stranger!</Text>
        <View style={styles.avatar}>
          <Image source={require('./icons/ic.png')} style={styles.avatarImage} />
        </View>
        <Text style={styles.text}>
            Please log in to continue {'\n'}
            to the awesomness
        </Text>
      </View>
    );
  }
  /*
  <View style={styles.buttons}>
    <Icon.Button name="vk" backgroundColor="#45688e" onPress={this.loginWithVk} {...iconStyles}>
      or with VK
    </Icon.Button>
  </View>
  <View style={styles.buttons}>
    <Icon.Button name="google" backgroundColor="#DD4B39" onPress={this.loginWithAbstract} {...iconStyles}>
      Or with Google
    </Icon.Button>
  </View>
  <View style={styles.buttons}>
    <Icon.Button name="instagram" backgroundColor="#cc486a" onPress={this.loginWithAbstract} {...iconStyles}>
      Or with Instagram
    </Icon.Button>
  </View>
*/
  render() {
    const { user } = this.state;
    return (
      <View style={styles.container}>
        {this.renderUser(user)}
        <View style={styles.buttons}>
          <Icon.Button name="facebook" backgroundColor="#3b5998" onPress={this.loginWithFacebook} {...iconStyles}>
            Login with Facebook
          </Icon.Button>
        </View>
      </View>
    );
  }
}
const iconStyles = {
  borderRadius: 10,
  iconStyle: { paddingVertical: 5 },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    margin: 20,
  },
  avatarImage: {
    borderRadius: 50,
    height: 100,
    width: 100,
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  text: {
    textAlign: 'center',
    color: '#333',
    marginBottom: 5,
  },
  buttons: {
    justifyContent: 'space-between',
    flexDirection: 'column',
    margin: 20,
    marginBottom: 30,
  },
});

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps, {
  setToken,
})(Login);
