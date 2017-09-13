// @flow
/* eslint-disable no-nested-ternary */
/* eslint-disable react/sort-comp */
/* eslint-disable react/prop-types */

import React, { Component } from 'react';
import { View, TouchableWithoutFeedback, StyleSheet } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

const styles = StyleSheet.create({
  starsWrapper: {
    width: 20,
    height: 20,
    flexDirection: 'row',
    position: 'relative',
  },
  starLogicalPixel: {
    left: -20,
    width: 10,
    height: 20,
    position: 'relative',
    backgroundColor: 'transparent',
  },
  starIcon: {
    fontSize: 20,
    position: 'relative',
    color: '#EEB211',
  },
  starFullLogicalPixel: {
    left: -20,
    width: 20,
    height: 20,
    position: 'relative',
    backgroundColor: 'transparent',
  },
});

export default class Stars extends Component {
  constructor(props) {
    super(props);
    const { rounding } = this.props;
    this.state = {
      activeIndex:
        this.props.rate === 0
          ? 0
          : rounding === 'up' ? Math.round(this.props.rate * 2) / 2 : Math.floor(this.props.rate * 2) / 2,
    };
  }
  componentWillReceiveProps(nextProps) {
    const { rounding } = nextProps;
    this.setState({
      activeIndex:
        nextProps.rate === 0
          ? 0
          : rounding === 'up' ? Math.round(nextProps.rate * 2) / 2 : Math.floor(nextProps.rate * 2) / 2,
    });
  }

  changeActiveIndex(i: number) {
    const { onStarPress, isHalfStarEnabled } = this.props;
    if (onStarPress) {
      onStarPress(isHalfStarEnabled ? i / 2 : i);
    }
    this.setState({
      activeIndex: isHalfStarEnabled ? i / 2 : i,
    });
  }
  render() {
    const { size, color, rateMax, isActive, isHalfStarEnabled } = this.props;
    let customSize = null;
    let starCustomStyle = null;
    const stars = [];
    let starShape = '';
    if (isHalfStarEnabled) {
      if (size != null) {
        customSize = {
          width: size / 2,
          height: size,
        };
        starCustomStyle = {
          fontSize: size,
          color: color || '#EEB211',
        };
      } else {
        starCustomStyle = {
          color: color || '#EEB211',
        };
      }
      const rateCount = this.state.activeIndex * 2;
      let currIndex = 0;
      const extraStyle = {
        left: size ? size * -1 : -20,
      };
      for (let i = 1; i <= rateCount; i++) {
        if (i % 2 === 0) {
          currIndex = i;
          starShape = 'star';
          stars.push(
            <View key={i} style={[styles.starsWrapper, size ? { width: size, height: size } : {}]}>
              <Icon name={starShape} style={[styles.starIcon, starCustomStyle]} />
              <TouchableWithoutFeedback onPress={() => (isActive ? this.changeActiveIndex(i - 1) : {})}>
                <View style={[styles.starLogicalPixel, customSize, extraStyle]} />
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={() => (isActive ? this.changeActiveIndex(i) : {})}>
                <View style={[styles.starLogicalPixel, customSize, extraStyle]} />
              </TouchableWithoutFeedback>
            </View>,
          );
        } else if (i === rateCount) {
          currIndex = i + 1;
          starShape = 'star-half';
          stars.push(
            <View key={i} style={[styles.starsWrapper, size ? { width: size, height: size } : {}]}>
              <Icon name={starShape} style={[styles.starIcon, starCustomStyle]} />
              <TouchableWithoutFeedback onPress={() => (isActive ? this.changeActiveIndex(i) : {})}>
                <View style={[styles.starLogicalPixel, customSize, extraStyle]} />
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={() => (isActive ? this.changeActiveIndex(i + 1) : {})}>
                <View style={[styles.starLogicalPixel, customSize, extraStyle]} />
              </TouchableWithoutFeedback>
            </View>,
          );
        }
      }
      const maxRateCount = rateMax * 2;
      for (let i = currIndex + 1; i <= maxRateCount; i++) {
        if (i % 2 === 0) {
          stars.push(
            <View key={i} style={[styles.starsWrapper, size ? { width: size, height: size } : {}]}>
              <Icon name="star-border" style={[styles.starIcon, starCustomStyle]} />
              <TouchableWithoutFeedback onPress={() => (isActive ? this.changeActiveIndex(i - 1) : {})}>
                <View style={[styles.starLogicalPixel, customSize, extraStyle]} />
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={() => (isActive ? this.changeActiveIndex(i) : {})}>
                <View style={[styles.starLogicalPixel, customSize, extraStyle]} />
              </TouchableWithoutFeedback>
            </View>,
          );
        }
      }
    } else {
      if (size != null) {
        customSize = {
          width: size,
          height: size,
        };
        starCustomStyle = {
          fontSize: size,
          color: color || '#EEB211',
        };
      }
      const extraStyle = {
        left: size ? size * -1 : -20,
      };
      const currIndex = this.state.activeIndex;
      for (let i = 1; i <= currIndex; i++) {
        starShape = 'star';
        stars.push(
          <View key={i} style={[styles.starsWrapper, customSize]}>
            <Icon name={starShape} style={[styles.starIcon, starCustomStyle]} />
            <TouchableWithoutFeedback onPress={() => (isActive ? this.changeActiveIndex(i) : null)}>
              <View style={[styles.starFullLogicalPixel, customSize, extraStyle]} />
            </TouchableWithoutFeedback>
          </View>,
        );
      }
      for (let i = currIndex + 1; i <= rateMax; i++) {
        starShape = 'star-border';
        stars.push(
          <View key={i} style={[styles.starsWrapper, customSize]}>
            <Icon name={starShape} style={[styles.starIcon, starCustomStyle]} />
            <TouchableWithoutFeedback onPress={() => (isActive ? this.changeActiveIndex(i) : null)}>
              <View style={[styles.starFullLogicalPixel, customSize, extraStyle]} />
            </TouchableWithoutFeedback>
          </View>,
        );
      }
    }
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <TouchableWithoutFeedback onPress={() => this.changeActiveIndex(0)}>
          <View style={{ width: 20, height: 30 }} />
        </TouchableWithoutFeedback>
        {stars}
        <TouchableWithoutFeedback onPress={() => this.changeActiveIndex(isHalfStarEnabled ? rateMax * 2 : rateMax)}>
          <View style={{ width: 20, height: 30 }} />
        </TouchableWithoutFeedback>
      </View>
    );
  }
}
