import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, Image, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import ApiRequest from './utils/ApiRequest';

var {height, width} = Dimensions.get('window');

class Members extends Component {
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
      members: [],
    };
  }

  componentDidMount() {
    ApiRequest.getMember(this.props.navigation.state.params.id).then((data) => {
      const newState = {
        ...this.state,
        members: data,
        loading: false,
      };
      console.log(newState);
      this.setState(newState);
    });
  }

  saveResult = () => {}

  renderMember = (member) => {
    const img = member.user.image.list.url;
    return (
      <View
        key={member.id}
        style={{ flex: 1, marginTop: 5, marginBottom: 5, backgroundColor: '#ffffff' }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', height: 50 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', width: 50, height: 50 }}>
            <Image style={{ width: 50, height: 50 }} source={{ uri: img }} />
          </View>
          <View style={{ flexDirection: 'row', width: width - 60, height: 50 }}>
            <View style={{ flex: 1, flexDirection: 'row', height: 50, alignItems: 'center', justifyContent: 'flex-start' }}>
              <Text style={{ marginLeft: 10 }}>{member.user.name}</Text>
            </View>
            <View style={{ width: 100, height: 50, alignItems: 'center', justifyContent: 'center' }}>
              <TouchableOpacity style={{ width: 80, height: 30, alignItems: 'center', justifyContent: 'center', borderRadius: 15, backgroundColor: '#2ecc71' }}>
                <Text style={{ fontSize: 11 }}>Отметить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }

  render() {
    const { navigation } = this.props;
    const { loading, members } = this.state;
    return (
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
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          {
            loading ?
              <ActivityIndicator animating color={'white'} size={1} /> :
              <ScrollView>
                {members.map(member => this.renderMember(member))}
              </ScrollView>
          }
        </View>
      </View>
    );
  }
}

export default Members;
