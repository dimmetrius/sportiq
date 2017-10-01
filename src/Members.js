/* eslint-disable no-underscore-dangle */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
  Dimensions,
  Switch,
} from 'react-native';
import ApiRequest from './utils/ApiRequest';
import GroupHeader from './components/GroupHeader';
import WebViewAutoHeight from './components/WebViewAutoHeight';

const { width } = Dimensions.get('window');
const ROW_HEIGHT = 60;

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
      switches: {},
      members: [],
    };
  }

  componentDidMount() {
    this.refreshMembers();
  }

  refreshMembers = () => {
    ApiRequest.getMember(this.props.navigation.state.params.id).then((data) => {
      const newState = {
        ...this.state,
        members: data,
        switches: {},
        loading: false,
      };
      console.log(newState);
      this.setState(newState);
    });
  }

  checkMember = (member) => {
    const { id } = this.props.navigation.state.params;
    const was = member._links.uncheck !== undefined;
    const switches = this.state.switches;
    const s = {}; s[member.id] = !was;
    this.setState({
      switches: {
        ...switches,
        ...s,
      },
    });
    ApiRequest.checkMember(id, member.user.id, was).then(() => {
      this.refreshMembers();
    });
  }

  renderCheck = (member) => {
    const { billable } = this.props.navigation.state.params;
    let was = member._links.uncheck !== undefined;
    let disabled = false;
    const switches = this.state.switches;
    if (switches[member.id] !== undefined) {
      was = switches[member.id];
      disabled = true;
    }
    if (!billable) return null;
    if (member._links.check || member._links.uncheck) {
      return (
        <View
          style={{
            width: 80,
            height: 30,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 15,
            flexDirection: 'column',
            // backgroundColor: '#2ecc71',
          }}
        >
          <Text style={{ fontSize: 10, color: was ? 'black' : 'red' }}>
            {was ? 'Присутствовал' : 'Отсутствовал'}
          </Text>
          <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
            <Switch
              style={{ margin: 5 }}
              disabled={disabled}
              value={was}
              onValueChange={() => {
                console.log('onValueChange');
                this.checkMember(member);
              }}
            />
          </View>
        </View>
      );
    }
    return (
      <View
        style={{
          width: 80,
          height: 30,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 11, color: 'red' }}>Нет</Text>
          <Text style={{ fontSize: 11, color: 'red' }}>абонемента</Text>
        </View>
      </View>
    );
  }

  renderMember = (member) => {
    const img = member.user.image.list.url;
    return (
      <View
        key={member.id}
        style={{ flex: 1, marginLeft: 10, marginRight: 10, marginTop: 5, marginBottom: 5, backgroundColor: '#ffffff' }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', height: ROW_HEIGHT }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', width: ROW_HEIGHT, height: ROW_HEIGHT }}>
            <Image style={{ width: ROW_HEIGHT, height: ROW_HEIGHT }} source={{ uri: img }} />
          </View>
          <View style={{ flexDirection: 'row', width: width - (ROW_HEIGHT + 20), height: ROW_HEIGHT }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                height: ROW_HEIGHT,
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}
            >
              <Text style={{ marginLeft: 10 }}>{member.user.name}</Text>
            </View>
            <View
              style={{
                width: 100,
                height: ROW_HEIGHT,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {this.renderCheck(member)}
            </View>
          </View>
        </View>
      </View>
    );
  }

  renderDescription = () => {
    const { description } = this.props.navigation.state.params;
    if (!description) return null;
    const html = description.replace(' class="MsoNormal"', '', 'g');
    return (
      <View style={{
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
            width: width - 31,
            height: 0,
            margin: 5,
          }}
          source={{ html: `<body>${html}</body>` }}
        />
      </View>
    );
  }

  render() {
    const { loading, members } = this.state;
    const item = this.props.navigation.state.params;

    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          {
            loading ?
              <ActivityIndicator animating color={'white'} size={1} /> :
              <ScrollView>
                <View style={{ flexDirection: 'column', paddingTop: 10 }}>
                  <GroupHeader item={item} />
                  <Text style={{
                    fontSize: 15,
                    fontWeight: 'bold',
                    margin: 10,
                    marginVertical: 5,
                  }}
                  >
                    {item.group.name}
                  </Text>
                  {this.renderDescription()}
                </View>
                {members.map(member => this.renderMember(member))}
              </ScrollView>
          }
        </View>
      </View>
    );
  }
}

export default Members;
