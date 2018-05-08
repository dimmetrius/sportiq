/* eslint-disable global-require */
import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setToken, startOauthLogin, startLoginWithPass, registerRequest, ui, rootNavigate } from './actions';
import ApiRequest from './utils/ApiRequest';
import { mobileSignUrl, colors } from './utils/constants';
import LoginHeader from './components/LoginHeader';
import KeyBoardAware from './components/KeyBoardAware';
import socialConfig from './utils/socialConfig';
import { showAlert } from './utils/alerts';

const { width } = Dimensions.get('window');
const IMG_HEIGHT = 435;
const IMG_WIDTH = 750;
const headerHeight = width / IMG_WIDTH * IMG_HEIGHT;

class Login extends Component {
  static propTypes = {
    user: PropTypes.shape({
      token: PropTypes.string,
      processing: PropTypes.bool,
    }),
    ui: PropTypes.shape({
      auth: PropTypes.bool,
    }),
    registerRequest: PropTypes.shape({
      processing: PropTypes.bool,
    }),
    setToken: PropTypes.func.isRequired,
    startLoginWithPass: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
    goToCalendar: PropTypes.func.isRequired,
    goToOauth: PropTypes.func.isRequired,
    startRegister: PropTypes.func.isRequired,
    setAuth: PropTypes.func.isRequired,
    setReg: PropTypes.func.isRequired,
  };

  state = {
    user: undefined, // user has not logged in yet
    kb: false,
    login: '',
    password: '',
    regName: '',
    regLogin: '',
    regPass: '',
    regPass2: '',
  };

  // Set up Linking
  componentDidMount() {
    const { user: { token }, goToCalendar } = this.props;
    if (token) {
      setTimeout(() => goToCalendar(), 300);
    }
  }

  componentDidUpdate() {}

  componentWillUnmount() {}

  onOauthNavigation = socialCode => (state, stopLoading) => {
    if (state.url.indexOf(mobileSignUrl) >= 0 && state.loading) {
      const url = state.url;
      const i1 = url.indexOf('code=');
      if (i1 > 0) {
        const code = url.substring(i1 + 'code='.length, url.length);
        // this.props.navigation.dispatch(NavigationActions.back());
        ApiRequest.socialLogin(socialCode, code, Math.random(1).toString(), '{}').then((data) => {
          stopLoading();
          // console.log(data);
          if (data.token) {
            this.props.setToken(data.token);
            this.props.goToCalendar();
          } else {
            showAlert(data.message);
          }
        });
      }
    }
  };

  loginByPassword = () => {
    const { login, password } = this.state;
    this.props.startLoginWithPass(login, password);
  };

  socialUrls = {
    FACEBOOK: [
      'https://www.facebook.com/v2.5/dialog/oauth?',
      `client_id=${socialConfig.facebookAppId}&`,
      'response_type=code&',
      `redirect_uri=${mobileSignUrl}`,
    ].join(''),
    VKONTAKTE: [
      'https://oauth.vk.com/authorize?',
      `client_id=${socialConfig.vkontakteAppId}&`,
      'display=mobile&',
      `redirect_uri=${mobileSignUrl}&`,
      'scope=friends&response_type=code&v=5.68',
    ].join(''),
    INSTAGRAM: [
      'https://api.instagram.com/oauth/authorize?',
      `client_id=${socialConfig.instagramAppId}`,
      'response_type=code&',
      `redirect_uri=${mobileSignUrl}`,
    ].join(''),
    GOOGLE: [
      'https://accounts.google.com/o/oauth2/v2/auth?',
      'scope=email profile&',
      'response_type=code&',
      // 'state=security_token=138r5719ru3e1&',
      'url=https://oauth2.example.com/token&',
      `redirect_uri=${mobileSignUrl}`,
      `&client_id=${socialConfig.googleAppId}`,
    ].join(''),
  };

  loginWith = (social) => {
    const url = this.socialUrls[social];
    this.props.goToOauth({
      url,
      onNavigationStateChange: this.onOauthNavigation(social),
    });
  };

  loginWithFacebook = () => this.loginWith('FACEBOOK');

  loginWithVk = () => this.loginWith('VKONTAKTE');

  loginWithInstagram = () => this.loginWith('INSTAGRAM');

  loginWithGoogle = () => this.loginWith('GOOGLE');

  startRegister = () => {
    const { regName, regLogin, regPass, regPass2 } = this.state;
    const { processing } = this.props.registerRequest;
    if (processing) {
      return;
    }
    this.props.startRegister(regName, regLogin, regPass, regPass2);
  };

  renderLoad = text => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text> {text} </Text>
    </View>
  );

  render() {
    const { kb, login, password, regName, regLogin, regPass, regPass2 } = this.state;
    const { processing } = this.props.user;
    const regProcessing = this.props.registerRequest.processing;
    const { auth } = this.props.ui;
    const { setAuth, setReg, user } = this.props;

    if (user.token) {
      return this.renderLoad('Авторизация');
    }

    return (
      <KeyBoardAware
        keyboardWillShow={() => {
          this.setState({ kb: true });
        }}
        keyboardWillHide={() => this.setState({ kb: false })}
        style={styles.container}
      >
        <LoginHeader height={kb ? headerHeight * (auth ? 0.5 : 0) : headerHeight} />
        <View
          style={[
            styles.section,
            {
              height: headerHeight * 0.8 * (auth ? 1 : 1.6),
              justifyContent: 'space-between',
            },
          ]}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 10,
            }}
          >
            <TouchableOpacity style={{ marginVertical: 5 }} onPress={setAuth}>
              <Text
                style={{
                  fontFamily: 'Intro-Book',
                  fontSize: 15,
                  color: auth ? colors.black : colors.grassyGreen,
                }}
              >
                Авторизация
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginVertical: 5 }} onPress={setReg}>
              <Text
                style={{
                  fontFamily: 'Intro-Book',
                  fontSize: 15,
                  color: auth ? colors.grassyGreen : colors.black,
                }}
              >
                Регистрация
              </Text>
            </TouchableOpacity>
          </View>
          {auth ? (
            <View style={{ flexDirection: 'column' }}>
              <Text
                style={{
                  top: -6,
                  position: 'absolute',
                  fontFamily: 'Intro-Book',
                  fontSize: 12,
                  color: colors.warmGrey,
                }}
              >
                E-mail
              </Text>
              <TextInput
                style={{
                  height: 32,
                  borderBottomColor: colors.inputUnder,
                  borderBottomWidth: 1,
                  fontFamily: 'Intro-Book',
                  fontSize: 15,
                  color: '#000000',
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={text => this.setState({ login: text })}
                value={login}
              />
            </View>
          ) : (
            <View style={{ flexDirection: 'column' }}>
              <Text
                style={{
                  top: -6,
                  position: 'absolute',
                  fontFamily: 'Intro-Book',
                  fontSize: 12,
                  color: colors.warmGrey,
                }}
              >
                Имя и Фамилия
              </Text>
              <TextInput
                style={{
                  height: 32,
                  borderBottomColor: colors.inputUnder,
                  borderBottomWidth: 1,
                  fontFamily: 'Intro-Book',
                  fontSize: 15,
                  color: '#000000',
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={text => this.setState({ regName: text })}
                value={regName}
              />
            </View>
          )}

          {auth ? (
            <View style={{ flexDirection: 'column' }}>
              <Text
                style={{
                  top: -6,
                  position: 'absolute',
                  fontFamily: 'Intro-Book',
                  fontSize: 12,
                  color: colors.warmGrey,
                }}
              >
                Пароль
              </Text>
              <TextInput
                style={{
                  height: 32,
                  borderBottomColor: colors.inputUnder,
                  borderBottomWidth: 1,
                  fontFamily: 'Intro-Book',
                  fontSize: 15,
                  color: '#000000',
                }}
                secureTextEntry
                onChangeText={text => this.setState({ password: text })}
                value={password}
              />
            </View>
          ) : (
            <View style={{ flexDirection: 'column' }}>
              <Text
                style={{
                  top: -6,
                  position: 'absolute',
                  fontFamily: 'Intro-Book',
                  fontSize: 12,
                  color: colors.warmGrey,
                }}
              >
                E-mail
              </Text>
              <TextInput
                style={{
                  height: 32,
                  borderBottomColor: colors.inputUnder,
                  borderBottomWidth: 1,
                  fontFamily: 'Intro-Book',
                  fontSize: 15,
                  color: '#000000',
                }}
                secureTextEntry={false}
                onChangeText={text => this.setState({ regLogin: text })}
                value={regLogin}
              />
            </View>
          )}

          {!auth ? (
            <View style={{ flexDirection: 'column' }}>
              <Text
                style={{
                  top: -6,
                  position: 'absolute',
                  fontFamily: 'Intro-Book',
                  fontSize: 12,
                  color: colors.warmGrey,
                }}
              >
                Пароль
              </Text>
              <TextInput
                style={{
                  height: 32,
                  borderBottomColor: colors.inputUnder,
                  borderBottomWidth: 1,
                  fontFamily: 'Intro-Book',
                  fontSize: 15,
                  color: '#000000',
                }}
                secureTextEntry
                onChangeText={text => this.setState({ regPass: text })}
                value={regPass}
              />
            </View>
          ) : null}

          {!auth ? (
            <View style={{ flexDirection: 'column' }}>
              <Text
                style={{
                  top: -6,
                  position: 'absolute',
                  fontFamily: 'Intro-Book',
                  fontSize: 12,
                  color: colors.warmGrey,
                }}
              >
                Повторите пароль
              </Text>
              <TextInput
                style={{
                  height: 32,
                  borderBottomColor: colors.inputUnder,
                  borderBottomWidth: 1,
                  fontFamily: 'Intro-Book',
                  fontSize: 15,
                  color: '#000000',
                }}
                secureTextEntry
                onChangeText={text => this.setState({ regPass2: text })}
                value={regPass2}
              />
            </View>
          ) : null}

          {auth ? (
            <View style={[{ flexDirection: 'column', alignItems: 'flex-end' }]}>
              <Text
                style={{
                  fontFamily: 'Intro-Book',
                  fontSize: 12,
                  textAlign: 'center',
                  color: colors.warmGrey,
                }}
              >
                Забыли пароль?
              </Text>
            </View>
          ) : null}
        </View>

        <View style={[styles.section, { height: 45 }]}>
          {auth ? (
            <TouchableOpacity
              onPress={this.loginByPassword}
              style={{
                flex: 1,
                borderRadius: 4,
                backgroundColor: colors.grassyGreen,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {processing ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text
                  style={{
                    fontFamily: 'Intro-Book',
                    fontSize: 15,
                    textAlign: 'center',
                    color: colors.white,
                  }}
                >
                  {'Войти'}
                </Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={this.startRegister}
              style={{
                flex: 1,
                borderRadius: 4,
                backgroundColor: colors.grassyGreen,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {regProcessing ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text
                  style={{
                    fontFamily: 'Intro-Book',
                    fontSize: 15,
                    textAlign: 'center',
                    color: colors.white,
                  }}
                >
                  {'Зарегистрироваться'}
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>

        {kb || !auth ? (
          <View style={{ height: 10 }} />
        ) : (
          <View style={styles.section}>
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
            <View style={[styles.buttonsRow, { marginTop: 10 }]}>
              <View style={styles.button}>
                <Icon.Button name="facebook" backgroundColor="#ffffff" onPress={this.loginWithFacebook} {...iconStyles}>
                  Facebook
                </Icon.Button>
              </View>
              <View style={{ width: 15 }} />
              <View style={styles.button}>
                <Icon.Button name="vk" backgroundColor="#ffffff" onPress={this.loginWithVk} {...iconStyles}>
                  Vkontakte
                </Icon.Button>
              </View>
            </View>
            <View style={[styles.buttonsRow, { marginTop: 10, marginBottom: 30 }]}>
              <View style={styles.button}>
                <Icon.Button
                  name="instagram"
                  backgroundColor="#ffffff"
                  onPress={this.loginWithInstagram}
                  {...iconStyles}
                >
                  Instagram
                </Icon.Button>
              </View>
              <View style={{ width: 15 }} />
              <View style={styles.button}>
                <Icon.Button name="google" backgroundColor="#ffffff" onPress={this.loginWithGoogle} {...iconStyles}>
                  Google
                </Icon.Button>
              </View>
            </View>
          </View>
        )}
      </KeyBoardAware>
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
  iconStyle: { padding: 3 },
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
    marginVertical: 7.5,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
  },
});

const mapStateToProps = state => ({
  user: state.user,
  registerRequest: state.registerRequest,
  ui: state.ui,
});

const mapDispatchToProps = (dispatch, ownProps) => {
  const { navigation } = ownProps;
  // setNavigator(navigation);
  return {
    setToken: token => dispatch(setToken(token)),
    startOauthLogin: network => dispatch(startOauthLogin(network)),
    startLoginWithPass: (username, password) => dispatch(startLoginWithPass(username, password)),
    startRegister: (name, username, password, password2) =>
      dispatch(registerRequest.start({ name, username, password, password2 })),
    goToCalendar: () => dispatch(rootNavigate('TabsNavigator')),
    goToOauth: params => dispatch(rootNavigate('OAuthView', params)),
    setAuth: () => dispatch(ui.setAuth()),
    setReg: () => dispatch(ui.setReg()),
    navigate: navigation.navigate,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
