import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, Image } from 'react-native';
import headerImage from './../icons/headerGirl.png';

const propTypes = {
  height: PropTypes.number,
};

const LoginHeader = ({ height }) => (
  <View style={[styles.container, { height }]}>
    {height > 0 ? (
      <View style={styles.content}>
        <View style={styles.absolute}>
          <Image style={styles.image} source={headerImage} />
        </View>
        <View style={styles.textLayer}>
          <View style={styles.textBox}>
            <Text style={styles.text}>{'SportIQ'}</Text>
          </View>
        </View>
      </View>
    ) : null}
  </View>
);

LoginHeader.propTypes = propTypes;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  content: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: 'transparent',
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  image: {
    flex: 1,
    width: '100%',
    resizeMode: 'cover',
  },
  textLayer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBox: {
    width: 225,
    height: 70,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Intro-Book',
    fontSize: 36,
    textAlign: 'center',
    color: '#ffffff',
  },
});

export default LoginHeader;
