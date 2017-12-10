import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import BackButton from './BackButton';

it('renders correctly', () => {
  renderer.create(
    <BackButton
      navigation={{
        dispatch() {},
        navigate() {},
        state: {},
      }}
    />,
  );
});
