import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import PropTypes from 'prop-types';
import ApiRequest from './../utils/ApiRequest';

class User extends Component {
  static propTypes = {
    id: PropTypes.string,
  };

  state = {
    loading: true,
    user: {},
  }

  componentDidMount() {
    const { id } = this.props;
    ApiRequest.getUser(id).then((data) => {
      this.setState({
        loading: false,
        user: data,
      });
    });
  }

  render() {
    const img = this.state.user.image.list.url;
    const { name, address, phone } = this.state.user;
    return (
      <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        {
          this.state.loading ?
            <Text>Загрузка...</Text>
            :
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Image style={{ width: 60, height: 60 }} source={{ uri: img }} />
              {name ? <Text>{name}</Text> : null}
              {address ? <Text>{address}</Text> : null}
              {phone ? <Text>{phone}</Text> : null}
            </View>
        }
      </View>
    );
  }
}

export default User;
