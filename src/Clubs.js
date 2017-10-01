/* eslint-disable no-underscore-dangle */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import ApiRequest from './utils/ApiRequest';
import WebViewAutoHeight from './components/WebViewAutoHeight';
import sport from './icons/sport';

const { width } = Dimensions.get('window');
const ROW_HEIGHT = width - 20;

class Clubs extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
      dispatch: PropTypes.func.isRequired,
      state: PropTypes.shape(),
    }),
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      clubs: [],
    };
  }

  componentDidMount() {
    this.refreshClubs();
  }

  refreshClubs = () => {
    ApiRequest.getClubs().then((data) => {
      const newState = {
        ...this.state,
        clubs: data,
        loading: false,
      };
      this.setState(newState);
    });
  }

  renderClub = (club) => {
    const img = club.image.list.url;
    return (
      <TouchableOpacity
        key={club.id}
        style={{ flex: 1, marginLeft: 10, marginRight: 10, marginTop: 5, marginBottom: 5, backgroundColor: '#ffffff' }}
        onPress={() => this.props.navigation.navigate('Club', { item: club })}
      >
        <View style={{ flexDirection: 'column', alignItems: 'center', height: ROW_HEIGHT }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', width: ROW_HEIGHT, height: ROW_HEIGHT * 0.5 }}>
            <Image style={{ width: ROW_HEIGHT, height: ROW_HEIGHT * 0.5 }} source={{ uri: img }} />
            <View style={{
              position: 'absolute',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
              right: 5,
              bottom: 5,
              height: 20,
              width: 50,
              borderRadius: 10,
            }}
            >
              <Icon name="users" color="black" />
              <Text style={{ marginLeft: 3 }}>{club.membersCount}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'column', width: ROW_HEIGHT, height: ROW_HEIGHT * 0.5 }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                height: ROW_HEIGHT * 0.5,
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
              }}
            >
              <Text style={{ marginLeft: 10, marginTop: 5, fontWeight: 'bold' }}>{club.name}</Text>
              <Text style={{ marginLeft: 10, marginTop: 5 }}>{club.overview}</Text>
              <View style={{
                margin: 5,
                width: ROW_HEIGHT,
                flexDirection: 'row',
                alignItems: 'flex-start',
              }}
              >
                {club.activities.map(activity => this.renderActivity(activity))}
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  renderActivity = activity => (
    <View
      key={activity.className}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 5,
        borderRadius: 5,
        width: 40,
        height: 40,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'black',
      }}
    >
      <Text style={{ fontSize: 24, fontFamily: 'sports-48-x-48' }}>
        {sport[activity.className] || ''}
      </Text>
    </View>
  );

  renderDescription = (club) => {
    const { description } = club;
    if (!description) return null;
    const html = description.replace(' class="MsoNormal"', '', 'g');
    return (
      <View style={{
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 10,
        marginLeft: 10,
        marginRight: 10,
      }}
      >
        <WebViewAutoHeight
          automaticallyAdjustContentInsets={false}
          scalesPageToFit={false}
          style={{
            width: ROW_HEIGHT,
            height: 0,
          }}
          source={{ html: `<body>${html}</body>` }}
        />
      </View>
    );
  }

  render() {
    const { loading, clubs } = this.state;

    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          {
            loading ?
              <ActivityIndicator animating color={'gray'} size={1} /> :
              <ScrollView>
                {clubs.map(club => this.renderClub(club))}
              </ScrollView>
          }
        </View>
        <TouchableOpacity
          style={{
            position: 'absolute',
            width: 50,
            height: 50,
            borderRadius: 25,
            alignItems: 'center',
            justifyContent: 'center',
            right: 10,
            bottom: 10,
            borderColor: 'gray',
            borderWidth: 1,
            backgroundColor: 'white',
          }}
          onPress={() => this.props.navigation.navigate('QrCode', { type: 'scan', mode: '1' })}
        >
          <Icon name="qrcode" size={25} color="black" />
        </TouchableOpacity>
      </View>
    );
  }
}

export default Clubs;
