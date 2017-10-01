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

  goToCalendar = () => this.props.navigation.navigate('DrawersNavigator');

  loginWithFacebook = () => {
    const fburl = [
      'https://www.facebook.com/v2.5/dialog/oauth?',
      'client_id=115411419065159&',
      'response_type=token&',
      `redirect_uri=${mobileSignUrl}`,
    ].join('');

    this.props.navigation.navigate('OAuthView', {
      url: fburl,
      onNavigationStateChange: (state, stopLoading) => {
        if (state.url.indexOf(mobileSignUrl) >= 0) {
          const url = state.url;
          const i1 = url.indexOf('access_token=');
          const i2 = url.indexOf('&expires_in');
          if (i1 > 0 && i2 > 0) {
            const token = url.substring(i1 + 'access_token='.length, i2);
            // this.props.navigation.dispatch(NavigationActions.back());
            ApiRequest.getToken('facebook', 'access_token', token).then(data => data.text()).then((data) => {
              stopLoading();
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
      'client_id=6200542&',
      'display=mobile&',
      `redirect_uri=${mobileSignUrl}&`,
      'scope=friends&response_type=code&v=5.68',
    ].join('');

    this.props.navigation.navigate('OAuthView', {
      url: vkurl,
      onNavigationStateChange: (state, stopLoading) => {
        if (state.url.indexOf(mobileSignUrl) >= 0) {
          const url = state.url;
          const i1 = url.indexOf('code=');
          if (i1 > 0) {
            const code = url.substring(i1 + 'code='.length, url.length);

            ApiRequest.getToken('vkontakte', 'code', code).then(data => data.text()).then((data) => {
              stopLoading();
              this.props.setToken(data);
              this.goToCalendar();
            });
          }
        }
      },
    });
  };

  loginWithInstagram = () => {
    const instaurl = [
      'https://api.instagram.com/oauth/authorize?',
      'client_id=1e1aeecdb87e40dcbca8fb8f9dcf2870&',
      'response_type=code&',
      `redirect_uri=${mobileSignUrl}`,
    ].join('');

    this.props.navigation.navigate('OAuthView', {
      url: instaurl,
      onNavigationStateChange: (state, stopLoading) => {
        if (state.url.indexOf(mobileSignUrl) >= 0) {
          const url = state.url;
          const i1 = url.indexOf('code=');
          if (i1 > 0) {
            const code = url.substring(i1 + 'code='.length, url.length);
            // this.props.navigation.dispatch(NavigationActions.back());
            ApiRequest.getToken('instagram', 'code', code).then(data => data.text()).then((data) => {
              stopLoading();
              this.props.setToken(data);
              this.goToCalendar();
            });
          }
        }
      },
    });
  };

  loginWithGoogle = () => {
    const googleurl = [
      /*
      'https://accounts.google.com/o/oauth2/auth?',
      'client_id=425199437936-d7up002g8se91n4f74i4jlpa68fqvshr.apps.googleusercontent.com&',
      'response_type=code&',
      `redirect_uri=${mobileSignUrl}`,
      '&scope=https://www.googleapis.com/auth/userinfo.profile+',
      'https://www.googleapis.com/auth/userinfo#email+',
      'https://www.googleapis.com/auth/plus.me+',
      'https://www.googleapis.com/auth/tasks+',
      'https://www-opensocial.googleusercontent.com/api/people+',
      'https://www.googleapis.com/auth/plus.login',
      '&state=950198d1-c7b2-4715-a28b-74f19308b80f',
      */
      'https://accounts.google.com/o/oauth2/v2/auth?',
      'scope=email profile&',
      'response_type=code&',
      'state=security_token=138r5719ru3e1&',
      'url=https://oauth2.example.com/token&',
      `redirect_uri=${mobileSignUrl}`,
      '&client_id=425199437936-d7up002g8se91n4f74i4jlpa68fqvshr.apps.googleusercontent.com',
    ].join('');

    this.props.navigation.navigate('OAuthView', {
      url: googleurl,
      onNavigationStateChange: (state, stopLoading) => {
        if (state.url.indexOf(mobileSignUrl) >= 0) {
          const url = state.url;
          const i1 = url.indexOf('code=');
          if (i1 > 0) {
            const code = url.substring(i1 + 'code='.length, url.length);
            // this.props.navigation.dispatch(NavigationActions.back());
            ApiRequest.getToken('google', 'code', code).then(data => data.text()).then((data) => {
              stopLoading();
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
        <View style={styles.buttons}>
          <Icon.Button name="vk" backgroundColor="#45688e" onPress={this.loginWithVk} {...iconStyles}>
            Login with VK
          </Icon.Button>
        </View>
        <View style={styles.buttons}>
          <Icon.Button name="instagram" backgroundColor="#cc486a" onPress={this.loginWithInstagram} {...iconStyles}>
            Login with Instagram
          </Icon.Button>
        </View>
        <View style={styles.buttons}>
          <Icon.Button name="google" backgroundColor="#DD4B39" onPress={this.loginWithGoogle} {...iconStyles}>
            Login with Google
          </Icon.Button>
        </View>
      </View>
    );
  }
}
const iconStyles = {
  justifyContent: 'center',
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
    marginBottom: 15,
  },
});

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps, {
  setToken,
})(Login);
