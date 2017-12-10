import React from 'react';
import PropTypes from 'prop-types';
import { View, Keyboard, LayoutAnimation } from 'react-native';

export default class KeyBoardAware extends React.Component {
  constructor() {
    super();
    this.state = {
      keyboardOffset: 0,
    };
  }

  componentDidMount() {
    this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow, this);
    this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide, this);
  }

  componentWillUnmount() {
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
  }

  keyboardWillHide() {
    const { keyboardWillHide } = this.props;
    this.setState({
      keyboardOffset: 0,
    });
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    keyboardWillHide();
  }

  keyboardWillShow(e) {
    const { keyboardWillShow } = this.props;
    this.setState({
      keyboardOffset: e.endCoordinates.height - this.props.bottomOffset,
    });
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    keyboardWillShow();
  }

  render() {
    const { style, children } = this.props;
    return (
      <View style={[style, { marginBottom: this.state.keyboardOffset }]}>
        {children}
      </View>
    );
  }
}

KeyBoardAware.propTypes = {
  bottomOffset: PropTypes.number,
  children: PropTypes.array,
  style: PropTypes.number,
  keyboardWillShow: PropTypes.func,
  keyboardWillHide: PropTypes.func,
};

KeyBoardAware.defaultProps = {
  bottomOffset: 0,
  children: null,
  style: {},
  keyboardWillShow() {},
  keyboardWillHide() {},
};
