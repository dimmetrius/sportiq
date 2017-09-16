import React from 'react';
import { WebView, View } from 'react-native';

// eslint-disable-next-line
const BODY_TAG_PATTERN = /\<\/ *body\>/;

// Do not add any comments to this! It will break because all line breaks will removed for
// some weird reason when this script is injected.
const script = `
;(function() {
var wrapper = document.createElement("div");
wrapper.id = "height-wrapper";
while (document.body.firstChild) {
    wrapper.appendChild(document.body.firstChild);
}

document.body.appendChild(wrapper);

var i = 0;
function updateHeight() {
    document.title = wrapper.clientHeight;
    window.location.hash = ++i;
}
updateHeight();

window.addEventListener("load", function() {
    updateHeight();
    setTimeout(updateHeight, 1000);
});

window.addEventListener("resize", updateHeight);
}());
`;

const htmlstyle = `
<style>
body, html, #height-wrapper {
    margin: 0;
    padding: 10;
}
#height-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
}
</style>
<script>
${script}
</script>
`;

const codeInject = html => html.replace(BODY_TAG_PATTERN, `${htmlstyle}</body>`);

/**
 * Wrapped Webview which automatically sets the height according to the
 * content. Scrolling is always disabled. Required when the Webview is embedded
 * into a ScrollView with other components.
 *
 * Inspired by this SO answer http://stackoverflow.com/a/33012545
 * */
const WebViewAutoHeight = React.createClass({

  getDefaultProps() {
    return { minHeight: 10 };
  },

  getInitialState() {
    return {
      realContentHeight: this.props.minHeight,
    };
  },

  handleNavigationChange(navState) {
    if (navState.title) {
      const realContentHeight = parseInt(navState.title, 10) || 0; // turn NaN to 0
      this.setState({ realContentHeight });
    }
    if (typeof this.props.onNavigationStateChange === 'function') {
      this.props.onNavigationStateChange(navState);
    }
  },

  render() {
    const { source, style, minHeight, ...otherProps } = this.props;
    const html = source.html;

    if (!html) {
      throw new Error('WebViewAutoHeight supports only source.html');
    }

    if (!BODY_TAG_PATTERN.test(html)) {
      throw new Error(`Cannot find </body> from: ${html}`);
    }

    return (
      <View>
        <WebView
          {...otherProps}
          source={{ html: codeInject(html) }}
          scrollEnabled={false}
          style={[style, { height: Math.max(this.state.realContentHeight, minHeight) }]}
          javaScriptEnabled
          onNavigationStateChange={this.handleNavigationChange}
        />
      </View>
    );
  },
});

export default WebViewAutoHeight;
