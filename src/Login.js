import React, { Component } from 'react';
import { StyleSheet, Text, View, Linking, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';

function serialize(params, obj, traditional, scope) {
  let type;
  const array = false;
  const hash = true;
  const add = (arr, key, _value) => {
    let value = _value;
    if (value == null) value = '';
    arr.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
  };
  Object.keys(obj).forEach((value, _key) => {
    let key = _key;
    type = typeof value;
    if (scope) {
      key = traditional ? scope : `${scope}[${hash || type === 'object' || type === 'array' ? key : ''}]`;
    }
    // handle data in serializeArray() format
    if (!scope && array) add(params, value.name, value.value);
    else if (type === 'array' || (!traditional && type === 'object')) {
      serialize(params, value, traditional, key);
    } else add(params, key, value);
  });
}

function param(obj, traditional) {
  const params = [];
  serialize(params, obj, traditional);
  return params.join('&').replace(/%20/g, '+');
}

export default class Login extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
      dispatch: PropTypes.func.isRequired,
    }),
  };

  state = {
    user: undefined, // user has not logged in yet
  };

  // Set up Linking
  componentDidMount() {
    // Add event listener to handle OAuthLogin:// URLs
    Linking.addEventListener('url', this.handleOpenURL);
    // Launched from an external URL
    Linking.getInitialURL().then((url) => {
      if (url) {
        this.handleOpenURL({ url });
      }
    });
  }

  componentWillUnmount() {
    // Remove event listener
    Linking.removeEventListener('url', this.handleOpenURL);
  }

  handleOpenURL = ({ url }) => {
    // Extract stringified user string out of the URL
    const [, user_string] = url.match(/user=([^#]+)/);
    this.setState({
      // Decode the user string and parse it into JSON
      user: JSON.parse(decodeURI(user_string)),
    });
    /*
    if (Platform.OS === 'ios') {
      SafariView.dismiss();
    }
    */
  };

  loginWithFacebook1 = () => {
    this.openURL('http://sportiq.io/signin/facebook');
  };
  // Handle Login with Facebook button tap
  loginWithFacebook = () => {
    /*
    const data = 'scope=publish_actions';

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function () {
      if (this.readyState === 4) {
        console.log(this.responseText);
      }
    });

    xhr.open('POST', 'http://sportiq.io/signin/facebook');
    xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
    xhr.send(data);
    */


    fetch('http://sportiq.io/signin/facebook', {
      method: 'POST',
      redirect: 'follow',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'scope=public_profile',
    })
      .then((data) => {
        console.log(data);
        return data;
      })
      .catch((err) => {
        console.log(err);
      });

    /*
    fetch('http://sportiq.io/loggedUser', {
      headers: {
        Cookie: 'language=ru; SESSION=3a0425be-d9d6-47b8-89dc-4e529d2b42f2;',
      },
    })
      .then((data) => {
        console.log(data);
        return data.json();
      })
      .then(d => console.log(d))
      .catch(e => console.log(e));
      */
    // this.openURL('http://sportiq.io/signin/facebook');
  };

  // Handle Login with Google button tap
  loginWithGoogle = () => this.openURL('http://sportiq.io/signin/google');

  loginWithAbstract = () => this.props.navigation.navigate('MyCalendar');

  // Open URL in a browser
  openURL = (url) => {
    // Use SafariView on iOS
    /*
    if (Platform.OS === 'ios') {
      SafariView.show({
        url: url,
        fromBottom: true,
      });
    }
    // Or Linking.openURL on Android
    else {
      Linking.openURL(url);
    }
    */
    // >>
    Linking.openURL(url);
    // <<
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
          <Icon name="user-circle" size={100} color="rgba(0,0,0,.09)" />
        </View>
        <Text style={styles.text}>
            Please log in to continue {'\n'}
            to the awesomness
        </Text>
      </View>
    );
  }

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
          <Icon.Button name="google" backgroundColor="#DD4B39" onPress={this.loginWithAbstract} {...iconStyles}>
            Or with Google
          </Icon.Button>
        </View>
        <View style={styles.buttons}>
          <Icon.Button name="vk" backgroundColor="#45688e" onPress={this.loginWithAbstract} {...iconStyles}>
            or with VK
          </Icon.Button>
        </View>
        <View style={styles.buttons}>
          <Icon.Button name="instagram" backgroundColor="#cc486a" onPress={this.loginWithAbstract} {...iconStyles}>
            Or with Instagram
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
