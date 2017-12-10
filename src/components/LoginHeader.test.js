import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import LoginHeader from './LoginHeader';

it('renders correctly', () => {
  const rendered = renderer.create(<LoginHeader height={100} />).toJSON();
  expect(rendered).toBeTruthy();
});
