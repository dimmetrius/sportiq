/* eslint-disable global-require */
import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setToken } from './actions';
import ApiRequest from './utils/ApiRequest';
import { mobileSignUrl, colors } from './utils/constants';
import LoginHeader from './components/LoginHeader';

const { width } = Dimensions.get('window');
const IMG_HEIGHT = 435;
const IMG_WIDTH = 750;
const headerHeight = width / IMG_WIDTH * IMG_HEIGHT;

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
  componentDidMount() {}

  componentDidUpdate() {}

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
    return (
      <View style={styles.container}>
        <LoginHeader height={headerHeight} />
        <View style={[styles.section, { height: 150, justifyContent: 'space-between' }]}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: 10,
            }}
          >
            <Text
              style={{
                fontFamily: 'Intro-Book',
                fontSize: 15,
              }}
            >
              Авторизация
            </Text>
            <Text
              style={{
                fontFamily: 'Intro-Book',
                fontSize: 15,
                color: colors.grassyGreen,
              }}
            >
              Регистрация
            </Text>
          </View>
          <View style={{ flexDirection: 'column', marginHorizontal: 10 }}>
            <Text
              style={{
                fontFamily: 'Intro-Book',
                fontSize: 12,
                color: colors.warmGrey,
              }}
            >
              E-mail
            </Text>
            <TextInput
              style={{
                height: 22,
                borderBottomColor: colors.inputUnder,
                borderBottomWidth: 1,
                fontFamily: 'Intro-Book',
                fontSize: 15,
                color: '#000000',
              }}
              onChangeText={() => null}
              value={'dimmetrius@gmail.com'}
            />
          </View>
          <View style={{ flexDirection: 'column', marginHorizontal: 10 }}>
            <Text
              style={{
                fontFamily: 'Intro-Book',
                fontSize: 12,
                color: colors.warmGrey,
              }}
            >
              Пароль
            </Text>
            <TextInput
              style={{
                height: 22,
                borderBottomColor: colors.inputUnder,
                borderBottomWidth: 1,
                fontFamily: 'Intro-Book',
                fontSize: 15,
                color: '#000000',
              }}
              onChangeText={() => null}
              value={'***************'}
            />
          </View>
        </View>
        <View style={[styles.section, { alignItems: 'flex-end' }]}>
          <Text
            style={{
              fontFamily: 'Intro-Book',
              fontSize: 12,
              marginRight: 10,
              textAlign: 'center',
              color: colors.warmGrey,
            }}
          >
            Забыли пароль?
          </Text>
        </View>
        <View style={[styles.section, { height: 45 }]}>
          <TouchableOpacity
            style={{
              flex: 1,
              borderRadius: 4,
              backgroundColor: colors.grassyGreen,
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: 10,
              marginRight: 10,
            }}
          >
            <Text
              style={{
                fontFamily: 'Intro-Book',
                fontSize: 15,
                textAlign: 'center',
                color: colors.white,
              }}
            >
              Войти
            </Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.section, { alignItems: 'center' }]}>
          <Text
            style={{
              fontFamily: 'Intro-Book',
              fontSize: 12,
              textAlign: 'center',
              color: colors.warmGrey,
            }}
          >
            или авторизоваться с помощью
          </Text>
        </View>
        <View style={styles.section}>
          <View style={styles.buttonsRow}>
            <View style={styles.button}>
              <Icon.Button name="facebook" backgroundColor="#ffffff" onPress={this.loginWithFacebook} {...iconStyles}>
                Facebook
              </Icon.Button>
            </View>
            <View style={styles.button}>
              <Icon.Button name="vk" backgroundColor="#ffffff" onPress={this.loginWithVk} {...iconStyles}>
                Vkontakte
              </Icon.Button>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginBottom: 30,
            }}
          >
            <View style={styles.button}>
              <Icon.Button name="instagram" backgroundColor="#ffffff" onPress={this.loginWithInstagram} {...iconStyles}>
                Instagram
              </Icon.Button>
            </View>
            <View style={styles.button}>
              <Icon.Button name="google" backgroundColor="#ffffff" onPress={this.loginWithGoogle} {...iconStyles}>
                Google
              </Icon.Button>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
const iconStyles = {
  justifyContent: 'flex-start',
  borderRadius: 4,
  shadowColor: 'rgba(0, 0, 0, 0.1)',
  shadowOffset: {
    width: 0,
    height: 0.5,
  },
  shadowRadius: 24.5,
  shadowOpacity: 1,
  borderStyle: 'solid',
  borderWidth: 0.5,
  borderColor: '#d7d7d7',
  color: colors.warmGrey,
  iconStyle: { padding: 5 },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    flexDirection: 'column',
    justifyContent: 'space-between',
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
  section: {
    flexDirection: 'column',
    marginHorizontal: 30,
  },
  buttonsRow: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
    margin: 10,
  },
});

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps, {
  setToken,
})(Login);
