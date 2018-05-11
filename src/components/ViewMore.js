import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import PropTypes from 'prop-types';

const defHeight = 40;

class ViewMore extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      contentHeight: 0,
      componentHeight: 0,
      needExpand: false,
      expanded: false,
    };
  }

  componentWillReceiveProps() {}

  componentDidUpdate() {}

  onContentLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    const { expanded } = this.state;
    const contentHeight = height;
    let componentHeight;
    let _expanded;
    let needExpand;

    if (contentHeight > defHeight) {
      needExpand = true;
      _expanded = expanded;
      if (expanded) {
        componentHeight = contentHeight;
      } else {
        componentHeight = defHeight;
      }
    }

    if (contentHeight <= defHeight) {
      needExpand = false;
      _expanded = false;
      componentHeight = contentHeight;
    }

    this.setState({
      componentHeight,
      contentHeight,
      needExpand,
      expanded: _expanded,
    });
  };

  onPressMore = () => {
    const { contentHeight } = this.state;
    this.setState({
      expanded: true,
      componentHeight: contentHeight,
    });
  };

  onPressLess = () => {
    this.setState({
      expanded: false,
      componentHeight: defHeight,
    });
  };

  renderViewMore = () => <Text onPress={this.onPressMore}>View More</Text>;

  renderViewLess = () => <Text onPress={this.onPressLess}>View Less</Text>;

  renderFooter = () => {
    const { needExpand, expanded } = this.state;

    if (needExpand === true) {
      if (expanded === false) {
        return (this.props.renderViewMore || this.renderViewMore)(this.onPressMore);
      }
      return (this.props.renderViewLess || this.renderViewLess)(this.onPressLess);
    }
    return null;
  };

  render() {
    const { componentHeight } = this.state;
    return (
      <View>
        <View style={{ height: componentHeight }}>
          <ScrollView
            scrollEnabled={false}
            ref={(ref) => {
              this._scrollView = ref;
            }}
          >
            <View onLayout={this.onContentLayout}>{this.props.children}</View>
          </ScrollView>
          <View
            style={{
              width: '100%',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {this.renderFooter()}
          </View>
        </View>
      </View>
    );
  }
}

ViewMore.propTypes = {
  renderViewMore: PropTypes.func,
  renderViewLess: PropTypes.func,
  children: PropTypes.node,
};

export default ViewMore;
