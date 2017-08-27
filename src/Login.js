import React, { Component } from "react";
import { AppRegistry, StyleSheet, Text, View, Linking } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

export default class Login extends Component {
  state = {
    user: undefined // user has not logged in yet
  };

  // Set up Linking
  componentDidMount() {
    // Add event listener to handle OAuthLogin:// URLs
    Linking.addEventListener("url", this.handleOpenURL);
    // Launched from an external URL
    Linking.getInitialURL().then(url => {
      if (url) {
        this.handleOpenURL({ url });
      }
    });
  }

  componentWillUnmount() {
    // Remove event listener
    Linking.removeEventListener("url", this.handleOpenURL);
  }

  handleOpenURL = ({ url }) => {
    // Extract stringified user string out of the URL
    const [, user_string] = url.match(/user=([^#]+)/);
    this.setState({
      // Decode the user string and parse it into JSON
      user: JSON.parse(decodeURI(user_string))
    });
    /*
    if (Platform.OS === 'ios') {
      SafariView.dismiss();
    }
    */
  };

  loginWithFacebook = () => {
    this.openURL('http://sportiq.io/signin/facebook');
  }
  // Handle Login with Facebook button tap
  loginWithFacebook1= () => {

    fetch("http://sportiq.io/signin/facebook", {
      method: "POST",
      redirect: "error",

      headers: {
        Origin: "http://sportiq.io",
        "Upgrade-Insecure-Requests": 1,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        Referer: "http://sportiq.io/",
        //Accept-Encoding: gzip, deflate
        //Accept-Language: ru-RU,ru;q=0.8,en-US;q=0.6,en;q=0.4
        Cookie: "language=ru;"
      }
    })
      .then(data => {
        console.log(data);
        return data;
      })
      .catch(err => {
        console.log(err);
      });

    fetch(
      "http://sportiq.io/loggedUser",
      {
        headers: {
          Cookie: "language=ru; SESSION=3a0425be-d9d6-47b8-89dc-4e529d2b42f2;"
        }
      }
    )
    .then(data => {
      console.log(data);
      return data.json();
    })
    .then(d => console.log(d))
    .catch(e => console.log(e));
    //this.openURL('http://sportiq.io/signin/facebook');
  };

  // Handle Login with Google button tap
  loginWithGoogle = () => this.openURL("http://sportiq.io/signin/google");

  loginWithAbstract = () => this.props.navigation.navigate('MyCalendar');

  // Open URL in a browser
  openURL = url => {
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
    //>>
    Linking.openURL(url);
    //<<
  };

  render() {
    const { user } = this.state;
    return (
      <View style={styles.container}>
        {user
          ? // Show user info if already logged in
            <View style={styles.content}>
              <Text style={styles.header}>
                Welcome {user.name}!
              </Text>
              <View style={styles.avatar}>
                <Image
                  source={{ uri: user.avatar }}
                  style={styles.avatarImage}
                />
              </View>
            </View>
          : // Show Please log in message if not
            <View style={styles.content}>
              <Text style={styles.header}>Welcome Stranger!</Text>
              <View style={styles.avatar}>
                <Icon name="user-circle" size={100} color="rgba(0,0,0,.09)" />
              </View>
              <Text style={styles.text}>
                Please log in to continue {"\n"}
                to the awesomness
              </Text>
            </View>}
        {/* Login buttons */}
        <View style={styles.buttons}>
          <Icon.Button
            name="facebook"
            backgroundColor="#3b5998"
            onPress={this.loginWithFacebook}
            {...iconStyles}
          >
            Login with Facebook
          </Icon.Button>
        </View>
        <View style={styles.buttons}>
          <Icon.Button
            name="google"
            backgroundColor="#DD4B39"
            onPress={this.loginWithAbstract}
            {...iconStyles}
          >
            Or with Google
          </Icon.Button>
        </View>
        <View style={styles.buttons}>
          <Icon.Button
            name="vk"
            backgroundColor="#45688e"
            onPress={this.loginWithAbstract}
            {...iconStyles}
          >
            or with VK
          </Icon.Button>
        </View>
        <View style={styles.buttons}>
          <Icon.Button
            name="instagram"
            backgroundColor="#cc486a"
            onPress={this.loginWithAbstract}
            {...iconStyles}
          >
            Or with Instagram
          </Icon.Button>
        </View>
      </View>
    );
  }
}
const iconStyles = {
  borderRadius: 10,
  iconStyle: { paddingVertical: 5},
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  avatar: {
    margin: 20
  },
  avatarImage: {
    borderRadius: 50,
    height: 100,
    width: 100
  },
  header: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  text: {
    textAlign: "center",
    color: "#333",
    marginBottom: 5
  },
  buttons: {
    justifyContent: "space-between",
    flexDirection: "column",
    margin: 20,
    marginBottom: 30
  }
});
