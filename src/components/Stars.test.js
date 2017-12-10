import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import Stars from './Stars';

it('renders correctly', () => {
  const rendered = renderer.create(<Stars />).toJSON();
  expect(rendered).toBeTruthy();
});
