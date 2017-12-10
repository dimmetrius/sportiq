import React from 'react';
import { Animated, Keyboard } from 'react-native';

export default class KeyBoardAware extends React.Component {
  constructor() {
    super();
    this.state = {
      keyboardOffset: new Animated.Value(0),
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

  keyboardWillHide(e) {
    const { keyboardWillHide } = this.props;
    Animated.timing(this.state.keyboardOffset, {
      toValue: 0,
      duration: e.duration,
    }).start();
    keyboardWillHide();
  }

  keyboardWillShow(e) {
    const { keyboardWillShow } = this.props;
    Animated.timing(this.state.keyboardOffset, {
      toValue: e.endCoordinates.height - this.props.bottomOffset,
      duration: e.duration,
    }).start();
    keyboardWillShow();
  }

  render() {
    const { style, children } = this.props;
    return (
      <Animated.View style={[style, { marginBottom: this.state.keyboardOffset }]}>
        {children}
      </Animated.View>
    );
  }
}

KeyBoardAware.defaultProps = {
  bottomOffset: 0,
  children: null,
  style: {},
  keyboardWillShow() {},
  keyboardWillHide() {},
};
