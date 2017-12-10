import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import BackButton from './BackButton';

it('renders correctly', () => {
  const rendered = renderer
    .create(
      <BackButton
        navigation={{
          dispatch() {},
          navigate() {},
          state: {},
        }}
      />,
    )
    .toJSON();
  expect(rendered).toBeTruthy();
});
